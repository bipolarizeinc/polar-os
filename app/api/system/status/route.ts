import { NextResponse } from "next/server";

const requiredMigrations = [
  "20260805_polar_intake_foundation.sql",
  "20260805_polar_memory_layer.sql",
  "20260805_polar_intelligence_layer.sql",
] as const;

export async function GET() {
  const supabaseUrlConfigured = Boolean(process.env.SUPABASE_URL?.trim());
  const serviceRoleConfigured = Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY?.trim());
  const memoryConfigured = supabaseUrlConfigured && serviceRoleConfigured;

  return NextResponse.json(
    {
      system: "POLAR OS",
      status: memoryConfigured ? "MEMORY_CONFIGURED" : "CONFIGURATION_REQUIRED",
      deployment: "ACTIVE",
      memory: {
        configured: memoryConfigured,
        supabaseUrlConfigured,
        serviceRoleConfigured,
      },
      requiredMigrations,
      routes: {
        intake: "/intake",
        commandCenter: "/command-center",
        recovery: "/api/intake/recover",
      },
      checkedAt: new Date().toISOString(),
    },
    {
      status: memoryConfigured ? 200 : 503,
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}
