import { NextResponse } from "next/server";
import { runPolarAgentV2 } from "../../../../../lib/polar/agent-v2";

export async function GET() {
  if (process.env.VERCEL_ENV !== "preview") {
    return NextResponse.json({ error: "Not available." }, { status: 404 });
  }

  const result = await runPolarAgentV2(
    "Activation check. Identify yourself as P.O.L.A.R., summarize your role in one sentence, and state one action you are not authorized to perform without approval.",
    {
      extraction_id: "BPX-ACTIVATION-CHECK",
      status: "analyzed",
      founder_name: "Apex",
      company_name: "BI POLARIZE ENTERPRISES, INC.",
      thing: "P.O.L.A.R. production activation verification",
      audience: "Founder",
      problem: "Prove the AI agent runtime is operational end to end.",
      blocker: "No live model invocation has yet been verified.",
      desired_outcome: "Successful, bounded P.O.L.A.R. response through Vercel AI Gateway.",
      existing_assets: "Institutional memory, authority policy, runtime tools, Vercel deployment.",
      requested_help: "Activation verification only.",
      constraints: "No external side effects. No spending, publishing, permission changes, or binding actions.",
      additional_context: "This is a preview-only synthetic test session.",
      recommended_module: "POLAR CORE",
      routing_reason: "Runtime activation validation.",
      progress_percent: 100,
      clarity_score: 100,
      readiness_score: 100,
      contradiction_flags: [],
      risk_flags: [],
      blueprint_brief: {},
      analysis_snapshot: {},
      last_saved_at: new Date().toISOString(),
    },
  );

  return NextResponse.json({ ok: true, ...result }, { status: 200 });
}
