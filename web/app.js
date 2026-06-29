const customers = [
  {
    id: "autoforge",
    name: "AutoForge Inc",
    segment: "Automotive",
    product: "Electric vehicle battery modules and charging components",
    owner: "Maya Chen",
    priority: "Strategic",
    topics: ["automotive", "ev", "battery", "charging", "recycling", "supplier traceability"],
    region: ["EU", "US"],
  },
  {
    id: "medibuild",
    name: "MediBuild Solutions",
    segment: "Medical Devices",
    product: "Surgical equipment and connected diagnostic devices",
    owner: "Jordan Patel",
    priority: "High",
    topics: ["medical", "device", "diagnostic", "surgical", "cybersecurity", "quality"],
    region: ["EU", "US"],
  },
  {
    id: "aerodynamics",
    name: "AeroDynamics",
    segment: "Aerospace",
    product: "Aircraft parts, cabin systems, and composite materials",
    owner: "Sam Rivera",
    priority: "Medium",
    topics: ["aerospace", "aircraft", "cabin", "materials", "certification", "safety"],
    region: ["US", "UK"],
  },
  {
    id: "constructsafe",
    name: "ConstructSafe",
    segment: "Construction",
    product: "Heavy machinery, jobsite sensors, and safety equipment",
    owner: "Priya Shah",
    priority: "Medium",
    topics: ["construction", "machinery", "heavy equipment", "emissions", "safety"],
    region: ["EU", "US"],
  },
];

const scenarioEvents = {
  "EV battery regulatory wave": [
    signal("evt_battery_001", "EU Battery Passport Enforcement Deadline", "European Commission", "EU", "Recommended", "EU regulators confirmed enforcement deadlines for battery passport reporting, recycling disclosures, and supplier traceability for EV batteries.", ["EV", "battery", "recycling", "deadline"], { autoforge: 126 }),
    signal("evt_battery_002", "EV Battery Recycling Disclosure Rule", "European Commission", "EU", "Recommended", "New recycling disclosure requirements apply to electric vehicle battery modules and component suppliers selling into the EU.", ["EV", "battery", "supplier traceability"], { autoforge: 104 }),
    signal("evt_battery_003", "Supplier Traceability Requirements for Battery Components", "European Chemicals Agency", "EU", "Monitor", "Battery component manufacturers must document supplier traceability, material origin, and compliance controls before the next reporting cycle.", ["battery", "supplier traceability", "compliance"], { autoforge: 96 }),
  ],
  "Medical device cybersecurity wave": [
    signal("evt_med_001", "FDA Medical Device Cybersecurity Guidance", "FDA", "US", "Recommended", "FDA guidance outlines mandatory cybersecurity documentation for connected diagnostic and surgical medical devices.", ["medical", "device", "cybersecurity"], { medibuild: 132 }),
    signal("evt_med_002", "Connected Diagnostic Device Security Rule", "FDA", "US", "Recommended", "Connected diagnostic device manufacturers must update quality systems, risk controls, and vulnerability response workflows.", ["diagnostic", "device", "cybersecurity", "quality"], { medibuild: 118 }),
    signal("evt_med_003", "Surgical Equipment Quality System Update", "European Commission", "EU", "Monitor", "Surgical equipment manufacturers face new documentation expectations for device quality controls and post-market monitoring.", ["surgical", "device", "quality"], { medibuild: 92 }),
  ],
  "Aerospace safety wave": [
    signal("evt_aero_001", "FAA Composite Materials Safety Alert", "FAA", "US", "Recommended", "FAA issued a safety alert asking aerospace suppliers to review composite materials used in aircraft cabin systems.", ["aerospace", "aircraft", "materials", "safety"], { aerodynamics: 154 }),
    signal("evt_aero_002", "Aircraft Cabin Systems Certification Update", "FAA", "US", "Recommended", "Aircraft cabin system suppliers must document updated certification evidence for interior components and composite materials.", ["aircraft", "cabin", "certification", "materials"], { aerodynamics: 128 }),
  ],
  "Mixed regulatory feed": [],
};

scenarioEvents["Mixed regulatory feed"] = [
  ...scenarioEvents["EV battery regulatory wave"],
  ...scenarioEvents["Medical device cybersecurity wave"].slice(0, 2),
  ...scenarioEvents["Aerospace safety wave"].slice(0, 1),
];

