import streamlit as st

from campaign_routing import build_routing_queue
from event_feed import load_events, scenario_names
from mockdata import customers
from scoring import THRESHOLD


st.set_page_config(page_title="Regulatory GTM Router", layout="wide")

SESSION_SCHEMA_VERSION = 5
MODEL_LABEL = "Routing model: v5 swappable feed + cumulative campaign trigger"

if "threshold" not in st.session_state:
    st.session_state.threshold = THRESHOLD
if st.session_state.get("schema_version") != SESSION_SCHEMA_VERSION:
    st.session_state.schema_version = SESSION_SCHEMA_VERSION


def badge_color(route):
    if route == "Trigger sequence":
        return "green"
    if route == "Needs review":
        return "orange"
    if route == "Monitor only":
        return "blue"
    return "gray"


with st.sidebar:
    st.header("Routing Controls")
    st.caption(MODEL_LABEL)
    scenario = st.selectbox("Event feed scenario", scenario_names())
    st.session_state.threshold = st.slider("Campaign trigger threshold", 200, 360, st.session_state.threshold, 5)
    st.caption("Events are mock regulatory signals that can be swapped for a real feed later.")


events = load_events(scenario)
routing_queue = build_routing_queue(events, customers, st.session_state.threshold)
triggered = [item for item in routing_queue if item["route"] == "Trigger sequence"]
review = [item for item in routing_queue if item["route"] == "Needs review"]
monitor = [item for item in routing_queue if item["route"] == "Monitor only"]
no_route = [item for item in routing_queue if item["route"] == "No route"]

st.title("Regulatory GTM Router")
st.caption("Swappable event feed, customer score ledger, threshold routing, campaign creation, and email sequence preview")

metric_cols = st.columns(5)
metric_cols[0].metric("Feed events", len(events))
metric_cols[1].metric("Customers", len(customers))
metric_cols[2].metric("Trigger threshold", st.session_state.threshold)
metric_cols[3].metric("Campaigns ready", len(triggered))
metric_cols[4].metric("Review queue", len(review))

feed_col, queue_col = st.columns([0.42, 0.58], gap="large")

with feed_col:
    st.subheader("Regulatory Event Feed")
    for event in events:
        with st.container(border=True):
            st.markdown(f"**{event['title']}**")
            st.write(event["description"])
            st.caption(f"{event['source']} | {event['region']} | Tags: {', '.join(event['tags'])}")

with queue_col:
    st.subheader("Customer Routing Queue")
    status_cols = st.columns(4)
    status_cols[0].metric("Trigger", len(triggered))
    status_cols[1].metric("Review", len(review))
    status_cols[2].metric("Monitor", len(monitor))
    status_cols[3].metric("No route", len(no_route))

    for item in routing_queue:
        customer = item["customer"]
        with st.container(border=True):
            top = st.columns([0.44, 0.18, 0.2, 0.18])
            top[0].markdown(f"**{customer['name']}**")
            top[1].metric("Score", item["total_score"])
            top[2].badge(item["route"], color=badge_color(item["route"]))
            top[3].caption(f"Owner: {item['owner']}")

            st.progress(min(item["total_score"] / max(st.session_state.threshold, 1), 1.0))
            st.caption(f"{len(item['evidence'])} relevant events | {len(item['suppressed'])} explicitly excluded events")

            if item["evidence"]:
                with st.expander("Evidence events", expanded=item["route"] == "Trigger sequence"):
                    for evidence in item["evidence"]:
                        event = evidence["event"]
                        st.markdown(f"**+{evidence['score']}** - {event['title']}")
                        st.caption(f"Matched terms: {', '.join(evidence['matched_terms'])}")

            if item["suppressed"]:
                with st.expander("Excluded events"):
                    for suppressed in item["suppressed"]:
                        st.markdown(f"**{suppressed['event']['title']}**")
                        st.caption(suppressed["reason"])

st.divider()
st.subheader("Triggered Campaigns")

if not triggered:
    st.info("No customers crossed the campaign threshold for this feed scenario.")
else:
    for item in triggered:
        campaign = item["campaign"]
        with st.container(border=True):
            header = st.columns([0.46, 0.2, 0.2, 0.14])
            header[0].markdown(f"**{campaign['name']}**")
            header[1].metric("Trigger score", campaign["trigger_score"])
            header[2].caption(f"Customer: {campaign['customer']}")
            header[3].caption(campaign["status"])

            st.caption(
                f"Owner: {campaign['owner']} | Evidence events: {len(campaign['evidence_event_ids'])} | "
                f"Suppression: {campaign['suppression']}"
            )

            email_tabs = st.tabs([f"Email {email['step']}" for email in campaign["emails"]] + ["GTM payload"])
            for tab, email in zip(email_tabs[:-1], campaign["emails"]):
                with tab:
                    st.markdown(f"**Subject:** {email['subject']}")
                    st.text(email["body"])

            with email_tabs[-1]:
                st.json(campaign["payload"], expanded=True)

st.divider()
st.subheader("System Boundary")
st.write(
    "This prototype keeps events mock and swappable, while making the routing logic real: "
    "a feed of regulatory signals is matched to customer context, accumulated into a score "
    "ledger, routed by threshold, and converted into a campaign-ready email sequence."
)
