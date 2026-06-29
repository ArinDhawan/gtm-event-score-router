import json
import os
import urllib.error
import urllib.parse
import urllib.request
from datetime import datetime, timedelta, timezone
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from time import time


ROOT = Path(__file__).resolve().parent
WEB_DIR = ROOT / "web"
HUBSPOT_BASE = "https://api.hubapi.com"
INDUSTRY_OPTIONS = {
    "Aerospace": "AVIATION_AEROSPACE",
    "Automotive": "AUTOMOTIVE",
    "Construction": "CONSTRUCTION",
    "Medical Devices": "MEDICAL_DEVICES",
}


def load_env():
    env_path = ROOT / ".env"
    if not env_path.exists():
        return

    for line in env_path.read_text().splitlines():
        line = line.strip().lstrip("\ufeff")
        if not line or line.startswith("#") or "=" not in line:
            continue
        if line.startswith("export "):
            line = line[len("export ") :]
        key, value = line.split("=", 1)
        os.environ[key.strip()] = value.strip().strip('"').strip("'")


def hubspot_request(method, path, payload=None):
    token = os.getenv("HUBSPOT_ACCESS_TOKEN")
    if not token:
        raise RuntimeError("Missing HUBSPOT_ACCESS_TOKEN in .env")

    body = None
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json",
    }
    if payload is not None:
        body = json.dumps(payload).encode("utf-8")

    request = urllib.request.Request(f"{HUBSPOT_BASE}{path}", data=body, headers=headers, method=method)
    try:
        with urllib.request.urlopen(request, timeout=20) as response:
            text = response.read().decode("utf-8")
            return json.loads(text) if text else {}
    except urllib.error.HTTPError as error:
        detail = error.read().decode("utf-8")
        raise RuntimeError(f"HubSpot {method} {path} failed: {error.code} {detail}") from error


def search_object(object_type, property_name, value):
    payload = {
        "filterGroups": [
            {
                "filters": [
                    {
                        "propertyName": property_name,
                        "operator": "EQ",
                        "value": value,
                    }
                ]
            }
        ],
        "limit": 1,
    }
    result = hubspot_request("POST", f"/crm/v3/objects/{object_type}/search", payload)
    results = result.get("results", [])
    return results[0] if results else None


def create_object(object_type, properties):
    return hubspot_request("POST", f"/crm/v3/objects/{object_type}", {"properties": properties})


def create_object_with_fallback(object_type, properties, fallback_properties):
    try:
        return create_object(object_type, properties)
    except RuntimeError as error:
        if "Property values were not valid" not in str(error) and "Property does not exist" not in str(error):
            raise
        return create_object(object_type, fallback_properties)


def upsert_company(campaign):
    customer = campaign["customer"]
    domain = customer.get("website")
    if domain:
        existing = search_object("companies", "domain", domain)
        if existing:
            return existing

    existing = search_object("companies", "name", customer["name"])
    if existing:
        return existing

    properties = {
        "name": customer["name"],
        "description": customer_description(customer),
    }
    if domain:
        properties["domain"] = domain
    industry = INDUSTRY_OPTIONS.get(customer.get("segment"))
    if industry:
        properties["industry"] = industry

    return create_object_with_fallback(
        "companies",
        properties,
        {"name": customer["name"]},
    )


def upsert_contact(campaign):
    customer = campaign["customer"]
    email = customer.get("contactEmail") or f"demo+{customer['id']}@example.com"
    existing = search_object("contacts", "email", email)
    if existing:
        return existing

    first_name, last_name = split_contact_name(customer.get("contactName") or customer.get("owner") or "Demo Contact")
    return create_object(
        "contacts",
        {
            "email": email,
            "firstname": first_name,
            "lastname": last_name,
            "company": customer["name"],
            "jobtitle": customer.get("contactTitle", "Compliance Lead"),
        },
    )


def create_deal(campaign):
    deal_name = f"{campaign['name']} - {campaign['customer']['name']}"
    existing = search_object("deals", "dealname", deal_name)
    if existing:
        existing["_created"] = False
        return existing

    deal = create_object_with_fallback(
        "deals",
        {
            "dealname": deal_name,
            "pipeline": "default",
            "dealstage": "appointmentscheduled",
            "amount": "0",
            "description": build_description(campaign),
        },
        {"dealname": deal_name},
    )
    deal["_created"] = True
    return deal


def try_create_email_draft_task(campaign, email, index, associations):
    due_at = datetime.now(timezone.utc) + timedelta(days=index + 1)
    try:
        task = create_object(
            "tasks",
            {
                "hs_task_subject": f"Email {index + 1} draft: {email['subject']}",
                "hs_task_body": build_email_task_body(campaign, email, index),
                "hs_timestamp": due_at.isoformat(),
                "hs_task_status": "NOT_STARTED",
                "hs_task_priority": "HIGH",
                "hs_task_type": "EMAIL",
            },
        )
        return attach_associations("tasks", task.get("id"), associations, task)
    except RuntimeError as error:
        return {"skipped": True, "reason": str(error)}


