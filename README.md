# GTM Event Score Router

A one-day prototype inspired by Daptic's Dapper workflow: tagged regulatory events are matched against customer context, scored, and routed into the right GTM action.

## What it demonstrates

- Event intake from a sample feed or custom input
- Customer matching across industry, products, regions, regulatory topics, and active initiatives
- An applicability gate so generic words like "safety" or region overlap do not route unrelated accounts
- Explainable scoring with visible component weights
- Threshold routing at the `280` trigger point
- Mock sequence payloads that could map to HubSpot, Salesforce, Clay, n8n, or Dapper plugins

## Routing logic

Each event/customer pair first passes an applicability check. If there is no meaningful industry, product, or regulatory-domain overlap, the account is routed to `No match` and no sequence payload is generated.

Applicable event/customer pairs receive a score from `0` to `400`:

- `applicability`: product, industry, topic, and region overlap
- `regulatory_impact`: event type, compliance burden, and severity
- `urgency`: deadlines, enforcement language, penalties, or incident language
- `commercial_priority`: account priority
- `relationship_context`: active initiatives that make the event timely

Routes:

- `>= 280`: trigger sequence
- `235-279`: needs review
- `< 235`: monitor only
- No domain overlap: no match

## Run locally

```bash
streamlit run app.py
```

## Demo narrative

"Dapper already has tagged regulatory events and better proprietary context. This prototype shows the routing layer I would add on top: compare each event to account context, produce an explainable score, and when an account crosses the threshold, generate a sequence-ready payload for the GTM stack."
