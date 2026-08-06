export type IntakeAnalysisInput = {
  thing?: string;
  audience?: string;
  problem?: string;
  blocker?: string;
  desiredOutcome?: string;
  existingAssets?: string;
  requestedHelp?: string;
  constraints?: string;
  additionalContext?: string;
};

export type PolarAnalysis = {
  recommendedModule: string;
  routingRationale: string;
  clarityScore: number;
  readinessScore: number;
  contradictionFlags: string[];
  risks: string[];
  priorities: string[];
  blueprintBrief: {
    concept: string;
    audience: string;
    problem: string;
    outcome: string;
    immediateNextStep: string;
  };
};

const moduleRoutes = [
  ["Cipher™", ["security", "cyber", "privacy", "identity", "breach", "compliance"]],
  ["Vault™", ["archive", "knowledge", "records", "memory", "repository", "documents"]],
  ["Pulse™", ["analytics", "dashboard", "forecast", "kpi", "metrics", "reporting"]],
  ["Nexus™", ["automation", "agent", "api", "crm", "integration", "software", "workflow"]],
  ["LaunchPad™", ["formation", "register", "ein", "banking", "compliance", "launch", "startup"]],
  ["BrandForge™", ["brand", "logo", "identity", "marketing", "campaign", "positioning"]],
  ["Sav.VidzGen™", ["video", "commercial", "reel", "podcast", "animation", "media"]],
  ["Dr.Docx™", ["sop", "policy", "agreement", "manual", "proposal", "document", "contract"]],
] as const;

function normalized(input: IntakeAnalysisInput) {
  return Object.values(input).filter(Boolean).join(" ").toLowerCase();
}

function sentence(value: string | undefined, fallback: string) {
  const clean = value?.trim();
  if (!clean) return fallback;
  return clean.length > 220 ? `${clean.slice(0, 217)}...` : clean;
}

export function analyzeIntake(input: IntakeAnalysisInput): PolarAnalysis {
  const text = normalized(input);
  const matched = moduleRoutes
    .map(([module, terms]) => ({ module, hits: terms.filter((term) => text.includes(term)) }))
    .sort((a, b) => b.hits.length - a.hits.length)[0];

  const recommendedModule = matched?.hits.length ? matched.module : "Blueprint™";
  const routingRationale = matched?.hits.length
    ? `POLAR detected ${matched.hits.slice(0, 4).join(", ")} as the strongest operational signals.`
    : "The intake spans multiple systems, so Blueprint™ should establish the architecture before specialist modules are assigned.";

  const required = [input.thing, input.audience, input.problem, input.blocker, input.desiredOutcome];
  const detailPoints = required.reduce((score, value) => score + Math.min((value?.trim().length ?? 0) / 80, 1), 0);
  const clarityScore = Math.round((detailPoints / required.length) * 100);

  const assetSignals = input.existingAssets?.trim().length ? 20 : 0;
  const constraintSignals = input.constraints?.trim().length ? 15 : 0;
  const helpSignals = input.requestedHelp?.trim().length ? 15 : 0;
  const readinessScore = Math.min(100, Math.round(clarityScore * 0.5 + assetSignals + constraintSignals + helpSignals));

  const contradictionFlags: string[] = [];
  if (/everyone|anyone|everybody/.test(input.audience?.toLowerCase() ?? "")) contradictionFlags.push("Audience is described too broadly to support precise positioning.");
  if (/immediately|asap|right now/.test(input.desiredOutcome?.toLowerCase() ?? "") && /no budget|zero budget|free/.test(input.constraints?.toLowerCase() ?? "")) contradictionFlags.push("Urgent delivery is paired with little or no stated budget.");
  if (/scale|national|global|millions/.test(input.desiredOutcome?.toLowerCase() ?? "") && !input.existingAssets?.trim()) contradictionFlags.push("Large-scale outcome is stated without existing assets or infrastructure.");
  if ((input.problem?.trim().length ?? 0) < 45) contradictionFlags.push("The problem definition is too thin for reliable solution architecture.");

  const risks: string[] = [];
  if (!input.existingAssets?.trim()) risks.push("No existing assets or prior work were identified.");
  if (!input.constraints?.trim()) risks.push("Timeline, budget, and non-negotiable constraints remain undefined.");
  if (clarityScore < 55) risks.push("Core concept clarity is below POLAR's architecture threshold.");
  if (contradictionFlags.length) risks.push("Unresolved contradictions may distort scope, pricing, or delivery order.");

  const priorities = [
    contradictionFlags.length ? "Resolve the flagged contradictions before committing resources." : "Preserve the current concept language as the founder-source record.",
    clarityScore < 70 ? "Tighten audience, problem, and desired outcome definitions." : "Convert the defined outcome into measurable acceptance criteria.",
    `Open ${recommendedModule} as the first specialist workstream.`,
  ];

  return {
    recommendedModule,
    routingRationale,
    clarityScore,
    readinessScore,
    contradictionFlags,
    risks,
    priorities,
    blueprintBrief: {
      concept: sentence(input.thing, "Concept requires further extraction."),
      audience: sentence(input.audience, "Audience requires definition."),
      problem: sentence(input.problem, "Problem requires definition."),
      outcome: sentence(input.desiredOutcome, "Outcome requires definition."),
      immediateNextStep: priorities[0],
    },
  };
}
