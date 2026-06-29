const customers = [
  {
    id: "autoforge",
    name: "AutoForge Inc",
    segment: "Automotive",
    icpTier: "Strategic",
    owner: "Maya Chen",
    website: "autoforge-demo.com",
    contactName: "Alex Morgan",
    contactEmail: "alex@autoforge-demo.com",
    contactTitle: "VP Compliance",
    regions: ["EU", "US", "Canada"],
    productLines: ["EV battery modules", "charging components", "battery enclosures"],
    components: ["lithium-ion cells", "battery management systems", "charging inlets", "supplier traceability data"],
    materials: ["lithium", "cobalt", "nickel", "recycled polymers"],
    useCases: ["electric vehicles", "battery passport reporting", "end-of-life recycling"],
    agencies: ["European Commission", "ECHA", "NHTSA", "EPA"],
    frameworks: ["EU Battery Regulation", "REACH", "RoHS", "NHTSA FMVSS", "EPA RCRA"],
    standards: ["ISO 26262", "UL 2580", "GB/T 31467"],
    buyingCommittee: ["VP Compliance", "Head of Battery Engineering", "Supply Chain Quality"],
    activeInitiatives: ["EU battery passport readiness", "supplier traceability program", "recycling disclosure workflow"],
    painPoints: ["fragmented supplier data", "deadline visibility", "material origin documentation"],
    strongTags: ["automotive", "ev", "electric vehicle", "battery", "charging", "battery passport", "supplier traceability", "recycling"],
    weakTags: ["regulation", "deadline", "safety", "compliance", "equipment", "EU", "US"],
    exclusionTags: ["aerospace", "aircraft", "medical device", "surgical", "construction", "heavy machinery"],
  },
  {
    id: "medibuild",
    name: "MediBuild Solutions",
    segment: "Medical Devices",
    icpTier: "High",
    owner: "Jordan Patel",
    website: "medibuild-demo.com",
    contactName: "Morgan Lee",
    contactEmail: "morgan@medibuild-demo.com",
    contactTitle: "Director of Quality",
    regions: ["US", "EU", "UK"],
    productLines: ["connected diagnostic devices", "surgical equipment", "clinical monitoring systems"],
    components: ["embedded software", "diagnostic sensors", "sterile instrument modules", "wireless connectivity"],
    materials: ["biocompatible polymers", "stainless steel", "medical-grade electronics"],
    useCases: ["post-market surveillance", "device cybersecurity", "quality system documentation"],
    agencies: ["FDA", "European Commission", "MHRA"],
    frameworks: ["FDA QMSR", "EU MDR", "FDA Cybersecurity Guidance", "ISO 13485"],
    standards: ["IEC 62304", "ISO 14971", "IEC 81001-5-1"],
    buyingCommittee: ["Director of Quality", "Regulatory Affairs", "Product Security"],
    activeInitiatives: ["connected device cybersecurity", "quality system remediation", "EU MDR evidence cleanup"],
    painPoints: ["software documentation gaps", "cybersecurity evidence", "clinical risk traceability"],
    strongTags: ["medical", "medical device", "device", "diagnostic", "surgical", "cybersecurity", "quality system", "FDA"],
    weakTags: ["regulation", "deadline", "safety", "compliance", "equipment", "EU", "US"],
    exclusionTags: ["automotive", "ev", "battery", "aerospace", "aircraft", "construction", "heavy machinery"],
  },
  {
    id: "aerodynamics",
    name: "AeroDynamics",
    segment: "Aerospace",
    icpTier: "Medium",
    owner: "Sam Rivera",
    website: "aerodynamics-demo.com",
    contactName: "Taylor Brooks",
    contactEmail: "taylor@aerodynamics-demo.com",
    contactTitle: "Certification Lead",
    regions: ["US", "UK", "EU"],
    productLines: ["aircraft cabin systems", "composite panels", "interior safety components"],
    components: ["cabin panels", "composite brackets", "flammability test evidence", "certification packages"],
    materials: ["carbon fiber composites", "resins", "flame-retardant textiles"],
    useCases: ["airworthiness certification", "supplier conformity", "cabin safety updates"],
    agencies: ["FAA", "EASA", "CAA"],
    frameworks: ["FAA Airworthiness Directives", "EASA CS-25", "14 CFR Part 25"],
    standards: ["SAE AIR", "ASTM composite methods", "DO-160"],
    buyingCommittee: ["Certification Lead", "Head of Cabin Engineering", "Quality Assurance"],
    activeInitiatives: ["composite material recertification", "cabin safety evidence refresh"],
    painPoints: ["slow certification review", "supplier material evidence", "changing FAA guidance"],
    strongTags: ["aerospace", "aircraft", "FAA", "EASA", "cabin", "composite", "airworthiness", "certification"],
    weakTags: ["regulation", "deadline", "safety", "standard", "materials", "US", "EU"],
    exclusionTags: ["automotive", "ev", "battery", "medical device", "surgical", "construction", "heavy machinery"],
  },
  {
    id: "constructsafe",
    name: "ConstructSafe",
    segment: "Construction",
    icpTier: "Medium",
    owner: "Priya Shah",
    website: "constructsafe-demo.com",
    contactName: "Casey Reed",
    contactEmail: "casey@constructsafe-demo.com",
    contactTitle: "Safety Operations Lead",
    regions: ["US", "EU"],
    productLines: ["heavy machinery", "jobsite sensors", "worker safety equipment"],
    components: ["diesel engines", "telemetry modules", "protective systems", "emissions reporting"],
    materials: ["steel", "hydraulics", "industrial electronics"],
    useCases: ["site safety compliance", "machine emissions reporting", "fleet documentation"],
    agencies: ["OSHA", "EPA", "European Commission"],
    frameworks: ["OSHA Safety Standards", "EU Machinery Regulation", "EPA Nonroad Engine Rules"],
    standards: ["ISO 45001", "ISO 13849", "EN 474"],
    buyingCommittee: ["Safety Operations Lead", "Fleet Compliance", "Equipment Engineering"],
    activeInitiatives: ["machinery safety documentation", "jobsite sensor compliance"],
    painPoints: ["field-level evidence collection", "equipment documentation", "inspection readiness"],
    strongTags: ["construction", "machinery", "heavy machinery", "jobsite", "worker safety", "OSHA", "emissions"],
    weakTags: ["regulation", "deadline", "safety", "equipment", "standard", "EU", "US"],
    exclusionTags: ["automotive", "ev", "battery", "aerospace", "aircraft", "medical device", "surgical"],
  },
];

