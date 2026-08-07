import "server-only";
import { getSupabaseConfig, hashRecoveryToken, supabaseRequest } from "./polar-memory";

export type PolarRecoveredSession = {
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

export async function recoverPolarSession(input: {
  extractionId?: string;
  recoveryToken?: string;
}) {
  const config = getSupabaseConfig();
  if (!config) throw new Error("POLAR memory is not configured.");

  const extractionId = input.extractionId?.trim().toUpperCase();
  const recoveryToken = input.recoveryToken?.trim();
  if (!extractionId || !recoveryToken) return null;

  const tokenHash = hashRecoveryToken(recoveryToken);
  const query = new URLSearchParams({
    extraction_id: `eq.${extractionId}`,
    recovery_token_hash: `eq.${tokenHash}`,
    select:
      "extraction_id,status,founder_name,company_name,thing,audience,problem,blocker,desired_outcome,existing_assets,requested_help,constraints,additional_context,recommended_module,routing_reason,progress_percent,clarity_score,readiness_score,contradiction_flags,risk_flags,blueprint_brief,analysis_snapshot,last_saved_at",
    limit: "1",
  });

  const rows = await supabaseRequest<PolarRecoveredSession[]>(
    config,
    `polar_intake_sessions?${query}`,
  );

  return rows[0] ?? null;
}
