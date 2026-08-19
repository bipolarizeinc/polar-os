export type ServicePage = {
  slug: string;
  label: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  intro: string;
  division: string;
  service: string;
  startingAt: string;
  outcomes: readonly { title: string; description: string }[];
  process: readonly { title: string; description: string }[];
  bestFor: readonly string[];
  faq: readonly { question: string; answer: string }[];
};

export const servicePages = [
  {
    slug: "business-formation-utah",
    label: "Business Formation",
    title: "Business Formation Services in Utah",
    metaTitle: "Business Formation Services in Utah",
    metaDescription:
      "Business formation support for Utah founders: entity setup, registration, EIN assistance, governance documents, banking readiness, and launch infrastructure.",
    eyebrow: "LAUNCHPAD™ // UTAH STARTUP FOUNDATION",
    intro:
      "BI POLARIZE helps Utah founders move from an informal idea to an organized business foundation. We connect formation decisions with the documents, identity, banking readiness, and operating structure the business needs after registration.",
    division: "launchpad",
    service: "Business Structure & Formation",
    startingAt: "$199",
    outcomes: [
      { title: "Choose the right starting structure", description: "Clarify the practical differences between common entity paths and identify the questions that require licensed legal or tax advice." },
      { title: "Organize the filing sequence", description: "Map state registration, EIN assistance, governance documents, banking readiness, and compliance tasks in the order they should happen." },
      { title: "Build beyond the filing", description: "Connect the new entity to brand, website, documentation, operating systems, and the next revenue-producing move." },
    ],
    process: [
      { title: "Extract", description: "We identify what you are forming, who owns it, where it operates, what it sells, and what must be protected or documented." },
      { title: "Structure", description: "P.O.L.A.R. maps the launch sequence, required information, dependencies, and decisions that should not be guessed." },
      { title: "Activate", description: "We prepare the approved support work, route specialist questions appropriately, and leave you with an organized operating foundation." },
    ],
    bestFor: ["First-time Utah founders", "Side businesses becoming formal", "Creators turning a project into a company", "Existing businesses rebuilding a messy foundation"],
    faq: [
      { question: "Does BI POLARIZE replace an attorney or accountant?", answer: "No. We provide business setup assistance, operational organization, and document engineering within the agreed scope. Legal, tax, and regulated professional decisions remain with appropriately licensed professionals." },
      { question: "Is the state filing fee included?", answer: "No. Published BPEI prices are service fees unless a listing explicitly says otherwise. Government and third-party charges are separate." },
      { question: "Can you help after the company is registered?", answer: "Yes. Formation is only the first layer. BPEI can connect governance documents, brand identity, web presence, business planning, automation, and operating procedures through the appropriate divisions." },
    ],
  },
  {
    slug: "business-plans-ogden-utah",
    label: "Business Plans",
    title: "Business Plans & Business Architecture in Ogden, Utah",
    metaTitle: "Business Plans & Business Architecture in Ogden, Utah",
    metaDescription:
      "Research-backed business plans and operating architecture for founders in Ogden and across Utah, including market, operations, financial logic, and execution priorities.",
    eyebrow: "BLUEPRINT™ // OGDEN BUSINESS ARCHITECTURE",
    intro:
      "A useful business plan should do more than impress a lender and die in a folder. BI POLARIZE builds research-backed plans that connect the founder’s intent to market evidence, operating requirements, financial logic, and a practical execution sequence.",
    division: "blueprint",
    service: "Comprehensive Business Plan",
    startingAt: "$499",
    outcomes: [
      { title: "A defensible business story", description: "Define the problem, customer, offer, positioning, competitive difference, and why the business deserves to exist now." },
      { title: "An operating model", description: "Translate the concept into roles, workflows, capabilities, tools, risks, milestones, and measurable priorities." },
      { title: "Financial logic", description: "Connect pricing, expected costs, acquisition assumptions, revenue pathways, and funding use to evidence instead of wishful math." },
    ],
    process: [
      { title: "Founder extraction", description: "We retrieve the full concept, including contradictions, constraints, hidden assumptions, and the outcome you actually want." },
      { title: "Research and polarization", description: "The idea is tested against customers, competitors, practical dependencies, and opposing scenarios before the architecture is locked." },
      { title: "Blueprint engineering", description: "The evidence becomes a coherent plan, operating model, priority sequence, and decision tool that can be updated as the business learns." },
    ],
    bestFor: ["Funding and vocational-rehabilitation packages", "New ventures that need a realistic operating plan", "Complex ideas crossing multiple services", "Businesses preparing to scale or reposition"],
    faq: [
      { question: "Is this a template business plan?", answer: "No. The plan is built around the actual founder, market, offer, constraints, and operating model. Templates may organize the document, but they do not supply the thinking." },
      { question: "Can the plan support a funding request?", answer: "Yes, when the available evidence supports it. We organize the use of funds, operating assumptions, projections, risks, and execution path; no plan can guarantee approval." },
      { question: "What is the Bipolarized Blueprint™?", answer: "It is BPEI’s flagship architecture engagement for concepts needing deeper extraction, research, positioning, systems design, documentation, and a coordinated deployment path." },
    ],
  },
  {
    slug: "branding-websites-ogden-utah",
    label: "Branding & Websites",
    title: "Branding & Website Services in Ogden, Utah",
    metaTitle: "Branding & Website Services in Ogden, Utah",
    metaDescription:
      "Brand identity, logo systems, five-page websites, messaging, and digital business presence for founders and small businesses in Ogden and across Utah.",
    eyebrow: "BRANDFORGE™ + NEXUS™ // DIGITAL PRESENCE",
    intro:
      "A logo without a clear business is decoration. A website without a conversion path is an expensive brochure. BI POLARIZE connects identity, messaging, web structure, and intake so the public-facing brand supports the way the business actually works.",
    division: "brandforge",
    service: "Logo + Branding Kit",
    startingAt: "$199",
    outcomes: [
      { title: "Recognizable identity", description: "Create a usable visual system with logo direction, color, typography, hierarchy, and production-ready brand assets." },
      { title: "Clear market language", description: "Explain what the business does, who it helps, why it is different, and what the visitor should do next without burying the answer." },
      { title: "Conversion-ready presence", description: "Connect the brand to a responsive website, direct contact paths, intake, analytics, and the basic search signals a real business needs." },
    ],
    process: [
      { title: "Position", description: "We clarify the audience, offer, personality, proof, objections, and competitive context before visual production begins." },
      { title: "Forge", description: "BrandForge™ develops the identity and standards while Nexus™ translates the approved system into a functional web experience." },
      { title: "Deploy", description: "The final assets are organized for actual use across web, social, documents, campaigns, and future production—not trapped in one mockup." },
    ],
    bestFor: ["New Utah businesses needing a credible launch", "Existing brands that look inconsistent or generic", "Founders who need brand and website decisions connected", "Service businesses that need a clearer intake path"],
    faq: [
      { question: "How much does a five-page website start at?", answer: "The current starting price is $650. Final scope depends on content, integrations, custom functionality, commerce, and the condition of existing assets." },
      { question: "Can I order branding without a website?", answer: "Yes. Logo and branding work can stand alone, and a website can also begin from an existing approved brand system." },
      { question: "Do you use AI-generated assets?", answer: "AI-assisted production may be used when appropriate and approved, but final work is selected, refined, and governed as part of a coherent brand system rather than delivered as random generations." },
    ],
  },
  {
    slug: "ai-automation-ogden-utah",
    label: "AI Automation",
    title: "AI Automation Services for Ogden, Utah Businesses",
    metaTitle: "AI Automation Services for Ogden, Utah Businesses",
    metaDescription:
      "Practical AI automation for Ogden and Utah businesses: intelligent intake, workflow routing, CRM connections, internal knowledge, reporting, and custom AI agents.",
    eyebrow: "NEXUS™ // PRACTICAL AI OPERATIONS",
    intro:
      "Useful AI should remove a real bottleneck, preserve context, and improve the handoff between people and systems. BI POLARIZE designs practical AI workflows for Utah businesses that need better intake, routing, documentation, follow-up, knowledge retrieval, or operational visibility.",
    division: "nexus",
    service: "AI & Workflow Automation",
    startingAt: "Scoped",
    outcomes: [
      { title: "Faster intake and routing", description: "Capture the right information, classify the request, and move it toward the correct person, division, record, or next action." },
      { title: "Connected business tools", description: "Reduce duplicate entry and lost context by linking forms, email, CRM, documents, dashboards, and approved third-party systems." },
      { title: "Retrievable operating knowledge", description: "Turn scattered documents, decisions, and procedures into governed information that staff and approved AI systems can actually find." },
    ],
    process: [
      { title: "Map the bottleneck", description: "We document the current trigger, decision points, handoffs, tools, failure modes, and measurable cost of leaving the workflow unchanged." },
      { title: "Design the smallest useful system", description: "Nexus™ defines what should be automated, what must stay human-reviewed, where data belongs, and how failures should be handled." },
      { title: "Deploy and improve", description: "The system is tested against real scenarios, monitored for edge cases, and expanded only after the first workflow proves useful." },
    ],
    bestFor: ["Lead capture and qualification", "Document-heavy service operations", "CRM and follow-up workflows", "Internal knowledge retrieval", "Reporting and executive visibility"],
    faq: [
      { question: "What kind of AI automation do you build?", answer: "Projects may include intelligent intake, custom agents, document workflows, CRM routing, knowledge retrieval, reporting, reminders, and integrations. Scope begins with the operational problem, not with forcing a fashionable tool into the business." },
      { question: "Will AI make decisions without a person?", answer: "Not where the decision requires legal, financial, employment, safety, or other sensitive professional judgment. Human review gates and escalation rules are designed into the workflow according to risk." },
      { question: "Can you connect tools we already use?", answer: "Often, yes. Feasibility depends on the tool’s API, permissions, data policy, and the reliability of the intended integration. Those constraints are checked before promising the connection." },
    ],
  },
] as const satisfies readonly ServicePage[];

export function getServicePage(slug: string) {
  return servicePages.find((page) => page.slug === slug);
}
