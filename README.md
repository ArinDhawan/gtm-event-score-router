# Regulatory GTM Router

A routing prototype that turns structured regulatory signals into explainable customer-level campaign triggers.

The current demo focuses on three things:

- rich customer profiles with product scope, regulatory exposure, GTM context, and routing tags
- structured signal sources with affected domains, excluded domains, agencies, deadlines, and severity
- deterministic scoring that explains why an account was routed or suppressed

## Run the Web UI

```bash
python3 -m http.server 8600 -d web
```

Open `http://localhost:8600`. This is UI-only mode; triggered campaigns are created locally but CRM sync waits for the backend.

## Run With HubSpot Handoff

Add your private app token to `.env`:

```bash
HUBSPOT_ACCESS_TOKEN=pat-na1-...
```

Then run:

```bash
python3 hubspot_handoff.py
```

Open `http://localhost:8601`. This enables automatic campaign activation when an account crosses the trigger threshold.

The HubSpot handoff:

- searches or creates the company
- searches or creates a demo contact
- creates or reuses a campaign deal
- associates the company, contact, deal, and draft tasks where HubSpot permissions allow
- creates one CRM task per generated email draft
- marks external email sending as awaiting a configured send provider

If task scopes are unavailable, the company/contact/deal handoff still works.

## Checks

```bash
python3 -m py_compile app.py scoring.py mockdata.py event_feed.py campaign_routing.py hubspot_handoff.py test_scoring.py test_campaign_routing.py
node --check web/app.js
```