const state = {
  view: "dashboard",
  scenario: "EV battery regulatory wave",
  threshold: 280,
  search: "",
  jurisdiction: "All",
  classification: "All",
};

function signal(id, title, agency, jurisdiction, classification, summary, tags, scores) {
  return {
    id,
    title,
    agency,
    jurisdiction,
    classification,
    summary,
    tags,
    scores,
    published: publishedDate(id),
  };
}

function publishedDate(id) {
  const dates = {
    evt_battery_001: "Dec 12, 2025",
    evt_battery_002: "Dec 08, 2025",
    evt_battery_003: "Dec 03, 2025",
    evt_med_001: "Nov 26, 2025",
    evt_med_002: "Nov 19, 2025",
    evt_med_003: "Nov 12, 2025",
    evt_aero_001: "Nov 21, 2025",
    evt_aero_002: "Nov 14, 2025",
  };
  return dates[id] || "Nov 01, 2025";
}

function routeFor(score, evidenceCount) {
  if (!evidenceCount) return "No route";
  if (score >= state.threshold) return "Trigger sequence";
  if (score >= 200) return "Needs review";
  return "Monitor only";
}

function campaignTopic(evidence) {
  const tags = evidence.flatMap((event) => event.tags.map((tag) => tag.toLowerCase()));
  if (tags.includes("battery") || tags.includes("ev")) return "Battery Compliance Outreach";
  if (tags.includes("cybersecurity")) return "Device Cybersecurity Outreach";
  if (tags.includes("aerospace") || tags.includes("aircraft")) return "Aerospace Safety Outreach";
  return "Regulatory Signal Outreach";
}

function buildQueue() {
  const events = scenarioEvents[state.scenario];
  return customers
    .map((customer) => {
      const evidence = events
        .filter((event) => event.scores[customer.id])
        .map((event) => ({ ...event, score: event.scores[customer.id] }));
      const score = evidence.reduce((sum, event) => sum + event.score, 0);
      const route = routeFor(score, evidence.length);
      const campaign = route === "Trigger sequence" ? buildCampaign(customer, evidence, score) : null;
      return { customer, score, route, evidence, campaign };
    })
    .sort((a, b) => b.score - a.score);
}

function buildCampaign(customer, evidence, score) {
  const name = campaignTopic(evidence);
  return {
    name,
    customer,
    score,
    owner: customer.owner,
    status: "Ready to enroll",
    suppression: "30 days",
    evidence,
    emails: buildEmails(customer, evidence, name),
    payload: {
      tool: "HubSpot",
      action: "create_sequence_enrollment",
      company_id: customer.id,
      owner: customer.owner,
      campaign: name,
      trigger_score: score,
      evidence_event_ids: evidence.map((event) => event.id),
    },
  };
}

function buildEmails(customer, evidence, campaignName) {
  const titles = evidence.map((event) => event.title);
  return [
    {
      subject: `${campaignName} for ${customer.name}`,
      body: `Hi {{first_name}},\n\nWe noticed a cluster of regulatory updates that look relevant to ${customer.name}'s ${customer.product.toLowerCase()} work: ${titles.slice(0, 2).join("; ")}.\n\nWorth comparing notes on whether these changes create new compliance work?`,
    },
    {
      subject: `Why these updates may matter for ${customer.name}`,
      body: `Hi {{first_name}},\n\nThe signal is not just one isolated update. ${evidence.length} related events pushed ${customer.name} over the routing threshold, which usually means there may be enough regulatory movement to justify a closer review.\n\nHappy to send over the event summary if useful.`,
    },
    {
      subject: "Quick regulatory signal review?",
      body: `Hi {{first_name}},\n\nWould it be useful to walk through the specific updates and where they may touch ${customer.name}'s current product or compliance workflows?\n\nOpen to a quick conversation this week?`,
    },
  ];
}

function filteredEvents() {
  return scenarioEvents[state.scenario].filter((event) => {
    const searchMatch = `${event.title} ${event.agency} ${event.summary} ${event.tags.join(" ")}`
      .toLowerCase()
      .includes(state.search.toLowerCase());
    const jurisdictionMatch = state.jurisdiction === "All" || event.jurisdiction === state.jurisdiction;
    const classificationMatch = state.classification === "All" || event.classification === state.classification;
    return searchMatch && jurisdictionMatch && classificationMatch;
  });
}

