EVENT_SCENARIOS = {
    "EV battery regulatory wave": [
        {
            "id": "evt_battery_001",
            "title": "EU Battery Passport Enforcement Deadline",
            "description": (
                "EU regulators confirmed enforcement deadlines for battery passport "
                "reporting, recycling disclosures, and supplier traceability for EV batteries."
            ),
            "region": "EU",
            "tags": ["regulation", "deadline", "enforcement", "EV", "battery", "recycling"],
            "source": "Mock regulatory feed",
        },
        {
            "id": "evt_battery_002",
            "title": "EV Battery Recycling Disclosure Rule",
            "description": (
                "New recycling disclosure requirements apply to electric vehicle battery "
                "modules and component suppliers selling into the EU."
            ),
            "region": "EU",
            "tags": ["regulation", "EV", "battery", "recycling", "supplier"],
            "source": "Mock regulatory feed",
        },
        {
            "id": "evt_battery_003",
            "title": "Supplier Traceability Requirements for Battery Components",
            "description": (
                "Battery component manufacturers must document supplier traceability, "
                "material origin, and compliance controls before the next reporting cycle."
            ),
            "region": "EU",
            "tags": ["deadline", "battery", "supplier", "traceability", "compliance"],
            "source": "Mock regulatory feed",
        },
    ],
    "Medical device cybersecurity wave": [
        {
            "id": "evt_med_001",
            "title": "FDA Medical Device Cybersecurity Guidance",
            "description": (
                "FDA guidance outlines mandatory cybersecurity documentation for connected "
                "diagnostic and surgical medical devices."
            ),
            "region": "US",
            "tags": ["regulation", "FDA", "medical", "device", "cybersecurity"],
            "source": "Mock regulatory feed",
        },
        {
            "id": "evt_med_002",
            "title": "Connected Diagnostic Device Security Rule",
            "description": (
                "Connected diagnostic device manufacturers must update quality systems, "
                "risk controls, and vulnerability response workflows."
            ),
            "region": "US",
            "tags": ["deadline", "medical", "device", "cybersecurity", "quality"],
            "source": "Mock regulatory feed",
        },
        {
            "id": "evt_med_003",
            "title": "Surgical Equipment Quality System Update",
            "description": (
                "Surgical equipment manufacturers face new documentation expectations "
                "for device quality controls and post-market monitoring."
            ),
            "region": "EU",
            "tags": ["standard", "medical", "device", "surgical", "quality"],
            "source": "Mock regulatory feed",
        },
    ],
    "Aerospace safety wave": [
        {
            "id": "evt_aero_001",
            "title": "FAA Composite Materials Safety Alert",
            "description": (
                "FAA issued a safety alert asking aerospace suppliers to review composite "
                "materials used in aircraft cabin systems."
            ),
            "region": "US",
            "tags": ["incident", "FAA", "aerospace", "aircraft", "materials", "safety"],
            "source": "Mock regulatory feed",
        },
        {
            "id": "evt_aero_002",
            "title": "Aircraft Cabin Systems Certification Update",
            "description": (
                "Aircraft cabin system suppliers must document updated certification "
                "evidence for interior components and composite materials."
            ),
            "region": "US",
            "tags": ["standard", "aerospace", "aircraft", "certification", "materials"],
            "source": "Mock regulatory feed",
        },
    ],
    "Mixed regulatory feed": [],
}

EVENT_SCENARIOS["Mixed regulatory feed"] = (
    EVENT_SCENARIOS["EV battery regulatory wave"]
    + EVENT_SCENARIOS["Medical device cybersecurity wave"][:2]
    + EVENT_SCENARIOS["Aerospace safety wave"][:1]
)


def scenario_names():
    return list(EVENT_SCENARIOS.keys())


def load_events(scenario):
    return EVENT_SCENARIOS[scenario]