const signalSources = [
  {
    id: "src_eu_battery",
    name: "EU Battery Regulation Watch",
    type: "Regulator",
    agency: "European Commission",
    jurisdiction: "EU",
    credibility: "Primary",
    cadence: "Daily",
    domains: ["automotive", "ev", "battery", "recycling"],
    coverage: ["battery passport", "recycled content", "supplier traceability", "end-of-life disclosure"],
    recentSignals: ["evt_battery_001", "evt_battery_002", "evt_battery_003"],
  },
  {
    id: "src_fda_device",
    name: "FDA Device Guidance Feed",
    type: "Agency Guidance",
    agency: "FDA",
    jurisdiction: "US",
    credibility: "Primary",
    cadence: "Weekly",
    domains: ["medical device", "diagnostic", "cybersecurity", "quality system"],
    coverage: ["connected devices", "software evidence", "QMSR", "post-market surveillance"],
    recentSignals: ["evt_med_001", "evt_med_002", "evt_med_003"],
  },
  {
    id: "src_faa_safety",
    name: "FAA Airworthiness and Safety Alerts",
    type: "Agency Alert",
    agency: "FAA",
    jurisdiction: "US",
    credibility: "Primary",
    cadence: "Weekly",
    domains: ["aerospace", "aircraft", "cabin", "composite"],
    coverage: ["airworthiness", "cabin safety", "materials certification", "supplier conformity"],
    recentSignals: ["evt_aero_001", "evt_aero_002"],
  },
  {
    id: "src_machinery",
    name: "Industrial Machinery Compliance Monitor",
    type: "Standards + Regulator",
    agency: "European Commission / OSHA",
    jurisdiction: "EU, US",
    credibility: "Composite",
    cadence: "Weekly",
    domains: ["construction", "machinery", "worker safety", "emissions"],
    coverage: ["machine safety", "inspection readiness", "jobsite monitoring", "nonroad emissions"],
    recentSignals: ["evt_machine_001", "evt_machine_002"],
  },
];

