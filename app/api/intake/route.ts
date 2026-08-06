import { NextResponse } from "next/server";
import { createRecoveryToken, getSupabaseConfig, normalizeEmail, supabaseRequest } from "../../lib/polar-memory";

const requiredFields = ["thing", "audience", "problem", "blocker", "desiredOutcome"] as const;

type IntakePayload = {
  founderName?: string;
  email?: string;
  phone?: string;
  companyName?: string;
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

function createExtractionId() {
  const stamp = new Date().toISOString().slice(0, 10).replaceAll("-", "");
  const suffix = crypto.randomUUID().slice(0, 8).toUpperCase();
  return `BPX-${stamp}-${suffix}`;
}

function recommendModule(payload: IntakePayload) {
  const text = Object.values(payload).join(" ").toLowerCase();
  const routes = [
    ["Cipher™", ["security", "cyber", "privacy", "identity", "compliance"]],
    ["Vault™", ["archive", "knowledge", "records", "memory", "documents"]],
    ["Pulse™", ["analytics", "dashboard", "forecast", "kpi", "metrics"]],
    ["Nexus™", ["automation", "agent", "api", "crm", "integration", "software"]],
    ["LaunchPad™", ["formation", "register", "ein", "banking", "compliance", "launch"]],
    ["BrandForge™", ["brand", "logo", "identity", "marketing", "campaign"]],
    ["Sav.VidzGen™", ["video", "commercial", "reel", "podcast", "animation"]],
    ["Dr.Docx™", ["sop", "policy", "agreement", "manual", "proposal", "document"]],
  ] as const;

  return routes.find(([, terms]) => terms.some((term) => text.includes(term)))?.[0] ?? "Blueprint™";
}

export async function POST(request: Request) {
  const payload = (await request.json()) as IntakePayload;
  const missing = requiredFields.filter((field) => !payload[field]?.trim());

  if (missing.length) {
    return NextResponse.json({ error: "Missing required intake fields.", fields: missing }, { status: 400 });
  }

  const extractionId = createExtractionId();
  const recommendedModule = recommendModule(payload);
  const recovery = createRecoveryToken();
  const config = getSupabaseConfig();

  if (!config) {
    return NextResponse.json(
      {
        extractionId,
        recommendedModule,
        persisted: false,
        message: "Intake accepted in configuration mode. Connect Supabase to enable persistence and recovery.",
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
        status: "submitted",
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
        recommended_module: recommendedModule,
        routing_reason: `Keyword and context routing selected ${recommendedModule}.`,
        recovery_token_hash: recovery.hash,
        progress_percent: 100,
        last_saved_at: new Date().toISOString(),
        submitted_at: new Date().toISOString(),
        memory_state: { phase: "intake", version: 1 },
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
      recommendedModule,
      persisted: true,
    },
    { status: 201 },
  );
}
