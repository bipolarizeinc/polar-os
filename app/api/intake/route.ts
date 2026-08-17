import { NextResponse } from "next/server";
import { z } from "zod";
import { analyzeIntake, type IntakeAnalysisInput } from "../../../lib/polar/analyze-intake";
import { createRecoveryToken, getSupabaseConfig, normalizeEmail, supabaseRequest } from "../../lib/polar-memory";

const requiredText = z.string().trim().min(1).max(5_000);
const optionalText = z.string().trim().max(5_000).optional();

const intakeSchema = z.object({
  thing: requiredText,
  audience: requiredText,
  problem: requiredText,
  blocker: requiredText,
  desiredOutcome: requiredText,
  existingAssets: optionalText,
  requestedHelp: optionalText,
  constraints: optionalText,
  additionalContext: optionalText,
  founderName: z.string().trim().max(200).optional(),
  email: z.union([z.literal(""), z.email().max(320)]).optional(),
  phone: z.string().trim().max(50).optional(),
  companyName: z.string().trim().max(200).optional(),
  requestedDivision: z.string().trim().max(100).optional(),
  requestedService: z.string().trim().max(200).optional(),
  referralSource: z.string().trim().max(200).optional(),
});

type IntakePayload = IntakeAnalysisInput & {
  founderName?: string;
  email?: string;
  phone?: string;
  companyName?: string;
  requestedDivision?: string;
  requestedService?: string;
  referralSource?: string;
};

function createExtractionId() {
  const stamp = new Date().toISOString().slice(0, 10).replaceAll("-", "");
  const suffix = crypto.randomUUID().slice(0, 8).toUpperCase();
  return `BPX-${stamp}-${suffix}`;
}

export async function POST(request: Request) {
  let input: unknown;
  try {
    input = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload." }, { status: 400 });
  }

  const parsed = intakeSchema.safeParse(input);
  if (!parsed.success) {
    const fields = [...new Set(parsed.error.issues.map((issue) => String(issue.path[0] ?? "request")))];
    return NextResponse.json({ error: "Invalid or missing intake fields.", fields }, { status: 400 });
  }

  const payload: IntakePayload = parsed.data;

  const routingContext = {
    division: payload.requestedDivision?.trim() || null,
    service: payload.requestedService?.trim() || null,
    source: payload.referralSource?.trim() || null,
  };
  const routingNote = [
    routingContext.division ? `Requested division: ${routingContext.division}.` : "",
    routingContext.service ? `Requested service/capability: ${routingContext.service}.` : "",
  ].filter(Boolean).join(" ");
  const analysisPayload: IntakeAnalysisInput = {
    ...payload,
    requestedHelp: [payload.requestedHelp?.trim(), routingNote].filter(Boolean).join("\n\n"),
  };

  const extractionId = createExtractionId();
  const analysis = analyzeIntake(analysisPayload);
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
        requested_help: analysisPayload.requestedHelp,
        constraints: payload.constraints,
        additional_context: payload.additionalContext,
        recommended_module: analysis.recommendedModule,
        routing_reason: analysis.routingRationale,
        recovery_token_hash: recovery.hash,
        progress_percent: 100,
        last_saved_at: new Date().toISOString(),
        submitted_at: new Date().toISOString(),
        memory_state: { phase: "analysis", version: 3, routingContext },
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
