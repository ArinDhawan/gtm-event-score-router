from scoring import calculate_score


REVIEW_THRESHOLD = 200
SUPPRESSION_DAYS = 30


def build_routing_queue(events, customers, trigger_threshold):
    queue = []
    for customer in customers:
        evidence = []
        suppressed = []

        for event in events:
            result = calculate_score(event, customer, trigger_threshold)
            if result["route"] == "No match":
                if result["excluded_terms"]:
                    suppressed.append({"event": event, "reason": result["reasoning"]})
                continue

            evidence.append(
                {
                    "event": event,
                    "score": result["score"],
                    "route": result["route"],
                    "matched_terms": result["matched_terms"],
                    "reasoning": result["reasoning"],
                }
            )

        total_score = min(400, sum(item["score"] for item in evidence))
        route = _route_for_total(total_score, bool(evidence), trigger_threshold)
        campaign = create_campaign(customer, evidence, total_score, route) if route == "Trigger sequence" else None

        queue.append(
            {
                "customer": customer,
                "total_score": total_score,
                "route": route,
                "evidence": evidence,
                "suppressed": suppressed,
                "campaign": campaign,
                "owner": customer.get("account_owner", "Growth"),
            }
        )

    queue.sort(key=lambda item: item["total_score"], reverse=True)
    return queue


def create_campaign(customer, evidence, total_score, route):
    primary_topic = _primary_topic(evidence)
    campaign_name = f"{primary_topic} Compliance Outreach"
    return {
        "name": campaign_name,
        "customer": customer["name"],
        "owner": customer.get("account_owner", "Growth"),
        "trigger_score": total_score,
        "status": "Ready to enroll",
        "suppression": f"{SUPPRESSION_DAYS} days after enrollment",
        "evidence_event_ids": [item["event"]["id"] for item in evidence],
        "emails": generate_email_sequence(customer, evidence, campaign_name),
        "payload": {
            "tool": "HubSpot",
            "action": "create_sequence_enrollment",
            "company": customer.get("crm_id", customer["name"]),
            "owner": customer.get("account_owner", "Growth"),
            "campaign": campaign_name,
            "evidence_event_ids": [item["event"]["id"] for item in evidence],
        },
    }


def generate_email_sequence(customer, evidence, campaign_name):
    event_titles = [item["event"]["title"] for item in evidence]
    product = customer["products"].lower()
    return [
        {
            "step": 1,
            "subject": f"{campaign_name} for {customer['name']}",
            "body": (
                f"Hi {{{{first_name}}}},\n\n"
                f"We noticed a cluster of regulatory updates that look relevant to "
                f"{customer['name']}'s {product} work: {', '.join(event_titles[:2])}.\n\n"
                "Worth comparing notes on whether these changes create new compliance work?"
            ),
        },
        {
            "step": 2,
            "subject": f"Why these updates may matter for {customer['name']}",
            "body": (
                f"Hi {{{{first_name}}}},\n\n"
                f"The signal is not just one isolated update. {len(evidence)} related events "
                f"pushed {customer['name']} over the routing threshold, which usually means "
                "there may be enough regulatory movement to justify a closer review.\n\n"
                "Happy to send over the event summary if useful."
            ),
        },
        {
            "step": 3,
            "subject": "Quick regulatory signal review?",
            "body": (
                f"Hi {{{{first_name}}}},\n\n"
                "Would it be useful to walk through the specific updates and where they may "
                f"touch {customer['name']}'s current product or compliance workflows?\n\n"
                "Open to a quick conversation this week?"
            ),
        },
    ]


def _route_for_total(total_score, has_evidence, trigger_threshold):
    if not has_evidence:
        return "No route"
    if total_score >= trigger_threshold:
        return "Trigger sequence"
    if total_score >= REVIEW_THRESHOLD:
        return "Needs review"
    return "Monitor only"


def _primary_topic(evidence):
    tags = []
    for item in evidence:
        tags.extend(item["event"].get("tags", []))

    for topic in ["Battery", "Cybersecurity", "Aerospace", "Medical Device", "Machinery"]:
        topic_key = topic.lower().split()[0]
        if any(topic_key in tag.lower() for tag in tags):
            return topic
    return "Regulatory Signal"