function render() {
  renderSummary();
  renderFeed();
  renderQueue();
  renderCampaigns();
  renderImpact();
  renderRules();
  setActiveView(state.view);
}

function renderSummary() {
  const queue = buildQueue();
  const events = scenarioEvents[state.scenario];
  const campaigns = queue.filter((item) => item.campaign);
  const suppressed = customers.length * events.length - queue.reduce((sum, item) => sum + item.evidence.length, 0);
  const cards = [
    ["Feed events", events.length],
    ["Customers", customers.length],
    ["Threshold", state.threshold],
    ["Campaigns ready", campaigns.length],
    ["Irrelevant routes suppressed", suppressed],
  ];
  byId("summaryGrid").innerHTML = cards
    .map(([label, value]) => `<div class="summary-card"><div class="summary-label">${label}</div><div class="summary-value">${value}</div></div>`)
    .join("");
}

function renderFeed() {
  byId("signalFeed").innerHTML = filteredEvents()
    .map(
      (event) => `
        <article class="signal-card">
          <div class="tag-row">
            <span class="pill blue">${event.classification}</span>
            <span class="tag">${event.jurisdiction}</span>
          </div>
          <h3>${event.title}</h3>
          <p class="muted">${event.summary}</p>
          <div class="meta-row"><span>${event.agency}</span><span>Published: ${event.published}</span></div>
          <div class="tag-row">${event.tags.map((tag) => `<span class="tag">${tag}</span>`).join("")}</div>
        </article>`
    )
    .join("");
}

function renderQueue() {
  const queue = buildQueue();
  byId("routingQueue").innerHTML = queue.map(routeCard).join("");
  byId("queueDetail").innerHTML = queue.map(accountDetail).join("");
  const firstCampaign = queue.find((item) => item.campaign);
  byId("campaignPreview").innerHTML = firstCampaign ? campaignCard(firstCampaign.campaign, true) : emptyPanel("No campaigns crossed the threshold for this feed.");
}

function routeCard(item) {
  const width = Math.min(100, Math.round((item.score / state.threshold) * 100));
  return `
    <article class="route-card">
      <div class="route-top">
        <div>
          <h3>${item.customer.name}</h3>
          <p class="muted">${item.customer.product}</p>
        </div>
        <div class="score">${item.score}</div>
        <span class="pill ${pillClass(item.route)}">${item.route}</span>
      </div>
      <div class="progress-track"><div class="progress-fill" style="width:${width}%"></div></div>
      <div class="meta-row">
        <span>Owner: ${item.customer.owner}</span>
        <span>Evidence: ${item.evidence.length}</span>
        <span>Suppression: ${item.campaign ? "active after enrollment" : "not active"}</span>
      </div>
    </article>`;
}

function accountDetail(item) {
  return `
    <article class="account-card">
      <div class="account-top">
        <div>
          <h3>${item.customer.name}</h3>
          <p class="muted">${item.customer.segment} | ${item.customer.product}</p>
        </div>
        <div class="score">${item.score}</div>
        <span class="pill ${pillClass(item.route)}">${item.route}</span>
      </div>
      <ol class="evidence-list">
        ${
          item.evidence.length
            ? item.evidence.map((event) => `<li><strong>+${event.score}</strong> ${event.title}</li>`).join("")
            : "<li>No relevant signals in this scenario.</li>"
        }
      </ol>
    </article>`;
}

function renderCampaigns() {
  const campaigns = buildQueue().filter((item) => item.campaign).map((item) => item.campaign);
  byId("campaignList").innerHTML = campaigns.length ? campaigns.map((campaign) => campaignCard(campaign, false)).join("") : emptyPanel("No campaign is ready to enroll.");
}

function campaignCard(campaign, compact) {
  const emails = compact
    ? ""
    : campaign.emails
        .map((email, index) => `<div class="email-card"><strong>Email ${index + 1}: ${email.subject}</strong>\n\n${email.body}</div>`)
        .join("");
  const payload = compact ? "" : `<pre class="payload">${JSON.stringify(campaign.payload, null, 2)}</pre>`;
  return `
    <article class="campaign-card">
      <div class="campaign-top">
        <div>
          <h3>${campaign.name}</h3>
          <p class="muted">${campaign.customer.name} | Owner: ${campaign.owner}</p>
        </div>
        <div class="score">${campaign.score}</div>
        <span class="pill green">${campaign.status}</span>
      </div>
      <ol class="evidence-list">
        ${campaign.evidence.map((event) => `<li>${event.title}</li>`).join("")}
      </ol>
      <div class="meta-row"><span>Suppression: ${campaign.suppression}</span><span>${campaign.evidence.length} evidence events</span></div>
      ${emails}
      ${payload}
    </article>`;
}

