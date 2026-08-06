import { NextResponse } from "next/server";
import { getSupabaseConfig, hashRecoveryToken, supabaseRequest } from "../../../lib/polar-memory";

type RecoveryRequest = {
  extractionId?: string;
  recoveryToken?: string;
};

type IntakeRecord = {
  extraction_id: string;
  status: string;
  founder_name: string | null;
  company_name: string | null;
  thing: string;
  audience: string;
  problem: string;
  blocker: string;
  desired_outcome: string;
  existing_assets: string | null;
  requested_help: string | null;
  constraints: string | null;
  additional_context: string | null;
  recommended_module: string | null;
  routing_reason: string | null;
  progress_percent: number;
  clarity_score: number | null;
  readiness_score: number | null;
  contradiction_flags: string[] | null;
  risk_flags: string[] | null;
  blueprint_brief: Record<string, unknown> | null;
  analysis_snapshot: Record<string, unknown> | null;
  last_saved_at: string | null;
};

export async function POST(request: Request) {
  const config = getSupabaseConfig();
  if (!config) {
    return NextResponse.json({ error: "POLAR memory is not configured." }, { status: 503 });
  }

  const body = (await request.json()) as RecoveryRequest;
  const extractionId = body.extractionId?.trim().toUpperCase();
  const recoveryToken = body.recoveryToken?.trim();

  if (!extractionId || !recoveryToken) {
    return NextResponse.json({ error: "Extraction ID and recovery token are required." }, { status: 400 });
  }

  const tokenHash = hashRecoveryToken(recoveryToken);
  const query = new URLSearchParams({
    extraction_id: `eq.${extractionId}`,
    recovery_token_hash: `eq.${tokenHash}`,
    select: "extraction_id,status,founder_name,company_name,thing,audience,problem,blocker,desired_outcome,existing_assets,requested_help,constraints,additional_context,recommended_module,routing_reason,progress_percent,clarity_score,readiness_score,contradiction_flags,risk_flags,blueprint_brief,analysis_snapshot,last_saved_at",
    limit: "1",
  });

  try {
    const rows = await supabaseRequest<IntakeRecord[]>(config, `polar_intake_sessions?${query}`);
    const record = rows[0];
    if (!record) {
      return NextResponse.json({ error: "No matching POLAR extraction session was found." }, { status: 404 });
    }

    return NextResponse.json({ session: record }, { status: 200 });
  } catch (error) {
    console.error("POLAR recovery failed", error);
    return NextResponse.json({ error: "POLAR could not recover this session." }, { status: 502 });
  }
}
