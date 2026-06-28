import json 

# Basic Sample (v1.0) - Ideal Scenario for Testing
customers = [
    {
        "id": 1,
        "name": "AutoForge Inc",
        "industry": "Automotive",
        "products": "Electric vehicle components",
        "regions": ["EU", "US"],
        "priority": "High"
    },
    {
        "id": 2,
        "name": "MediBuild Solutions",
        "industry": "Medical Devices",
        "products": "Surgical equipment",
        "regions": ["US", "EU"],
        "priority": "High"
    },
    {
        "id": 3,
        "name": "AeroDynamics",
        "industry": "Aerospace",
        "products": "Aircraft parts",
        "regions": ["US"],
        "priority": "Medium"
    },
    {
        "id": 4,
        "name": "ConstructSafe",
        "industry": "Construction",
        "products": "Heavy machinery",
        "regions": ["EU"],
        "priority": "Medium"
    }
]

sample_events = [
    {
        "title": "New EU Battery Regulation",
        "description": "Updated safety and recycling requirements for EV batteries",
        "tags": ["regulation", "EV", "sustainability"]
    }
]

def save_mock_data():
  data = {"customers":customers, "events": []}
  with open("data.json", "w") as f:
    json.dump(data, f, indent=2)

if __name__ == "__main__":
  save_mock_data()
  print("Mock data created!")
