import type { flagships } from "../brand-data";

type Slug = (typeof flagships)[number]["slug"];
type Landing = {
  promise: string;
  intro: string;
  fit: string;
  bring: string;
  scope: string;
  deliverables: readonly [string, string][];
  questions: readonly [string, string][];
  action: string;
  accent: string;
};

export const flagshipLanding = {
  extraction: {
    promise: "Get the idea out of your head.",
    intro: "Bring the voice notes, sketches, and half-built plans. In a guided working session, we separate the core idea from the noise and decide what is worth building first.",
    fit: "You have an idea you can talk about for an hour but can’t explain in a sentence. Or you have three possible directions and need to choose one.",
    bring: "Start with what you’re building, what’s blocking it, and how to reach you. An unfinished idea is enough.",
    scope: "Extraction is step one of the $499 Bipolarized Blueprint™. The short intake is free to submit; the working session is included with the Blueprint, not sold separately here.",
    deliverables: [
      ["A clear concept", "A plain-language description of what you’re building and why it matters."],
      ["An audience and problem", "Who it’s for and which problem you want to solve first."],
      ["A first decision", "What to test or build first, and which questions still need answers."],
    ],
    questions: [
      ["Do I need a business plan first?", "No. Bring what you know, including what you’re unsure about."],
      ["Does submitting the intake buy the session?", "No. The intake starts the conversation. The session is included when you purchase the Blueprint."],
    ],
    action: "Tell Us About Your Thing™",
    accent: "#64e7ff",
  },
  blueprint: {
    promise: "Know what to build, and in what order.",
    intro: "Turn a promising idea into a working plan. The Blueprint defines what you’re selling, who it’s for, how it can operate, and which decisions and builds come next.",
    fit: "You can see the opportunity but need to turn scattered tasks, offers, and assumptions into one plan you can act on.",
    bring: "Bring the concept, any current offer or assets, and the decisions you’re stuck on. We start with the included Idea Extraction Session™.",
    scope: "$499 includes Extraction and the Blueprint engagement. Buildout, filing fees, deployment, and funding applications are separately scoped.",
    deliverables: [
      ["Offer and positioning", "The customer, the problem, the offer, and how to communicate it."],
      ["Operating model", "The people, processes, and tools needed to deliver the offer."],
      ["Build sequence", "A prioritized roadmap with dependencies, decision points, and what to leave for later."],
    ],
    questions: [
      ["Is this a finished website or business launch?", "No. It’s the plan for what to build. Implementation and launch are separate engagements."],
      ["Can I see an example first?", "Yes. The sample Blueprint uses a fictional mobile repair business to show the level of detail."],
    ],
    action: "Review the $499 Blueprint",
    accent: "#91b4ff",
  },
  buildout: {
    promise: "Build the systems the Blueprint calls for.",
    intro: "Turn decisions into working assets. Buildout establishes the agreed documents, brand assets, digital surfaces, and workflows that your team needs to operate.",
    fit: "You know what the business needs to do, but delivery still relies on your memory, scattered files, or manual work nobody owns.",
    bring: "Share your Blueprint or current plan if you have one. Name the missing asset or workflow that is costing you the most time.",
    scope: "Buildout is separately scoped. The proposal names what gets built, what’s excluded, and which access or decisions are needed before work starts.",
    deliverables: [
      ["Operating documents", "Agreed procedures, templates, and handoffs your team can follow."],
      ["Customer-facing assets", "The brand, web, or intake assets named in the scope."],
      ["Repeatable workflows", "A clear owner and next step for recurring tasks, with automation where appropriate."],
    ],
    questions: [
      ["Is Buildout included in the Blueprint price?", "No. The Blueprint defines what to build. Buildout is quoted separately."],
      ["Can we start with one workflow?", "Yes. Tell us which workflow is breaking down and what a successful outcome would look like."],
    ],
    action: "Request a Buildout Scope",
    accent: "#f4a6d1",
  },
  "funding-readiness": {
    promise: "Make the numbers, story, and ask line up.",
    intro: "Prepare a funding case you can explain and support. We organize what’s already available, identify the evidence that’s missing, and clarify what the capital would be used for.",
    fit: "You’re considering capital and need to get your records, assumptions, and use-of-funds plan in order before deciding whether to apply.",
    bring: "Share the funding goal, what the money would do, and which records already exist. Don’t send account numbers or sensitive documents through the short intake.",
    scope: "Funding readiness is separately scoped. It is preparation, not a loan offer or financing guarantee. Approval and terms are determined by the funding provider.",
    deliverables: [
      ["Readiness checklist", "The records available now, the gaps to close, and who owns each item."],
      ["Funding narrative", "A clear description of the business, the funding need, and the assumptions behind the numbers."],
      ["Use-of-funds plan", "What the capital would pay for, in what order, and what results you intend to measure."],
    ],
    questions: [
      ["Does this guarantee funding?", "No. A complete package can make the case easier to assess; it does not guarantee approval or terms."],
      ["Do I need to be ready to apply now?", "No. The first step is to identify what’s ready and what still needs work."],
    ],
    action: "Discuss Funding Readiness",
    accent: "#ffcd87",
  },
  deployment: {
    promise: "Get the full customer path ready to go live.",
    intro: "Coordinate launch, validate the handoffs, and make sure somebody owns what happens next. A published URL is not the same thing as a working customer experience.",
    fit: "Your assets are built or nearly ready, and you need to connect the pieces and verify the path from first visit to the next operational step.",
    bring: "Share what’s launching, which assets are ready, and any hard dependencies. Don’t include passwords or access keys.",
    scope: "Deployment is separately scoped. The agreed plan defines the launch surfaces, checks, sign-off, and handoff. Timing depends on access and readiness.",
    deliverables: [
      ["Launch checklist", "The release steps, owners, and dependencies that need to be cleared."],
      ["Customer-path checks", "Verification of the agreed entry points, forms or checkout, and what happens after submission."],
      ["Post-launch handoff", "Who monitors the workflow, which signals to watch, and what to do if something fails."],
    ],
    questions: [
      ["Does Deployment include a rebuild?", "Not by default. New implementation work is identified and scoped separately."],
      ["Can you connect the assets I already have?", "Tell us what’s built and what it needs to connect to. We’ll identify what can be reused and where work is still needed."],
    ],
    action: "Request a Launch Scope",
    accent: "#bda8ff",
  },
} as const satisfies Record<Slug, Landing>;
