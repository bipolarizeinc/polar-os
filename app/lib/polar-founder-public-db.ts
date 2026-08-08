import "server-only";

const SUPABASE_URL = "https://ymdcypufespbrmvrfunt.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_fZEenW98U72YnfIFcHRWgA_ivFGEO16";

const ALLOWED_RPCS = new Set([
  "polar_exchange_founder_bootstrap",
  "polar_validate_founder_session",
  "polar_revoke_founder_session",
  "polar_founder_security_status",
  "polar_founder_revoke_passkey",
  "polar_founder_rename_passkey",
  "polar_founder_revoke_all_sessions",
]);

type RpcInit = {
  body: Record<string, unknown>;
};

export async function founderPublicRpc<T>(name: string, init: RpcInit): Promise<T> {
  if (!ALLOWED_RPCS.has(name)) {
    throw new Error("Founder public RPC is not allowlisted.");
  }

  const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/${name}`, {
    method: "POST",
    headers: {
      apikey: SUPABASE_PUBLISHABLE_KEY,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    },
    body: JSON.stringify(init.body),
    cache: "no-store",
    signal: AbortSignal.timeout(12_000),
  });

  if (!response.ok) {
    console.error("Founder public RPC rejected", { status: response.status, name });
    throw new Error(`Founder authentication request failed (${response.status}).`);
  }

  const text = await response.text();
  if (!text) return undefined as T;
  return JSON.parse(text) as T;
}
