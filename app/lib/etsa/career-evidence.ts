import { industries } from "./discovery";

type Industry = (typeof industries)[number];
type CareerEvidence = {
  workSample: string;
  lookFor: string;
  nextStep: string;
};

// Editorial practice ideas organized around occupational tasks, work context,
// and worker requirements. These examples are not ETSA items or scoring rubrics.
const guide = {
  "Construction & trades": {
    workSample: "From a fictional site plan, sketch a task sequence and list tools, materials, and reasons to stop work.",
    lookFor: "A realistic order, clear measurements and handoffs, and the ability to spot hazards and explain preventive steps.",
    nextStep: "Compare two local postings for the same trade. Check the apprenticeship, certification, or supervised experience each requires.",
  },
  "Automotive & field services": {
    workSample: "Use a fictional service ticket to draft a customer intake and a step-by-step diagnostic plan; mark what requires shop-level support.",
    lookFor: "Clear symptom questions, a sequence that rules out unlikely causes, practical escalation, and a plain-language explanation to the customer.",
    nextStep: "Compare a mobile-service and a shop posting. Ask a working technician how their testing, equipment, and safety expectations differ.",
  },
  "Healthcare & caregiving": {
    workSample: "Write a shift handoff from a fictional, nonclinical care scenario; use no real patient records.",
    lookFor: "Accurate observations, clear escalation boundaries, privacy awareness, and respectful communication across a handoff.",
    nextStep: "Choose one specific role and verify its credential, supervision, and training requirements with the hiring organization or relevant licensing body.",
  },
  "Manufacturing & logistics": {
    workSample: "Given fictional counts and deadlines, make a pick list or build sequence and flag what to do if inventory and records disagree.",
    lookFor: "Traceable quantities, clear exception handling, accuracy checks, and sensible priorities when time or materials are limited.",
    nextStep: "Compare postings for an inventory coordinator and a production operator. Note which equipment, measurement, and documentation skills each uses.",
  },
  "Retail & hospitality": {
    workSample: "Plan a mock rush shift with a missing team member and a customer issue; write the team handoff.",
    lookFor: "Fair task allocation, service recovery, attention to constraints, and clear priorities when requests conflict.",
    nextStep: "Ask a shift lead how their team measures a strong handoff, and compare that with the duties listed in a target posting.",
  },
  "Education & public service": {
    workSample: "Make a one-page plain-language guide explaining a made-up program or procedure to someone using it for the first time.",
    lookFor: "Accurate steps, accessible wording and structure, clear boundaries, and a way to check that the reader understood.",
    nextStep: "Choose a school, agency, or public-sector role; compare its public duties and application requirements with what the sample demonstrates.",
  },
  "Financial & professional services": {
    workSample: "Reconcile a fictional invoice ledger and write a short memo separating confirmed discrepancies from questions still open.",
    lookFor: "Traceable calculations, confidentiality awareness, accurate assumptions, and clear communication about uncertainty.",
    nextStep: "Identify two deliverables the target role owns. Check employers’ expectations for software, review authority, and any required credentials.",
  },
  "Technology & data": {
    workSample: "Using synthetic data, clean a small dataset and write a brief showing the result, reproducible steps, and known limitations.",
    lookFor: "Reproducibility, validation, clear tradeoffs, and the ability to explain results to someone who did not build the analysis.",
    nextStep: "Compare two postings for one target role and choose one repeatable task from them to add to a practice portfolio.",
  },
  "Media & design": {
    workSample: "Use a fictional client brief to design one small piece and explain how it changed after a round of feedback.",
    lookFor: "A clear audience and objective, relevant design choices, thoughtful revision, and documentation of your contribution.",
    nextStep: "Find a public portfolio from your target specialty and note how it shows process and decisions alongside finished work.",
  },
  "Nonprofit & community": {
    workSample: "Draft a one-page volunteer plan for a fictional community event, with a handoff and a realistic way to measure turnout.",
    lookFor: "Clarity about who the event serves, achievable staffing and activities, accessible outreach, and appropriate handling of participant information.",
    nextStep: "Read a local program’s public goals. Ask a coordinator which responsibilities and outcomes matter most in the role you’re considering.",
  },
  "Agriculture & energy": {
    workSample: "Build a mock field-visit or inspection log that records observations, handoffs, and decisions to pause and escalate.",
    lookFor: "Consistent records, attention to weather and site conditions, clear safety boundaries, and reliable communication across locations.",
    nextStep: "Compare one field operations posting and one monitoring or maintenance posting. Check the relevant safety, training, and equipment requirements.",
  },
  "Other / exploring": {
    workSample: "Pick two job postings and draft one small, fictional sample for a task they have in common.",
    lookFor: "A clear task, choices you can explain, an outcome the reader can inspect, and a note about what the sample does not prove.",
    nextStep: "Look up the two job titles in O*NET OnLine, then check current postings for the task and work conditions that matter to you.",
  },
} satisfies Record<Industry, CareerEvidence>;

export function getIndustryEvidence(industry: unknown): CareerEvidence | undefined {
  return typeof industry === "string" && Object.hasOwn(guide, industry) ? guide[industry as Industry] : undefined;
}