const signals = [
  signal({
    id: "evt_battery_001",
    title: "EU Battery Passport Enforcement Deadline",
    sourceId: "src_eu_battery",
    type: "Enforcement notice",
    agency: "European Commission",
    jurisdiction: "EU",
    classification: "Recommended",
    published: "Dec 12, 2025",
    deadline: "Feb 18, 2026",
    summary: "Enforcement dates were confirmed for battery passport reporting, supplier traceability, and recycling disclosures for EV battery systems.",
    affectedDomains: ["automotive", "ev", "battery"],
    excludedDomains: ["aerospace", "medical device", "construction"],
    strongTags: ["battery passport", "ev", "battery", "supplier traceability", "recycling"],
    weakTags: ["deadline", "regulation", "EU", "compliance"],
    exclusionTags: ["aircraft", "surgical", "heavy machinery"],
    severity: { deadlinePressure: 28, enforcementRisk: 30, operationalImpact: 24 },
  }),
  signal({
    id: "evt_battery_002",
    title: "EV Battery Recycling Disclosure Rule",
    sourceId: "src_eu_battery",
    type: "Regulatory update",
    agency: "European Commission",
    jurisdiction: "EU",
    classification: "Recommended",
    published: "Dec 08, 2025",
    deadline: "Mar 31, 2026",
    summary: "EV battery module suppliers selling into the EU must publish recycling disclosures and component-level compliance evidence.",
    affectedDomains: ["automotive", "ev", "battery", "recycling"],
    excludedDomains: ["medical device", "aerospace"],
    strongTags: ["ev", "battery", "recycling", "battery modules"],
    weakTags: ["standard", "deadline", "EU"],
    exclusionTags: ["diagnostic", "aircraft"],
    severity: { deadlinePressure: 22, enforcementRisk: 20, operationalImpact: 22 },
  }),
  signal({
    id: "evt_battery_003",
    title: "Supplier Traceability Requirements for Battery Components",
    sourceId: "src_eu_battery",
    type: "Consultation",
    agency: "European Chemicals Agency",
    jurisdiction: "EU",
    classification: "Monitor",
    published: "Dec 03, 2025",
    deadline: "Apr 15, 2026",
    summary: "Battery component manufacturers must document supplier traceability, material origin, and compliance controls before the next reporting cycle.",
    affectedDomains: ["automotive", "battery", "supplier traceability"],
    excludedDomains: ["medical device", "aerospace", "construction"],
    strongTags: ["battery", "supplier traceability", "material origin", "REACH"],
    weakTags: ["compliance", "deadline", "EU"],
    exclusionTags: ["surgical", "cabin", "jobsite"],
    severity: { deadlinePressure: 18, enforcementRisk: 16, operationalImpact: 20 },
  }),
  signal({
    id: "evt_med_001",
    title: "FDA Medical Device Cybersecurity Guidance",
    sourceId: "src_fda_device",
    type: "Agency guidance",
    agency: "FDA",
    jurisdiction: "US",
    classification: "Recommended",
    published: "Nov 26, 2025",
    deadline: "Jan 30, 2026",
    summary: "FDA guidance outlines mandatory cybersecurity documentation for connected diagnostic and surgical medical devices.",
    affectedDomains: ["medical device", "diagnostic", "cybersecurity"],
    excludedDomains: ["automotive", "aerospace", "construction"],
    strongTags: ["FDA", "medical device", "diagnostic", "cybersecurity", "quality system"],
    weakTags: ["safety", "deadline", "US", "regulation"],
    exclusionTags: ["ev", "aircraft", "heavy machinery"],
    severity: { deadlinePressure: 26, enforcementRisk: 26, operationalImpact: 24 },
  }),
  signal({
    id: "evt_med_002",
    title: "Connected Diagnostic Device Security Rule",
    sourceId: "src_fda_device",
    type: "Regulatory update",
    agency: "FDA",
    jurisdiction: "US",
    classification: "Recommended",
    published: "Nov 19, 2025",
    deadline: "Mar 01, 2026",
    summary: "Connected diagnostic device manufacturers must update quality systems, risk controls, and vulnerability response workflows.",
    affectedDomains: ["medical device", "diagnostic", "cybersecurity"],
    excludedDomains: ["automotive", "aerospace"],
    strongTags: ["diagnostic", "device", "cybersecurity", "quality system", "FDA"],
    weakTags: ["standard", "US", "compliance"],
    exclusionTags: ["battery", "aircraft"],
    severity: { deadlinePressure: 18, enforcementRisk: 20, operationalImpact: 20 },
  }),
  signal({
    id: "evt_med_003",
    title: "Surgical Equipment Quality System Update",
    sourceId: "src_fda_device",
    type: "Standards update",
    agency: "European Commission",
    jurisdiction: "EU",
    classification: "Monitor",
    published: "Nov 12, 2025",
    deadline: "Apr 30, 2026",
    summary: "Surgical equipment manufacturers face new documentation expectations for device quality controls and post-market monitoring.",
    affectedDomains: ["medical device", "surgical", "quality system"],
    excludedDomains: ["automotive", "aerospace", "construction"],
    strongTags: ["surgical", "medical device", "quality system", "post-market surveillance"],
    weakTags: ["equipment", "EU", "deadline"],
    exclusionTags: ["ev", "cabin", "machinery"],
    severity: { deadlinePressure: 14, enforcementRisk: 14, operationalImpact: 18 },
  }),
  signal({
    id: "evt_aero_001",
    title: "FAA Composite Materials Safety Alert",
    sourceId: "src_faa_safety",
    type: "Agency alert",
    agency: "FAA",
    jurisdiction: "US",
    classification: "Recommended",
    published: "Nov 21, 2025",
    deadline: "Jan 20, 2026",
    summary: "FAA issued a safety alert asking aerospace suppliers to review composite materials used in aircraft cabin systems.",
    affectedDomains: ["aerospace", "aircraft", "cabin", "composite"],
    excludedDomains: ["automotive", "medical device", "construction"],
    strongTags: ["FAA", "aerospace", "aircraft", "cabin", "composite", "airworthiness"],
    weakTags: ["safety", "materials", "US", "standard"],
    exclusionTags: ["ev", "surgical", "jobsite"],
    severity: { deadlinePressure: 24, enforcementRisk: 24, operationalImpact: 22 },
  }),
  signal({
    id: "evt_aero_002",
    title: "Aircraft Cabin Systems Certification Update",
    sourceId: "src_faa_safety",
    type: "Certification update",
    agency: "FAA",
    jurisdiction: "US",
    classification: "Recommended",
    published: "Nov 14, 2025",
    deadline: "Mar 15, 2026",
    summary: "Aircraft cabin system suppliers must document updated certification evidence for interior components and composite materials.",
    affectedDomains: ["aerospace", "aircraft", "cabin"],
    excludedDomains: ["automotive", "medical device", "construction"],
    strongTags: ["aircraft", "cabin", "certification", "composite", "FAA"],
    weakTags: ["safety", "US", "materials"],
    exclusionTags: ["battery", "diagnostic", "machinery"],
    severity: { deadlinePressure: 18, enforcementRisk: 20, operationalImpact: 20 },
  }),
  signal({
    id: "evt_generic_001",
    title: "General Product Safety Deadline Reminder",
    sourceId: "src_machinery",
    type: "Bulletin",
    agency: "European Commission",
    jurisdiction: "EU",
    classification: "Monitor",
    published: "Nov 05, 2025",
    deadline: "May 01, 2026",
    summary: "A general reminder references safety, equipment, regulation, and deadline language without naming a specific affected product domain.",
    affectedDomains: [],
    excludedDomains: [],
    strongTags: [],
    weakTags: ["safety", "equipment", "regulation", "deadline", "EU"],
    exclusionTags: [],
    severity: { deadlinePressure: 8, enforcementRisk: 4, operationalImpact: 4 },
  }),
];

