import { NextResponse } from "next/server";

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
  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return NextResponse.json(
      {
        extractionId,
        recommendedModule,
        persisted: false,
        message: "Intake accepted in configuration mode. Connect Supabase to enable persistence.",
      },
      { status: 202 },
    );
  }

  const response = await fetch(`${supabaseUrl}/rest/v1/polar_intake_sessions`, {
    method: "POST",
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    },
    body: JSON.stringify({
      extraction_id: extractionId,
      status: "submitted",
      founder_name: payload.founderName,
      email: payload.email,
      phone: payload.phone,
      company_name: payload.companyName,
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
      submitted_at: new Date().toISOString(),
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    console.error("POLAR intake persistence failed", detail);
    return NextResponse.json({ error: "POLAR could not persist this intake." }, { status: 502 });
  }

  return NextResponse.json({ extractionId, recommendedModule, persisted: true }, { status: 201 });
}