function renderImpact() {
  const queue = buildQueue();
  const events = scenarioEvents[state.scenario];
  const relevant = queue.reduce((sum, item) => sum + item.evidence.length, 0);
  const totalChecks = events.length * customers.length;
  const suppressed = totalChecks - relevant;
  const campaigns = queue.filter((item) => item.campaign).length;
  const rows = [
    ["Signals reviewed", events.length, 100],
    ["Customer checks run", totalChecks, 100],
    ["Irrelevant routes suppressed", suppressed, Math.round((suppressed / Math.max(totalChecks, 1)) * 100)],
    ["Campaigns created", campaigns, Math.round((campaigns / customers.length) * 100)],
  ];
  byId("impactReport").innerHTML = rows
    .map(
      ([label, value, percent]) => `
        <div class="impact-row">
          <strong>${label}</strong>
          <div class="report-bar"><span style="width:${percent}%"></span></div>
          <span>${value}</span>
        </div>`
    )
    .join("");
}

function renderRules() {
  const rules = [
    ["Trigger sequence", `Customer score >= ${state.threshold}`],
    ["Needs review", "Customer score between 200 and trigger threshold"],
    ["Monitor only", "Relevant signal exists but score is below review threshold"],
    ["No route", "No relevant signal for the customer"],
    ["Suppression", "30-day hold after campaign creation"],
  ];
  byId("rulesList").innerHTML = rules
    .map(([name, value]) => `<div class="rule-item"><strong>${name}</strong><span class="muted">${value}</span></div>`)
    .join("");
}

function pillClass(route) {
  if (route === "Trigger sequence") return "green";
  if (route === "Needs review") return "orange";
  if (route === "Monitor only") return "blue";
  return "gray";
}

function emptyPanel(message) {
  return `<div class="route-card"><p class="muted">${message}</p></div>`;
}

function setActiveView(view) {
  document.querySelectorAll(".view").forEach((node) => node.classList.remove("active"));
  document.querySelectorAll(".nav-item").forEach((node) => node.classList.toggle("active", node.dataset.view === view));
  byId(`${view}View`).classList.add("active");
  const titles = {
    dashboard: "Dashboard",
    feed: "Signal Feed",
    queue: "Routing Queue",
    campaigns: "Campaigns",
    rules: "Rules",
  };
  byId("pageTitle").textContent = titles[view];
}

function byId(id) {
  return document.getElementById(id);
}

function init() {
  byId("scenarioSelect").innerHTML = Object.keys(scenarioEvents).map((name) => `<option>${name}</option>`).join("");
  byId("scenarioSelect").value = state.scenario;
  byId("thresholdValue").textContent = state.threshold;

  document.querySelectorAll(".nav-item").forEach((button) => {
    button.addEventListener("click", () => {
      state.view = button.dataset.view;
      render();
    });
  });

  byId("scenarioSelect").addEventListener("change", (event) => {
    state.scenario = event.target.value;
    render();
  });

  byId("triggerThreshold").addEventListener("input", (event) => {
    state.threshold = Number(event.target.value);
    byId("thresholdValue").textContent = state.threshold;
    render();
  });

  byId("searchInput").addEventListener("input", (event) => {
    state.search = event.target.value;
    renderFeed();
  });

  byId("jurisdictionFilter").addEventListener("change", (event) => {
    state.jurisdiction = event.target.value;
    renderFeed();
  });

  byId("classificationFilter").addEventListener("change", (event) => {
    state.classification = event.target.value;
    renderFeed();
  });

  byId("refreshButton").addEventListener("click", render);
  byId("exportButton").addEventListener("click", () => {
    const payloads = buildQueue()
      .filter((item) => item.campaign)
      .map((item) => item.campaign.payload);
    navigator.clipboard?.writeText(JSON.stringify(payloads, null, 2));
  });

  render();
}

init();