const scenarioEvents = {
  "EV battery regulatory wave": ["evt_battery_001", "evt_battery_002", "evt_battery_003"],
  "Medical device cybersecurity wave": ["evt_med_001", "evt_med_002", "evt_med_003"],
  "Aerospace safety wave": ["evt_aero_001", "evt_aero_002"],
  "Mixed regulatory feed": ["evt_battery_001", "evt_battery_002", "evt_battery_003", "evt_med_001", "evt_med_002", "evt_aero_001", "evt_generic_001"],
  "Generic weak-signal feed": ["evt_generic_001"],
};

const state = {
  view: "dashboard",
  scenario: "EV battery regulatory wave",
  threshold: 280,
  search: "",
  jurisdiction: "All",
  classification: "All",
  selectedCustomer: "autoforge",
};

const COMPONENT_MAX = {
  domain_fit: 95,
  product_fit: 70,
  jurisdiction_fit: 28,
  regulatory_fit: 48,
  urgency: 82,
  commercial_priority: 37,
};

const SCORE_MAX = Object.values(COMPONENT_MAX).reduce((sum, value) => sum + value, 0);
const ACTIVATION_STORE_KEY = "signal-router-activations-v1";
const inFlightActivations = new Set();
const memoryActivations = {};
let backendAvailable;

function signal(config) {
  const source = signalSources.find((item) => item.id === config.sourceId);
  return {
    ...config,
    sourceName: source?.name || "Unknown source",
    sourceType: source?.type || config.type,
    tags: [...config.strongTags, ...config.weakTags],
  };
}

function currentEvents() {
  return scenarioEvents[state.scenario].map((id) => signals.find((event) => event.id === id));
}

function routeFor(score, evidenceCount) {
  if (!evidenceCount) return "No route";
  if (score >= state.threshold) return "Trigger sequence";
  if (score >= 200) return "Needs review";
  return "Monitor only";
}

function scoreSignal(customer, event) {
  const customerStrong = normalizeList(customer.strongTags);
  const customerProducts = normalizeList([...customer.productLines, ...customer.components, ...customer.materials, ...customer.useCases]);
  const customerReg = normalizeList([...customer.agencies, ...customer.frameworks, ...customer.standards]);
  const customerRegions = normalizeList(customer.regions);
  const eventStrong = normalizeList([...event.affectedDomains, ...event.strongTags]);
  const eventWeak = normalizeList(event.weakTags);
  const eventExcluded = normalizeList([...event.excludedDomains, ...event.exclusionTags]);

  const exclusionMatches = intersection([...customerStrong, ...customerProducts], eventExcluded);
  if (exclusionMatches.length) {
    return {
      score: 0,
      routed: false,
      excluded: true,
      reason: `${customer.name} is explicitly excluded by ${formatList(exclusionMatches)}.`,
      components: zeroComponents(),
      matched: [],
      weakMatched: [],
    };
  }

  const domainMatches = semanticIntersection(customerStrong, eventStrong);
  const productMatches = semanticIntersection(customerProducts, eventStrong);
  const regulatoryMatches = semanticIntersection(customerReg, normalizeList([event.agency, ...event.strongTags]));
  const jurisdictionMatches = customerRegions.includes(normalize(event.jurisdiction)) ? [event.jurisdiction] : [];
  const weakMatches = semanticIntersection(normalizeList(customer.weakTags), eventWeak);
  const hasPlausibleMatch = domainMatches.length || productMatches.length;

  if (!hasPlausibleMatch) {
    const suffix = weakMatches.length ? ` Generic overlap (${formatList(weakMatches)}) is not enough to route.` : "";
    return {
      score: 0,
      routed: false,
      excluded: false,
      reason: `No affected product or regulatory domain matches ${customer.name}.${suffix}`,
      components: zeroComponents(),
      matched: [],
      weakMatched: weakMatches,
    };
  }

  const components = {
    domain_fit: Math.min(COMPONENT_MAX.domain_fit, domainMatches.length * 28),
    product_fit: Math.min(COMPONENT_MAX.product_fit, productMatches.length * 18),
    jurisdiction_fit: jurisdictionMatches.length ? COMPONENT_MAX.jurisdiction_fit : 0,
    regulatory_fit: Math.min(COMPONENT_MAX.regulatory_fit, regulatoryMatches.length * 16),
    urgency: Math.min(COMPONENT_MAX.urgency, event.severity.deadlinePressure + event.severity.enforcementRisk + event.severity.operationalImpact),
    commercial_priority: priorityScore(customer),
  };
  const score = Object.values(components).reduce((sum, value) => sum + value, 0);
  const matched = unique([...domainMatches, ...productMatches, ...regulatoryMatches, ...jurisdictionMatches]);
  return {
    score,
    routed: true,
    excluded: false,
    reason: `${customer.name} matches affected ${formatList(unique([...domainMatches, ...productMatches]).slice(0, 4))} context from ${event.agency}.`,
    components,
    matched,
    weakMatched: weakMatches,
  };
}

