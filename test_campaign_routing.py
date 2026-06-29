from campaign_routing import build_routing_queue
from event_feed import load_events
from mockdata import customers


def _route_by_customer(queue):
    return {item["customer"]["name"]: item for item in queue}


def test_ev_feed_triggers_autoforge_campaign_only():
    queue = build_routing_queue(load_events("EV battery regulatory wave"), customers, 280)
    routes = _route_by_customer(queue)

    assert routes["AutoForge Inc"]["route"] == "Trigger sequence"
    assert routes["AutoForge Inc"]["campaign"]
    assert len(routes["AutoForge Inc"]["campaign"]["emails"]) == 3

    for name in ["MediBuild Solutions", "AeroDynamics", "ConstructSafe"]:
        assert routes[name]["route"] == "No route"
        assert routes[name]["campaign"] is None


def test_medical_feed_triggers_medibuild_campaign_only():
    queue = build_routing_queue(load_events("Medical device cybersecurity wave"), customers, 280)
    routes = _route_by_customer(queue)

    assert routes["MediBuild Solutions"]["route"] == "Trigger sequence"
    assert routes["MediBuild Solutions"]["campaign"]["payload"]["action"] == "create_sequence_enrollment"

    for name in ["AutoForge Inc", "AeroDynamics", "ConstructSafe"]:
        assert routes[name]["route"] == "No route"
        assert routes[name]["campaign"] is None
