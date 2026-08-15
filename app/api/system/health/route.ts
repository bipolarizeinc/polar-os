import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function configured(name: string) {
  return Boolean(process.env[name]?.trim());
}

export async function GET(request: NextRequest) {
  const expected = process.env.POLAR_ACCESS_KEY?.trim();
  const supplied = request.headers.get("x-polar-access-key")?.trim();

  if (!expected || !supplied || supplied !== expected) {
    return NextResponse.json(
      { status: "UNAUTHORIZED" },
      { status: 401, headers: { "Cache-Control": "no-store" } },
    );
  }

  const checks = {
    persistence: configured("SUPABASE_URL") && configured("SUPABASE_SERVICE_ROLE_KEY"),
    founderSecurity: configured("POLAR_WEBAUTHN_RP_ID") && configured("POLAR_WEBAUTHN_ORIGIN"),
    connectorVault: configured("POLAR_CONNECTION_ENCRYPTION_KEY"),
    payments: configured("STRIPE_SECRET_KEY") && configured("STRIPE_WEBHOOK_SECRET"),
    etsaPayments: configured("ETSA_REASSESSMENT_PAYMENT_URL"),
    automation: configured("MAKE_API_BASE_URL") && configured("MAKE_API_TOKEN"),
    skipAgent: configured("SKIP_AGENT_ID"),
    corporateMail: configured("ZOHO_CLIENT_ID") && configured("ZOHO_CLIENT_SECRET"),
    aiResearch: configured("OPENAI_API_KEY"),
  };

  const configuredCount = Object.values(checks).filter(Boolean).length;
  const total = Object.keys(checks).length;

  return NextResponse.json(
    {
      system: "POLAR OS",
      status: checks.persistence && checks.founderSecurity ? "OPERATIONAL" : "PARTIAL",
      configured: configuredCount,
      total,
      checks,
      routes: {
        publicSite: "/",
        services: "/services",
        intake: "/intake",
        etsa: "/etsa",
        founder: "/founder",
        commandCenter: "/command-center",
      },
      checkedAt: new Date().toISOString(),
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
