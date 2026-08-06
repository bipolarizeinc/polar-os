import { NextResponse } from "next/server";
import { analyzeIntake, type IntakeAnalysisInput } from "../../../lib/polar/analyze-intake";
import { createRecoveryToken, getSupabaseConfig, normalizeEmail, supabaseRequest } from "../../lib/polar-memory";

const requiredFields = ["thing", "audience", "problem", "blocker", "desiredOutcome"] as const;

type IntakePayload = IntakeAnalysisInput & {
  founderName?: string;
  email?: string;
  phone?: string;
  companyName?: string;
};

function createExtractionId() {
  const stamp = new Date().toISOString().slice(0, 10).replaceAll("-", "");
  const suffix = crypto.randomUUID().slice(0, 8).toUpperCase();
  return `BPX-${stamp}-${suffix}`;
}

export async function POST(request: Request) {
  const payload = (await request.json()) as IntakePayload;
  const missing = requiredFields.filter((field) => !payload[field]?.trim());

  if (missing.length) {
    return NextResponse.json({ error: "Missing required intake fields.", fields: missing }, { status: 400 });
  }

  const extractionId = createExtractionId();
  const analysis = analyzeIntake(payload);
  const recovery = createRecoveryToken();
  const config = getSupabaseConfig();

  if (!config) {
    return NextResponse.json(
      {
        extractionId,
        analysis,
        recommendedModule: analysis.recommendedModule,
        persisted: false,
        message: "Intake analyzed in configuration mode. Connect Supabase to enable persistence and recovery.",
      },
      { status: 202 },
    );
  }

  try {
    await supabaseRequest(config, "polar_intake_sessions", {
      method: "POST",
      headers: { Prefer: "return=minimal" },
      body: JSON.stringify({
        extraction_id: extractionId,
        status: "analyzed",
        founder_name: payload.founderName?.trim() || null,
        email: normalizeEmail(payload.email),
        phone: payload.phone?.trim() || null,
        company_name: payload.companyName?.trim() || null,
        thing: payload.thing,
        audience: payload.audience,
        problem: payload.problem,
        blocker: payload.blocker,
        desired_outcome: payload.desiredOutcome,
        existing_assets: payload.existingAssets,
        requested_help: payload.requestedHelp,
        constraints: payload.constraints,
        additional_context: payload.additionalContext,
        recommended_module: analysis.recommendedModule,
        routing_reason: analysis.routingRationale,
        recovery_token_hash: recovery.hash,
        progress_percent: 100,
        last_saved_at: new Date().toISOString(),
        submitted_at: new Date().toISOString(),
        memory_state: { phase: "analysis", version: 2 },
        analysis_snapshot: analysis,
        clarity_score: analysis.clarityScore,
        readiness_score: analysis.readinessScore,
        contradiction_flags: analysis.contradictionFlags,
        risk_flags: analysis.risks,
        blueprint_brief: analysis.blueprintBrief,
      }),
    });
  } catch (error) {
    console.error("POLAR intake persistence failed", error);
    return NextResponse.json({ error: "POLAR could not persist this intake." }, { status: 502 });
  }

  return NextResponse.json(
    {
      extractionId,
      recoveryToken: recovery.token,
      recommendedModule: analysis.recommendedModule,
      analysis,
      persisted: true,
    },
    { status: 201 },
  );
}
