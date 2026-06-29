import streamlit as st

from mockdata import customers, sample_events
from scoring import THRESHOLD, calculate_score


st.set_page_config(page_title="Event Score Router", layout="wide")

SESSION_SCHEMA_VERSION = 4
SCORING_MODEL_LABEL = "Scoring model: v4 affected/excluded severity gate"

if "runs" not in st.session_state:
    st.session_state.runs = []
if "threshold" not in st.session_state:
    st.session_state.threshold = THRESHOLD
if st.session_state.get("schema_version") != SESSION_SCHEMA_VERSION:
    st.session_state.runs = []
    st.session_state.schema_version = SESSION_SCHEMA_VERSION


def process_event(event):
    results = []
    for customer in customers:
        result = calculate_score(event, customer, st.session_state.threshold)
        results.append({"customer": customer, **result})
    results.sort(key=lambda item: item.get("score", 0), reverse=True)
    st.session_state.runs.insert(0, {"event": event, "results": results})


st.title("Event Score Router")
st.caption("Regulatory event scoring, account matching, and sequence routing prototype")

metric_cols = st.columns(4)
metric_cols[0].metric("Accounts", len(customers))
metric_cols[1].metric("Trigger threshold", st.session_state.threshold)
metric_cols[2].metric("Sample events", len(sample_events))
metric_cols[3].metric("Routes", "4")

with st.sidebar:
    st.header("Event Intake")
    st.caption(SCORING_MODEL_LABEL)
    st.session_state.threshold = st.slider("Trigger threshold", 200, 360, st.session_state.threshold, 5)

    event_mode = st.radio("Source", ["Sample event", "Custom event"], horizontal=True)

    if event_mode == "Sample event":
        selected_title = st.selectbox("Select event", [event["title"] for event in sample_events])
        event = next(item for item in sample_events if item["title"] == selected_title)
        st.write(event["description"])
        st.caption(f"Region: {event['region']} | Tags: {', '.join(event['tags'])}")
    else:
        title = st.text_input("Event title")
        description = st.text_area("Description", height=140)
        region = st.selectbox("Region", ["EU", "US", "UK", "Global"])
        tags_input = st.text_input("Tags", placeholder="regulation, deadline, EV")
        event = {
            "title": title,
            "description": description,
            "region": region,
            "tags": [tag.strip() for tag in tags_input.split(",") if tag.strip()],
        }

    can_process = bool(event.get("title") and event.get("description"))
    if st.button("Score and route", type="primary", use_container_width=True, disabled=not can_process):
        process_event(event)

    if st.button("Clear runs", use_container_width=True):
        st.session_state.runs = []
        st.rerun()


left, right = st.columns([0.42, 0.58], gap="large")

with left:
    st.subheader("Customer Context")
    for customer in customers:
        with st.container(border=True):
            st.markdown(f"**{customer['name']}**")
            st.write(customer["products"])
            st.caption(
                f"{customer['industry']} | {', '.join(customer['regions'])} | "
                f"{customer['priority']} | Owner: {customer['account_owner']}"
            )

with right:
    st.subheader("Routing Results")
    if not st.session_state.runs:
        st.info("Score a sample event to see account routes, trigger reasons, and sequence payloads.")
    else:
        latest = st.session_state.runs[0]
        st.markdown(f"**Latest event:** {latest['event']['title']}")

        triggered = [item for item in latest["results"] if item.get("triggered")]
        review = [item for item in latest["results"] if item.get("route") == "Needs review"]
        monitor = [item for item in latest["results"] if item.get("route") == "Monitor only"]
        no_match = [item for item in latest["results"] if item.get("route") == "No match"]

        status_cols = st.columns(4)
        status_cols[0].metric("Trigger sequence", len(triggered))
        status_cols[1].metric("Needs review", len(review))
        status_cols[2].metric("Monitor only", len(monitor))
        status_cols[3].metric("No match", len(no_match))

        for item in latest["results"]:
            customer = item.get("customer", {})
            route = item.get("route", "No match")
            if route == "Trigger sequence":
                badge = "green"
            elif route == "Needs review":
                badge = "orange"
            elif route == "Monitor only":
                badge = "blue"
            else:
                badge = "gray"

            with st.container(border=True):
                top = st.columns([0.58, 0.18, 0.24])
                top[0].markdown(f"**{customer.get('name', 'Unknown customer')}**")
                top[1].metric("Score", item.get("score", 0))
                top[2].badge(route, color=badge)

                st.write(item.get("reasoning", "No routing reason available for this run."))
                st.progress(min(item.get("score", 0) / 400, 1.0))

                components = item.get("components", {})
                if components:
                    st.bar_chart(components, horizontal=True)

                matched_terms = item.get("matched_terms", [])
                if matched_terms:
                    st.caption(f"Matched domain terms: {', '.join(matched_terms)}")

                excluded_terms = item.get("excluded_terms", [])
                if excluded_terms:
                    st.caption(f"Explicitly excluded terms: {', '.join(excluded_terms)}")

                sequence = item.get("sequence")
                if sequence:
                    st.markdown("**Generated action**")
                    st.json(sequence, expanded=False)

st.divider()
st.subheader("How this maps to Dapper")
st.write(
    "Tagged events are scored against customer context, routed by threshold, and converted "
    "into a sequence-ready payload. In a production version, the event source could be "
    "Dapper, the account context could come from HubSpot, and the generated action could "
    "create a task, Slack alert, or email sequence enrollment."
)