function buildQueue() {
  return customers
    .map((customer) => {
      const scoredEvents = currentEvents().map((event) => ({ event, scoring: scoreSignal(customer, event) }));
      const evidence = scoredEvents
        .filter((item) => item.scoring.routed)
        .map((item) => ({ ...item.event, score: item.scoring.score, scoring: item.scoring }));
      const exclusions = scoredEvents.filter((item) => item.scoring.excluded).map((item) => item.scoring.reason);
      const noRouteReasons = scoredEvents.filter((item) => !item.scoring.routed).map((item) => item.scoring.reason);
      const components = aggregateComponents(evidence);
      const score = Math.min(SCORE_MAX, Object.values(components).reduce((sum, value) => sum + value, 0));
      const route = routeFor(score, evidence.length);
      const campaign = route === "Trigger sequence" ? buildCampaign(customer, evidence, score, components) : null;
      const explanation = evidence.length
        ? `${customer.name} has ${evidence.length} strong signal${evidence.length === 1 ? "" : "s"} tied to ${formatList(topMatches(evidence))}.`
        : noRouteReasons[0] || `No relevant signals in ${state.scenario}.`;
      return { customer, score, route, evidence, campaign, components, explanation, exclusions };
    })
    .sort((a, b) => b.score - a.score);
}

function buildCampaign(customer, evidence, score, components) {
  const name = campaignTopic(evidence);
  const activationKey = buildActivationKey(customer, name, evidence);
  const activation = getActivation(activationKey);
  return {
    activationKey,
    name,
    customer,
    score,
    components,
    owner: customer.owner,
    status: activation.status,
    activation,
    suppression: "30 days",
    evidence,
    emails: buildEmails(customer, evidence, name),
    payload: {
      tool: "CRM",
      action: "prepare_campaign_handoff",
      activation_key: activationKey,
      company_id: customer.id,
      owner: customer.owner,
      campaign: name,
      trigger_score: score,
      evidence_event_ids: evidence.map((event) => event.id),
      scoring_components: components,
    },
  };
}

function campaignTopic(evidence) {
  const tags = normalizeList(evidence.flatMap((event) => event.strongTags));
  if (tags.includes("battery") || tags.includes("ev")) return "Battery Compliance Outreach";
  if (tags.includes("cybersecurity")) return "Device Cybersecurity Outreach";
  if (tags.includes("aerospace") || tags.includes("aircraft")) return "Aerospace Safety Outreach";
  if (tags.includes("machinery")) return "Machinery Compliance Outreach";
  return "Regulatory Signal Outreach";
}

function buildEmails(customer, evidence, campaignName) {
  const titles = evidence.map((event) => event.title);
  const topEvidence = titles.slice(0, 2).join("; ");
  return [
    {
      subject: `${campaignName} for ${customer.name}`,
      body: `Hi {{first_name}},\n\nWe saw a cluster of regulatory updates that map directly to ${customer.name}'s ${customer.productLines[0].toLowerCase()} work: ${topEvidence}.\n\nWorth comparing notes on whether these changes create new compliance work?`,
    },
    {
      subject: `Why this signal appears relevant`,
      body: `Hi {{first_name}},\n\nThis was routed because the affected domains, product scope, jurisdiction, and regulatory bodies overlap with ${customer.name}'s profile. The signal stack crossed the threshold after ${evidence.length} relevant event${evidence.length === 1 ? "" : "s"}.\n\nHappy to send over the event summary if useful.`,
    },
    {
      subject: "Quick regulatory signal review?",
      body: `Hi {{first_name}},\n\nWould it be useful to walk through the specific updates and where they may touch ${customer.name}'s current compliance initiatives?\n\nOpen to a quick conversation this week?`,
    },
  ];
}

