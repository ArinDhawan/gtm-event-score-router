import re


THRESHOLD = 280
APPLICABILITY_MINIMUM = 45

EXCLUSION_PHRASES = (
    "not affected",
    "not impacted",
    "does not apply",
    "do not apply",
    "unaffected",
    "excluded",
    "not relevant",
)

SEVERE_TERMS = {"ban", "banned", "blocked", "prohibited"}

SYNONYMS = {
    "airplane": {"aerospace", "aircraft"},
    "airplanes": {"aerospace", "aircraft"},
    "automobile": {"automotive", "vehicle"},
    "automobiles": {"automotive", "vehicle"},
    "car": {"automotive", "vehicle"},
    "cars": {"automotive", "vehicle"},
    "electric": {"automotive", "ev", "vehicle", "battery", "charging"},
    "machinery": {"construction", "heavy", "machinery"},
    "plane": {"aerospace", "aircraft"},
    "planes": {"aerospace", "aircraft"},
    "surgical": {"medical", "device", "surgical"},
    "vehicle": {"automotive", "vehicle"},
    "vehicles": {"automotive", "vehicle"},
}

WEAK_TERMS = {
    "after",
    "against",
    "all",
    "and",
    "are",
    "asks",
    "can",
    "compliance",
    "confirmed",
    "deadline",
    "disclosures",
    "draft",
    "enforcement",
    "equipment",
    "eu",
    "global",
    "for",
    "from",
    "component",
    "components",
    "incident",
    "into",
    "looks",
    "manufacturers",
    "mandatory",
    "new",
    "outlines",
    "penalty",
    "proposed",
    "quality",
    "regulation",
    "regulators",
    "reporting",
    "requirements",
    "review",
    "safety",
    "standard",
    "standards",
    "supplier",
    "suppliers",
    "system",
    "systems",
    "that",
    "the",
    "this",
    "traceability",
    "uk",
    "updated",
    "us",
    "used",
    "with",
    "work",
}

EVENT_TYPE_WEIGHTS = {
    "regulation": 55,
    "standard": 45,
    "recall": 70,
    "incident": 60,
    "tariff": 40,
    "certification": 35,
    "deadline": 50,
    "enforcement": 65,
}

URGENCY_WEIGHTS = {
    "immediate": 45,
    "deadline": 40,
    "mandatory": 35,
    "enforcement": 35,
    "recall": 35,
    "penalty": 30,
    "proposed": 15,
    "draft": 10,
}

PRIORITY_WEIGHTS = {
    "Strategic": 45,
    "High": 35,
    "Medium": 20,
    "Low": 5,
}


def calculate_score(event, customer, threshold=THRESHOLD):
    """Return a routing-ready score packet for an event/customer pair."""
    interpreted_event = _interpret_event(event)
    event_text = interpreted_event["event_text"]

    applicability = _applicability(interpreted_event, event, customer)
    components = {
        "applicability": applicability["score"],
        "regulatory_impact": _regulatory_impact(event_text, event, interpreted_event),
        "urgency": _urgency(event_text, interpreted_event),
        "commercial_priority": PRIORITY_WEIGHTS.get(customer.get("priority", "Medium"), 20),
        "relationship_context": _relationship_context(event_text, customer),
    }
    priority_score = min(400, sum(components.values()))
    if not applicability["matched"]:
        score = 0
        route = "No match"
    else:
        score = priority_score
        route = _route_for(score, threshold)

    return {
        "score": score,
        "priority_score": priority_score,
        "threshold": threshold,
        "route": route,
        "triggered": score >= threshold,
        "applicable": applicability["matched"],
        "matched_terms": applicability["matched_terms"],
        "excluded_terms": applicability["excluded_terms"],
        "affected_terms": sorted(interpreted_event["affected_terms"]),
        "components": components,
        "reasoning": _reasoning(event, customer, components, score, threshold, applicability),
        "sequence": _sequence_payload(event, customer, score, route),
    }


def _interpret_event(event):
    title = event.get("title", "")
    description = event.get("description", "")
    tags = " ".join(event.get("tags", []))
    region = event.get("region", "")
    event_text = _normalize(" ".join([title, description, tags, region]))

    positive_clauses = [title, tags]
    excluded_clauses = []
    for clause in re.split(r"[.;\n]", description):
        normalized_clause = _normalize(clause)
        if any(phrase in normalized_clause for phrase in EXCLUSION_PHRASES):
            excluded_clauses.append(clause)
        else:
            positive_clauses.append(clause)

    affected_terms = _expand_terms(_strong_keywords(" ".join(positive_clauses)))
    excluded_terms = _expand_terms(_strong_keywords(" ".join(excluded_clauses)))
    affected_terms -= excluded_terms

    return {
        "event_text": event_text,
        "affected_terms": affected_terms,
        "excluded_terms": excluded_terms,
    }