def create_email_draft_tasks(campaign, associations):
    return [
        try_create_email_draft_task(campaign, email, index, associations)
        for index, email in enumerate(campaign.get("emails", []))
    ]


def summarize_task_creation(campaign, tasks):
    expected = len(campaign.get("emails", []))
    created = len([task for task in tasks if task.get("id")])
    errors = [task.get("reason", "Unknown task creation error") for task in tasks if task.get("skipped")]
    return {
        "expected": expected,
        "created": created,
        "errors": errors,
        "complete": expected == created,
    }


def associate_objects(from_type, from_id, to_type, to_id):
    if not from_id or not to_id:
        return {"skipped": True, "reason": "Missing object id"}
    path = f"/crm/v4/objects/{from_type}/{from_id}/associations/default/{to_type}/{to_id}"
    try:
        hubspot_request("PUT", path)
        return {"ok": True, "from": from_type, "to": to_type}
    except RuntimeError as error:
        return {"skipped": True, "reason": str(error), "from": from_type, "to": to_type}


def attach_associations(from_type, from_id, associations, obj):
    obj["associations"] = [
        associate_objects(from_type, from_id, to_type, to_id)
        for to_type, to_id in associations
        if to_id
    ]
    return obj


def build_description(campaign):
    return f"Triggered campaign: {campaign['name']}"


def build_email_task_body(campaign, email, index):
    customer = campaign["customer"]
    return (
        f"To: {customer.get('contactName', 'Demo Contact')} <{customer.get('contactEmail', 'demo@example.com')}>\n"
        f"Subject: {email['subject']}\n\n"
        f"{email['body']}"
    )


def customer_description(customer):
    product_lines = ", ".join(customer.get("productLines", []))
    initiatives = ", ".join(customer.get("activeInitiatives", []))
    return f"{customer.get('segment', 'Manufacturing')} account. Products: {product_lines}. Active initiatives: {initiatives}."


def split_contact_name(name):
    parts = name.split()
    if len(parts) == 1:
        return parts[0], "Contact"
    return parts[0], " ".join(parts[1:])


def create_handoff(campaign):
    company = upsert_company(campaign)
    contact = upsert_contact(campaign)
    deal = create_deal(campaign)
    associations = [
        ("companies", company.get("id")),
        ("contacts", contact.get("id")),
        ("deals", deal.get("id")),
    ]
    association_results = [
        associate_objects("contacts", contact.get("id"), "companies", company.get("id")),
        associate_objects("deals", deal.get("id"), "contacts", contact.get("id")),
        associate_objects("deals", deal.get("id"), "companies", company.get("id")),
    ]
    tasks = create_email_draft_tasks(campaign, associations)
    task_summary = summarize_task_creation(campaign, tasks)
    return {
        "company": company.get("id"),
        "contact": contact.get("id"),
        "deal": deal.get("id"),
        "dealCreated": deal.get("_created", True),
        "note": {"skipped": True, "reason": "Notes disabled; email drafts are created as HubSpot tasks only."},
        "tasks": tasks,
        "taskSummary": task_summary,
        "associations": association_results,
        "sequenceStatus": "email_draft_tasks_created" if task_summary["complete"] else "email_draft_tasks_failed",
        "emailStatus": "awaiting_send_provider",
    }


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(WEB_DIR), **kwargs)

    def do_POST(self):
        if self.path != "/api/hubspot/handoff":
            self.send_json({"error": "Not found"}, status=404)
            return

        try:
            length = int(self.headers.get("Content-Length", "0"))
            payload = json.loads(self.rfile.read(length).decode("utf-8"))
            result = create_handoff(payload["campaign"])
            self.send_json({"ok": True, "result": result})
        except Exception as error:
            self.send_json({"ok": False, "error": str(error)}, status=500)

    def do_GET(self):
        if self.path == "/api/health":
            self.send_json(
                {
                    "ok": True,
                    "hubspotTokenConfigured": bool(os.getenv("HUBSPOT_ACCESS_TOKEN")),
                }
            )
            return
        super().do_GET()

    def send_json(self, payload, status=200):
        body = json.dumps(payload).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)


def main():
    load_env()
    port = int(os.getenv("PORT", "8601"))
    server = ThreadingHTTPServer(("0.0.0.0", port), Handler)
    print(f"Serving web UI + HubSpot API on http://localhost:{port}")
    server.serve_forever()


if __name__ == "__main__":
    main()