function filteredEvents() {
  return currentEvents().filter((event) => {
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
  renderProfiles();
  renderSources();
  renderCampaigns();
  renderImpact();
  setActiveView(state.view);
  scheduleAutoActivations();
}

function renderSummary() {
  const queue = buildQueue();
  const events = currentEvents();
  const campaigns = queue.filter((item) => item.campaign);
  const synced = campaigns.filter((item) => item.campaign.activation.status === "Sequence prepared").length;
  const suppressed = queue.filter((item) => item.route === "No route").length * events.length;
  const cards = [
    ["Signals reviewed", events.length],
    ["Customer profiles", customers.length],
    ["Campaigns ready", campaigns.length],
    ["Sequences prepared", synced],
    ["False positives blocked", suppressed],
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
            <span class="tag">${event.type}</span>
          </div>
          <h3>${event.title}</h3>
          <p class="muted">${event.summary}</p>
          <div class="meta-row"><span>${event.agency}</span><span>Published: ${event.published}</span><span>Deadline: ${event.deadline}</span></div>
          <div class="tag-block">
            <strong>Affected</strong>
            <div class="tag-row">${event.affectedDomains.map((tag) => `<span class="tag strong">${tag}</span>`).join("") || "<span class='muted'>No named domain</span>"}</div>
          </div>
          <div class="tag-row">${event.weakTags.map((tag) => `<span class="tag weak">${tag}</span>`).join("")}</div>
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
  byId("topEvidence").innerHTML = firstCampaign ? evidenceStack(firstCampaign.evidence) : emptyPanel("No strong signal stack yet.");
  byId("topBreakdown").innerHTML = firstCampaign ? componentBars(firstCampaign.components) : emptyPanel("No triggered score breakdown yet.");
}

function routeCard(item) {
  const width = Math.min(100, Math.round((item.score / state.threshold) * 100));
  return `
    <article class="route-card">
      <div class="route-top">
        <div>
          <h3>${item.customer.name}</h3>
          <p class="muted">${item.explanation}</p>
        </div>
        <div class="score">${item.score}<small>/${SCORE_MAX}</small></div>
        <span class="pill ${pillClass(item.route)}">${item.route}</span>
      </div>
      <div class="progress-track"><div class="progress-fill" style="width:${width}%"></div></div>
      <div class="meta-row">
        <span>Owner: ${item.customer.owner}</span>
        <span>Evidence: ${item.evidence.length}</span>
        <span>ICP: ${item.customer.icpTier}</span>
      </div>
      ${item.evidence.length ? `<div class="mini-bars">${componentBars(item.components)}</div>` : ""}
    </article>`;
}

function accountDetail(item) {
  return `
    <article class="account-card">
      <div class="account-top">
        <div>
          <h3>${item.customer.name}</h3>
          <p class="muted">${item.customer.segment} | ${item.customer.productLines.join(", ")}</p>
        </div>
        <div class="score">${item.score}<small>/${SCORE_MAX}</small></div>
        <span class="pill ${pillClass(item.route)}">${item.route}</span>
      </div>
      ${componentBars(item.components)}
      <ol class="evidence-list">
        ${
          item.evidence.length
            ? item.evidence.map((event) => `<li><strong>+${event.score}</strong> ${event.title}<br><span class="muted">${event.scoring.reason}</span></li>`).join("")
            : `<li>${item.explanation}</li>`
        }
      </ol>
      ${item.exclusions.length ? `<p class="muted">Explicit exclusions: ${item.exclusions.join(" ")}</p>` : ""}
    </article>`;
}

function renderProfiles() {
  const selected = customers.find((customer) => customer.id === state.selectedCustomer) || customers[0];
  byId("profileList").innerHTML = customers
    .map(
      (customer) => `
        <button class="profile-card ${customer.id === selected.id ? "selected" : ""}" data-profile="${customer.id}">
          <strong>${customer.name}</strong>
          <span>${customer.segment} | ${customer.icpTier}</span>
          <span>${customer.productLines[0]}</span>
        </button>`
    )
    .join("");
  byId("profileDetail").innerHTML = `
    <article class="panel profile-detail">
      <div class="panel-header">
        <div>
          <h2>${selected.name}</h2>
          <p>${selected.segment} account owned by ${selected.owner}</p>
        </div>
        <span class="pill green">${selected.icpTier}</span>
      </div>
      ${profileSection("Product Scope", [...selected.productLines, ...selected.components])}
      ${profileSection("Regulatory Exposure", [...selected.agencies, ...selected.frameworks, ...selected.standards])}
      ${profileSection("GTM Context", [...selected.activeInitiatives, ...selected.painPoints, ...selected.buyingCommittee])}
      ${profileSection("Strong Routing Tags", selected.strongTags)}
      ${profileSection("Weak Generic Tags", selected.weakTags)}
      ${profileSection("Exclusion Tags", selected.exclusionTags)}
    </article>`;
}

function profileSection(title, values) {
  return `
    <div class="detail-section">
      <h3>${title}</h3>
      <div class="tag-row">${values.map((value) => `<span class="tag">${value}</span>`).join("")}</div>
    </div>`;
}

function renderSources() {
  byId("sourceGrid").innerHTML = signalSources
    .map((source) => {
      const eventCount = source.recentSignals.filter((id) => scenarioEvents[state.scenario].includes(id)).length;
      return `
        <article class="source-card">
          <div class="source-top">
            <span class="pill ${source.credibility === "Primary" ? "green" : "blue"}">${source.credibility}</span>
            <span class="tag">${source.type}</span>
          </div>
          <h3>${source.name}</h3>
          <p class="muted">${source.agency} | ${source.jurisdiction} | ${source.cadence}</p>
          <div class="tag-block">
            <strong>Coverage</strong>
            <div class="tag-row">${source.coverage.map((tag) => `<span class="tag">${tag}</span>`).join("")}</div>
          </div>
          <div class="meta-row"><span>${eventCount} active in current feed</span><span>${source.recentSignals.length} recent signals tracked</span></div>
        </article>`;
    })
    .join("");
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
  const action = compact
    ? ""
    : `<button class="primary-button activation-button" data-activation="${campaign.activationKey}">${activationButtonText(campaign.activation)}</button>`;
  return `
    <article class="campaign-card">
      <div class="campaign-top">
        <div>
          <h3>${campaign.name}</h3>
          <p class="muted">${campaign.customer.name} | Owner: ${campaign.owner}</p>
        </div>
        <div class="score">${campaign.score}<small>/${SCORE_MAX}</small></div>
        <span class="pill ${activationPillClass(campaign.activation)}">${campaign.activation.status}</span>
      </div>
      ${activationTimeline(campaign.activation)}
      ${componentBars(campaign.components)}
      ${evidenceStack(campaign.evidence)}
      <div class="meta-row"><span>Suppression: ${campaign.suppression}</span><span>${campaign.evidence.length} evidence events</span></div>
      <p class="muted">${activationSummary(campaign.activation)}</p>
      ${action}
      ${emails}
      ${payload}
    </article>`;
}

function evidenceStack(evidence) {
  return `
    <ol class="evidence-list">
      ${evidence.map((event) => `<li><strong>Signal strength: ${event.score}/${SCORE_MAX}</strong> ${event.title}<br><span class="muted">${event.scoring.reason}</span></li>`).join("")}
    </ol>`;
}

function renderImpact() {
  const queue = buildQueue();
  const events = currentEvents();
  const relevant = queue.reduce((sum, item) => sum + item.evidence.length, 0);
  const totalChecks = events.length * customers.length;
  const suppressed = totalChecks - relevant;
  const campaigns = queue.filter((item) => item.campaign).length;
  const rows = [
    ["Signals reviewed", events.length, 100],
    ["Customer checks run", totalChecks, 100],
    ["Strong matches found", relevant, Math.round((relevant / Math.max(totalChecks, 1)) * 100)],
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

function componentBars(components) {
  return `
    <div class="component-list">
      ${Object.entries(components)
        .map(
          ([name, value]) => `
            <div class="component-row">
              <span>${name.replace("_", " ")}</span>
              <div class="component-track"><i style="width:${Math.min(100, Math.round((value / COMPONENT_MAX[name]) * 100))}%"></i></div>
              <strong>${value}</strong>
            </div>`
        )
        .join("")}
    </div>`;
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
    profiles: "Customer Profiles",
    sources: "Signal Sources",
    campaigns: "Campaigns",
  };
  byId("pageTitle").textContent = titles[view];
}

function zeroComponents() {
  return {
    domain_fit: 0,
    product_fit: 0,
    jurisdiction_fit: 0,
    regulatory_fit: 0,
    urgency: 0,
    commercial_priority: 0,
  };
}

function aggregateComponents(evidence) {
  const totals = zeroComponents();
  evidence.forEach((item) => {
    Object.entries(item.scoring.components).forEach(([key, value]) => {
      totals[key] = Math.min(COMPONENT_MAX[key], Math.max(totals[key], value));
    });
  });
  return totals;
}

function priorityScore(customer) {
  if (customer.icpTier === "Strategic") return COMPONENT_MAX.commercial_priority;
  if (customer.icpTier === "High") return 28;
  return 20;
}

function topMatches(evidence) {
  return unique(evidence.flatMap((event) => event.scoring.matched)).slice(0, 5);
}

function normalize(value) {
  return String(value).toLowerCase().trim();
}

function normalizeList(values) {
  return values.map(normalize);
}

function intersection(left, right) {
  return unique(left.filter((item) => right.includes(item)));
}

function semanticIntersection(left, right) {
  return unique(
    right.filter((rightTerm) =>
      left.some((leftTerm) => termsMatch(leftTerm, rightTerm))
    )
  );
}

function termsMatch(left, right) {
  if (left === right) return true;
  if (left.length < 3 || right.length < 3) return false;
  return left.includes(right) || right.includes(left);
}

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

function formatList(values) {
  if (!values.length) return "no strong terms";
  if (values.length === 1) return values[0];
  return `${values.slice(0, -1).join(", ")} and ${values[values.length - 1]}`;
}

function buildActivationKey(customer, campaignName, evidence) {
  return [
    customer.id,
    normalize(campaignName).replace(/\s+/g, "-"),
    evidence.map((event) => event.id).sort().join("."),
  ].join("__");
}

function defaultActivation() {
  return {
    status: "Campaign created",
    crmSynced: false,
    sequencePrepared: false,
    emailStatus: "Awaiting send provider",
    autoFired: false,
    updatedAt: null,
    result: null,
    error: null,
  };
}

function getActivation(key) {
  return { ...defaultActivation(), ...(readActivations()[key] || {}) };
}

function setActivation(key, patch) {
  const activations = readActivations();
  activations[key] = {
    ...defaultActivation(),
    ...(activations[key] || {}),
    ...patch,
    updatedAt: new Date().toISOString(),
  };
  if (typeof localStorage === "undefined") {
    Object.assign(memoryActivations, activations);
    return;
  }
  localStorage.setItem(ACTIVATION_STORE_KEY, JSON.stringify(activations));
}

function readActivations() {
  if (typeof localStorage === "undefined") {
    return memoryActivations;
  }
  try {
    return JSON.parse(localStorage.getItem(ACTIVATION_STORE_KEY) || "{}");
  } catch {
    return {};
  }
}

function activationTimeline(activation) {
  const draftTasksDone = activation.status === "Draft task creation failed" ? false : activation.sequencePrepared;
  const steps = [
    ["Triggered", true],
    ["Campaign created", true],
    ["Synced to CRM", activation.crmSynced],
    ["Draft tasks created", draftTasksDone],
    [activation.emailStatus || "Awaiting send provider", draftTasksDone],
  ];
  return `
    <div class="activation-timeline">
      ${steps.map(([label, done]) => `<span class="${done ? "done" : ""}">${label}</span>`).join("")}
    </div>`;
}

function activationSummary(activation) {
  if (activation.status === "Sequence prepared") {
    const taskCount = activation.result?.taskSummary?.created ?? activation.result?.tasks?.filter((task) => task.id).length ?? 0;
    return `Auto-fired and synced to CRM. ${taskCount} email draft tasks were created in HubSpot; external sending is awaiting a configured provider.`;
  }
  if (activation.status === "Draft task creation failed") {
    const summary = activation.result?.taskSummary;
    const reason = summary?.errors?.[0] || activation.error || "HubSpot did not create the email draft tasks.";
    return `CRM records synced, but email draft tasks were not created (${summary?.created || 0}/${summary?.expected || 0}). ${reason}`;
  }
  if (activation.status === "CRM sync failed") {
    return `Campaign remains available, but CRM sync failed: ${activation.error}`;
  }
  if (activation.status === "Awaiting CRM backend") {
    return "Campaign was created locally. Open the HubSpot backend on port 8601 to auto-sync it to CRM.";
  }
  if (activation.status === "Syncing to CRM") {
    return "Campaign crossed threshold and is syncing to HubSpot.";
  }
  return "Campaign crossed threshold and is ready for CRM activation.";
}

function activationButtonText(activation) {
  if (activation.status === "Sequence prepared") return "Sync again";
  if (activation.status === "Draft task creation failed") return "Retry draft tasks";
  if (activation.status === "Syncing to CRM") return "Syncing...";
  if (activation.status === "CRM sync failed") return "Retry CRM sync";
  return "Sync now";
}

function activationPillClass(activation) {
  if (activation.status === "Sequence prepared") return "green";
  if (activation.status === "Draft task creation failed") return "orange";
  if (activation.status === "CRM sync failed") return "orange";
  if (activation.status === "Syncing to CRM") return "blue";
  return "gray";
}

function scheduleAutoActivations() {
  buildQueue()
    .filter((item) => item.campaign)
    .forEach((item) => {
      const activation = getActivation(item.campaign.activationKey);
      if (activation.status !== "Campaign created") return;
      syncCampaign(item.campaign, { automatic: true });
    });
}

async function crmBackendIsAvailable() {
  if (backendAvailable !== undefined) return backendAvailable;
  try {
    const response = await fetch("/api/health");
    const result = await response.json();
    backendAvailable = Boolean(response.ok && result.ok && result.hubspotTokenConfigured);
  } catch {
    backendAvailable = false;
  }
  return backendAvailable;
}

async function syncCampaign(campaign, options = {}) {
  if (inFlightActivations.has(campaign.activationKey)) return;
  inFlightActivations.add(campaign.activationKey);
  setActivation(campaign.activationKey, {
    status: "Syncing to CRM",
    autoFired: Boolean(options.automatic),
    error: null,
  });
  render();

  try {
    const available = await crmBackendIsAvailable();
    if (!available) {
      setActivation(campaign.activationKey, {
        status: "Awaiting CRM backend",
        error: "HubSpot backend is not available on this origin.",
      });
      return;
    }

    const response = await fetch("/api/hubspot/handoff", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ campaign }),
    });
    const result = await response.json();
    if (!response.ok || !result.ok) {
      throw new Error(result.error || "HubSpot handoff failed");
    }
    const taskSummary = result.result?.taskSummary;
    if (taskSummary && !taskSummary.complete) {
      setActivation(campaign.activationKey, {
        status: "Draft task creation failed",
        crmSynced: true,
        sequencePrepared: false,
        emailStatus: "Awaiting draft task creation",
        result: result.result,
        error: taskSummary.errors?.[0] || "HubSpot did not create every email draft task.",
      });
      return;
    }
    setActivation(campaign.activationKey, {
      status: "Sequence prepared",
      crmSynced: true,
      sequencePrepared: true,
      emailStatus: "Awaiting send provider",
      result: result.result,
      error: null,
    });
  } catch (error) {
    setActivation(campaign.activationKey, {
      status: "CRM sync failed",
      error: error.message,
    });
  } finally {
    inFlightActivations.delete(campaign.activationKey);
    render();
  }
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

  document.addEventListener("click", (event) => {
    const activationButton = event.target.closest("[data-activation]");
    if (activationButton) {
      const key = activationButton.dataset.activation;
      const campaign = buildQueue().find((item) => item.campaign?.activationKey === key)?.campaign;
      if (campaign) syncCampaign(campaign, { automatic: false });
      return;
    }

    const profileButton = event.target.closest("[data-profile]");
    if (!profileButton) return;
    state.selectedCustomer = profileButton.dataset.profile;
    renderProfiles();
  });

  render();
}

init();
