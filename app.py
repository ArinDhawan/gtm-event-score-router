# app.py
import streamlit as st
from scoring import calculate_score
from mockdata import customers

st.set_page_config(page_title="Event Score Router", layout="wide")
st.title("🔍 Event Score Router")
st.markdown("**Regulatory Event Scoring + Automated Routing Prototype**")

# Initialize
if 'events' not in st.session_state:
    st.session_state.events = []
if 'triggered' not in st.session_state:
    st.session_state.triggered = []

# Sidebar
with st.sidebar:
    st.header("Add New Event")
    title = st.text_input("Event Title")
    description = st.text_area("Description")
    tags_input = st.text_input("Tags (comma separated)")
    tags = [t.strip() for t in tags_input.split(',') if t.strip()]

    if st.button("Process Event"):
        if title and description:
            event = {"title": title, "description": description, "tags": tags}
            st.session_state.events.append(event)
            
            for customer in customers:
                score, reason = calculate_score(event, customer)
                if score >= 280:
                    st.session_state.triggered.append({
                        "event": event['title'],
                        "customer": customer['name'],
                        "score": score,
                        "reason": reason
                    })

# Main UI
col1, col2 = st.columns([1, 1])

with col1:
    st.subheader("Customers")
    for c in customers:
        st.write(f"**{c['name']}** ({c['industry']})")

with col2:
    st.subheader("High-Priority Triggers (Score ≥ 280)")
    if st.session_state.triggered:
        for t in st.session_state.triggered:
            st.success(f"**{t['customer']}** — Score: **{t['score']}**")
            st.write(t['event'])
            st.caption(t['reason'])
            st.info("→ Automated Email Sequence Triggered")
            st.divider()
    else:
        st.info("No triggers yet. Add events to see routing in action.")

st.caption("Quick prototype demonstrating intelligent scoring and GTM routing")

if st.button("Clear All Data"):
    st.session_state.events = []
    st.session_state.triggered = []
    st.rerun()