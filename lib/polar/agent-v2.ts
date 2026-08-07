import "server-only";
import { Agent, run, tool } from "@openai/agents";
import { z } from "zod";
import { evaluatePolarPolicy, type PolarAction } from "../../app/lib/polar-policy";
import { researchWeb } from "./web-research";
import { analyzeIntake } from "./analyze-intake";
import type { PolarRecoveredSession } from "../../app/lib/polar-session";

const baselineAnalysis = tool({
  name: "polar_baseline_analysis",
  description:
    "Run POLAR's deterministic Blueprint intake analysis. Use it when making routing, readiness, contradiction, risk, or priority recommendations.",
  parameters: z.object({
    thing: z.string().optional(),
    audience: z.string().optional(),
    problem: z.string().optional(),
    blocker: z.string().optional(),
    desiredOutcome: z.string().optional(),
    existingAssets: z.string().optional(),
    requestedHelp: z.string().optional(),
    constraints: z.string().optional(),
    additionalContext: z.string().optional(),
  }),
  async execute(input) {
    return analyzeIntake(input);
  },
});

const webResearch = tool({
  name: "polar_web_research",
  description:
    "Search the live public internet for current or externally verifiable facts. Use when freshness matters or when evidence outside the recovered Blueprint session is required. Never place secrets or restricted client information in the query.",
  parameters: z.object({
    query: z.string().min(1).max(4000),
    context: z.string().max(2000).optional(),
  }),
  async execute(input) {
    return researchWeb(input.query, { context: input.context });
  },
});

const authorityCheck = tool({
  name: "polar_authority_check",
  description:
    "Check whether a proposed action is autonomous, approval-gated, or prohibited under the current POLAR authority model. Use before recommending or claiming any consequential external action.",
  parameters: z.object({
    action: z.enum([
      "read",
      "analyze",
      "draft",
      "recommend",
      "write-memory",
      "send-communication",
      "publish",
      "modify-record",
      "delete-record",
      "deploy-code",
      "change-permissions",
      "commit-funds",
      "bind-enterprise",
      "change-governance",
    ]),
  }),
  async execute(input) {
    // This tool evaluates P.O.L.A.R.'s baseline institutional role only. It does
    // not manufacture a human approval. Approval-gated actions therefore remain
    // blocked until an execution tool receives a separately verified approval.
    return evaluatePolarPolicy({
      principal: {
        principalType: "agent",
        principalKey: "polar-core",
        permissions: ["read", "write"],
        maxClassification: "confidential",
      },
      action: input.action as PolarAction,
      namespace: {
        namespaceId: "runtime-session",
        namespaceType: "session",
        classification: "internal",
      },
      explicitApproval: false,
    });
  },
});

export const polarAgentV2 = new Agent({
  name: "P.O.L.A.R.",
  model: "gpt-5.6",
  instructions: `
You are P.O.L.A.R., the operational intelligence layer for BI POLARIZE ENTERPRISES, INC.

Your role is to turn recovered founder/venture context into clear architecture, decisions, priorities, research, and executable next steps while preserving the founder's intent.

INSTITUTIONAL OPERATING RULES
- Treat the recovered Blueprint session as the current authorized working compartment.
- Do not infer access to another client, organization, project, or restricted namespace.
- Separate confirmed facts, external research, assumptions, contradictions, constraints, risks, decisions, and recommendations.
- Prefer concrete outcomes, dependencies, sequencing, owners, acceptance criteria, and next actions over motivational language.
- Use polar_baseline_analysis when the deterministic intake signals are relevant.
- Use polar_web_research when current public information is needed. Cite the returned sources in your answer and distinguish external evidence from internal truth.
- Never put recovery credentials, API keys, OAuth tokens, private keys, or restricted client data into web-search queries.
- Use polar_authority_check before any consequential side effect. Never treat approval as implied.
- Never claim that an email was sent, content was published, records changed, money committed, permissions changed, or code deployed unless a real execution tool in the current run performed it.
- P.O.L.A.R. may not independently commit funds, legally bind the enterprise, or change governance.
- Memory v2 writes are not available to this runtime until the institutional database migration is activated. Do not claim that new institutional memory was saved unless a memory tool actually confirms it.
- If evidence is missing, state what is unknown rather than inventing certainty.
- Keep work compatible with the BPEI division architecture: Blueprint™, Sav.VidzGen™, Dr.Docx™, BrandForge™, LaunchPad™, Nexus™, Pulse™, Vault™, and Cipher™.
`,
  tools: [baselineAnalysis, webResearch, authorityCheck],
});

function sessionToIntakeContext(session: PolarRecoveredSession) {
  return {
    thing: session.thing,
    audience: session.audience,
    problem: session.problem,
    blocker: session.blocker,
    desiredOutcome: session.desired_outcome,
    existingAssets: session.existing_assets ?? undefined,
    requestedHelp: session.requested_help ?? undefined,
    constraints: session.constraints ?? undefined,
    additionalContext: session.additional_context ?? undefined,
  };
}

export async function runPolarAgentV2(message: string, session: PolarRecoveredSession) {
  const cleanMessage = message.trim();
  if (!cleanMessage) throw new Error("POLAR requires a message.");
  if (cleanMessage.length > 12_000) throw new Error("POLAR message exceeds the runtime safety limit.");

  const authorizedContext = {
    extractionId: session.extraction_id,
    status: session.status,
    companyName: session.company_name,
    founderName: session.founder_name,
    recommendedModule: session.recommended_module,
    routingReason: session.routing_reason,
    clarityScore: session.clarity_score,
    readinessScore: session.readiness_score,
    contradictionFlags: session.contradiction_flags,
    riskFlags: session.risk_flags,
    intake: sessionToIntakeContext(session),
  };

  const result = await run(
    polarAgentV2,
    `${cleanMessage}\n\nAUTHORIZED RECOVERED BLUEPRINT SESSION:\n${JSON.stringify(authorizedContext, null, 2)}`,
    { maxTurns: 10 },
  );

  return {
    output: result.finalOutput,
    agent: result.lastAgent?.name ?? polarAgentV2.name,
  };
}
