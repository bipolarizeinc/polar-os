import "server-only";

import { createHash, randomBytes } from "node:crypto";
import { getSupabaseConfig, supabaseRequest } from "./polar-memory";

export const FOUNDER_COOKIE = "polar_founder_session";

export type FounderSession = {
  id: string;
  authority_profile: string;
  expires_at: string;
  last_seen_at: string;
};

function sha256(value: string) {
  return createHash("sha256").update(value, "utf8").digest("hex");
}

export function createOpaqueToken() {
  return randomBytes(32).toString("base64url");
}

export function hashOpaqueToken(token: string) {
  return sha256(token);
}

export function hashUserAgent(value?: string | null) {
  return value ? sha256(value) : null;
}

export async function exchangeFounderBootstrap(input: {
  bootstrapToken: string;
  userAgent?: string | null;
}) {
  const config = getSupabaseConfig();
  if (!config) throw new Error("Founder authentication is not configured.");

  const sessionToken = createOpaqueToken();
  const rows = await supabaseRequest<Array<{ session_id: string; expires_at: string }>>(
    config,
    "rpc/polar_exchange_founder_bootstrap",
    {
      method: "POST",
      body: JSON.stringify({
        p_credential_hash: hashOpaqueToken(input.bootstrapToken),
        p_session_hash: hashOpaqueToken(sessionToken),
        p_user_agent_hash: hashUserAgent(input.userAgent),
      }),
    },
  );

  const row = rows?.[0];
  if (!row) return null;
  return { token: sessionToken, sessionId: row.session_id, expiresAt: row.expires_at };
}

export async function validateFounderSession(rawToken?: string | null) {
  if (!rawToken) return null;
  const config = getSupabaseConfig();
  if (!config) return null;

  const query = new URLSearchParams({
    session_hash: `eq.${hashOpaqueToken(rawToken)}`,
    revoked_at: "is.null",
    select: "id,authority_profile,expires_at,last_seen_at",
    limit: "1",
  });
  const rows = await supabaseRequest<FounderSession[]>(config, `polar_founder_sessions?${query}`);
  const session = rows[0] ?? null;
  if (!session || new Date(session.expires_at).getTime() <= Date.now()) return null;

  const updateQuery = new URLSearchParams({ id: `eq.${session.id}` });
  await supabaseRequest(config, `polar_founder_sessions?${updateQuery}`, {
    method: "PATCH",
    body: JSON.stringify({ last_seen_at: new Date().toISOString() }),
  });
  return session;
}

export async function revokeFounderSession(rawToken?: string | null) {
  if (!rawToken) return;
  const config = getSupabaseConfig();
  if (!config) return;
  const query = new URLSearchParams({ session_hash: `eq.${hashOpaqueToken(rawToken)}` });
  await supabaseRequest(config, `polar_founder_sessions?${query}`, {
    method: "PATCH",
    body: JSON.stringify({ revoked_at: new Date().toISOString() }),
  });
}

export async function createOAuthState(input: { provider: string; founderSessionId: string }) {
  const config = getSupabaseConfig();
  if (!config) throw new Error("OAuth state storage is not configured.");
  const state = createOpaqueToken();
  await supabaseRequest(config, "polar_oauth_states", {
    method: "POST",
    body: JSON.stringify({
      provider: input.provider,
      state_hash: hashOpaqueToken(state),
      founder_session_id: input.founderSessionId,
      expires_at: new Date(Date.now() + 10 * 60_000).toISOString(),
    }),
  });
  return state;
}

export async function consumeOAuthState(input: { provider: string; state: string }) {
  const config = getSupabaseConfig();
  if (!config) throw new Error("OAuth state storage is not configured.");
  const query = new URLSearchParams({
    provider: `eq.${input.provider}`,
    state_hash: `eq.${hashOpaqueToken(input.state)}`,
    used_at: "is.null",
    select: "id,founder_session_id,expires_at",
    limit: "1",
  });
  const rows = await supabaseRequest<Array<{ id: string; founder_session_id: string; expires_at: string }>>(
    config,
    `polar_oauth_states?${query}`,
  );
  const row = rows[0];
  if (!row || new Date(row.expires_at).getTime() <= Date.now()) return null;
  const updateQuery = new URLSearchParams({ id: `eq.${row.id}` });
  await supabaseRequest(config, `polar_oauth_states?${updateQuery}`, {
    method: "PATCH",
    body: JSON.stringify({ used_at: new Date().toISOString() }),
  });
  return row;
}
