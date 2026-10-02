import "server-only";
import { getSupabaseConfig, supabaseRequest } from "../polar-memory";

export type EtsaEntitlement = {
  id: string;
  user_id: string;
  assessment_id: string;
  status: "paid" | "refunded" | "disputed" | "revoked";
  checkout_session_id: string;
  payment_intent_id: string | null;
};

export async function getPaidEtsaEntitlement(userId: string, assessmentId: string) {
  const config = getSupabaseConfig();
  if (!config) throw new Error("Entitlement storage is not configured.");
  const query = new URLSearchParams({
    user_id: `eq.${userId}`,
    assessment_id: `eq.${assessmentId}`,
    status: "eq.paid",
    select: "id,user_id,assessment_id,status,checkout_session_id,payment_intent_id",
    limit: "1"
  });
  const rows = await supabaseRequest<EtsaEntitlement[]>(config, `etsa_reassessment_entitlements?${query}`);
  return rows[0] ?? null;
}

export async function grantEtsaEntitlement(input: {
  userId: string;
  assessmentId: string;
  checkoutSessionId: string;
  paymentIntentId: string | null;
  amountTotal: number | null;
  currency: string | null;
}) {
  const config = getSupabaseConfig();
  if (!config) throw new Error("Entitlement storage is not configured.");
  return supabaseRequest(config, "etsa_reassessment_entitlements?on_conflict=user_id,assessment_id", {
    method: "POST",
    headers: { Prefer: "resolution=merge-duplicates,return=minimal" },
    body: JSON.stringify({
      user_id: input.userId,
      assessment_id: input.assessmentId,
      checkout_session_id: input.checkoutSessionId,
      payment_intent_id: input.paymentIntentId,
      amount_total: input.amountTotal,
      currency: input.currency,
      status: "paid",
      unlocked_at: new Date().toISOString()
    })
  });
}

export async function revokeEtsaEntitlement(paymentIntentId: string, status: "refunded" | "disputed") {
  const config = getSupabaseConfig();
  if (!config) throw new Error("Entitlement storage is not configured.");
  const query = new URLSearchParams({ payment_intent_id: `eq.${paymentIntentId}` });
  return supabaseRequest(config, `etsa_reassessment_entitlements?${query}`, {
    method: "PATCH",
    headers: { Prefer: "return=minimal" },
    body: JSON.stringify({ status })
  });
}