def _applicability(interpreted_event, event, customer):
    event_terms = interpreted_event["affected_terms"]
    excluded_terms = interpreted_event["excluded_terms"]
    customer_terms = _customer_domain_terms(customer)
    matched_terms = sorted(event_terms & customer_terms)
    customer_excluded_terms = sorted(excluded_terms & customer_terms)

    if not matched_terms:
        return {
            "score": 0,
            "matched": False,
            "matched_terms": [],
            "excluded_terms": customer_excluded_terms,
            "excluded": bool(customer_excluded_terms),
        }

    score = min(100, 35 + len(matched_terms) * 22)

    event_region = event.get("region", "").lower()
    customer_regions = [region.lower() for region in customer.get("regions", [])]
    if event_region and event_region in customer_regions:
        score += 20

    return {
        "score": min(120, score),
        "matched": score >= APPLICABILITY_MINIMUM,
        "matched_terms": matched_terms,
        "excluded_terms": customer_excluded_terms,
        "excluded": bool(customer_excluded_terms),
    }


def _customer_domain_terms(customer):
    return _expand_terms(_strong_keywords(
        customer.get("industry", ""),
        customer.get("products", ""),
        " ".join(customer.get("regulatory_topics", [])),
    ))


def _strong_keywords(*values):
    return _keywords(*values) - WEAK_TERMS


def _expand_terms(terms):
    expanded = set(terms)
    for term in list(terms):
        expanded.update(SYNONYMS.get(term, set()))
    return expanded


def _regulatory_impact(event_text, event, interpreted_event):
    score = 40
    for tag in event.get("tags", []):
        score += EVENT_TYPE_WEIGHTS.get(tag.lower(), 0)

    for keyword, weight in EVENT_TYPE_WEIGHTS.items():
        if keyword in event_text:
            score += weight

    if interpreted_event["affected_terms"] & SEVERE_TERMS:
        score += 70

    return min(105, score)


def _urgency(event_text, interpreted_event):
    score = 15
    for keyword, weight in URGENCY_WEIGHTS.items():
        if keyword in event_text:
            score += weight

    if interpreted_event["affected_terms"] & SEVERE_TERMS:
        score += 45

    date_like = re.search(r"\b(20\d{2}|q[1-4]|jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\b", event_text)
    if date_like:
        score += 20

    return min(80, score)


def _relationship_context(event_text, customer):
    score = 10
    for initiative in customer.get("active_initiatives", []):
        if any(term in event_text for term in _keywords(initiative)):
            score += 18
    return min(50, score)


def _route_for(score, threshold):
    if score >= threshold:
        return "Trigger sequence"
    if score >= threshold - 45:
        return "Needs review"
    return "Monitor only"


def _sequence_payload(event, customer, score, route):
    if route != "Trigger sequence":
        return None

    owner = customer.get("account_owner", "Growth")
    return {
        "owner": owner,
        "destination": customer.get("crm_id", customer["name"]),
        "sequence": "Regulatory event follow-up",
        "subject": f"{customer['name']}: {event['title']}",
        "first_line": (
            f"Saw a regulatory update that looks relevant to {customer['name']}'s "
            f"{customer['products'].lower()} work."
        ),
        "score": score,
        "next_step": "Create HubSpot task + enroll account contact" if route == "Trigger sequence" else "Send Slack review alert",
    }


def _reasoning(event, customer, components, score, threshold, applicability):
    if not applicability["matched"]:
        if applicability["excluded"]:
            excluded = ", ".join(applicability["excluded_terms"])
            return (
                f"{event['title']} is not routed to {customer['name']} because this "
                f"domain was explicitly marked unaffected: {excluded}."
            )

        return (
            f"{event['title']} is not routed to {customer['name']} because there is no "
            "meaningful industry, product, or regulatory-domain overlap."
        )

    top_component = max(components, key=components.get).replace("_", " ")
    route_note = "crosses" if score >= threshold else "does not cross"
    matched = ", ".join(applicability["matched_terms"])
    return (
        f"{event['title']} {route_note} the {threshold} threshold for {customer['name']} "
        f"because the strongest signal is {top_component}; matched terms: {matched}."
    )


def _keywords(*values):
    text = _normalize(" ".join(str(value) for value in values))
    return {token for token in re.findall(r"[a-z0-9]+", text) if len(token) > 2}


def _normalize(value):
    return value.lower().replace("-", " ")


if __name__ == "__main__":
    from mockdata import customers, sample_events

    for customer in customers:
        result = calculate_score(sample_events[0], customer)
        print(customer["name"], result["score"], result["route"])
