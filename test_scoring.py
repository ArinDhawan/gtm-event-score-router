from mockdata import customers, sample_events
from scoring import calculate_score


def _customer(name):
    return next(customer for customer in customers if customer["name"] == name)


def _event(title):
    return next(event for event in sample_events if event["title"] == title)


def test_sample_events_only_trigger_applicable_customers():
    scenarios = [
        (
            "EU Battery Passport Enforcement Deadline Announced",
            "AutoForge Inc",
        ),
        (
            "FDA Issues Draft Guidance on Medical Device Cybersecurity",
            "MediBuild Solutions",
        ),
        (
            "FAA Safety Alert Covers Cabin Composite Materials",
            "AeroDynamics",
        ),
    ]

    for event_title, expected_customer in scenarios:
        event = _event(event_title)
        for customer in customers:
            result = calculate_score(event, customer)
            if customer["name"] == expected_customer:
                assert result["route"] == "Trigger sequence"
                assert result["sequence"]
                assert result["matched_terms"]
            else:
                assert result["route"] == "No match"
                assert not result["sequence"]
                assert not result["matched_terms"]


def test_generic_safety_and_region_do_not_create_applicability():
    event = {
        "title": "US Safety Standard Review",
        "description": "A US safety standard review mentions compliance and supplier requirements.",
        "region": "US",
        "tags": ["safety", "standard", "compliance"],
    }

    result = calculate_score(event, _customer("AutoForge Inc"))

    assert result["route"] == "No match"
    assert not result["sequence"]
    assert not result["matched_terms"]


def test_explicitly_unaffected_domains_are_excluded():
    event = {
        "title": "Electric",
        "description": (
            "Cars are banned in US and EU. Airplanes, machinery, surgical equipment "
            "not affected at all."
        ),
        "region": "Global",
        "tags": [],
    }

    expected_routes = {
        "AutoForge Inc": "Trigger sequence",
        "MediBuild Solutions": "No match",
        "AeroDynamics": "No match",
        "ConstructSafe": "No match",
    }

    for customer in customers:
        result = calculate_score(event, customer, threshold=240)
        assert result["route"] == expected_routes[customer["name"]]
        if customer["name"] == "AutoForge Inc":
            assert result["sequence"]
            assert "automotive" in result["matched_terms"]
        else:
            assert not result["sequence"]
            assert result["excluded_terms"]
