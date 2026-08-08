import "server-only";

import { createHash, randomBytes, timingSafeEqual } from "node:crypto";
import { getSupabaseConfig, supabaseRequest } from "./polar-memory";
import { founderPublicRpc } from "./polar-founder-public-db";

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

export function matchesFounderAccessKey(candidate: string) {
  const configured = process.env.POLAR_ACCESS_KEY?.trim();
  if (!configured || candidate.length < 32 || candidate.length > 256) return false;
  const candidateHash = Buffer.from(sha256(candidate), "hex");
  const configuredHash = Buffer.from(sha256(configured), "hex");
  return timingSafeEqual(candidateHash, configuredHash);
}

export async function exchangeFounderBootstrap(input: {
  bootstrapToken: string;
  userAgent?: string | null;
}) {
  const sessionToken = createOpaqueToken();
  const rows = await founderPublicRpc<Array<{ session_id: string; expires_at: string }>>(
    "polar_exchange_founder_bootstrap",
    {
      body: {
        p_credential_hash: hashOpaqueToken(input.bootstrapToken),
        p_session_hash: hashOpaqueToken(sessionToken),
        p_user_agent_hash: hashUserAgent(input.userAgent),
      },
    },
  );

  const row = rows?.[0];
  if (!row) return null;
  return { token: sessionToken, sessionId: row.session_id, expiresAt: row.expires_at };
}

export async function validateFounderSession(rawToken?: string | null) {
  if (!rawToken) return null;
  const rows = await founderPublicRpc<FounderSession[]>("polar_validate_founder_session", {
    body: { p_session_hash: hashOpaqueToken(rawToken) },
  });
  const session = rows?.[0] ?? null;
  if (!session || new Date(session.expires_at).getTime() <= Date.now()) return null;
  return session;
}

export async function revokeFounderSession(rawToken?: string | null) {
  if (!rawToken) return;
  await founderPublicRpc<boolean>("polar_revoke_founder_session", {
    body: { p_session_hash: hashOpaqueToken(rawToken) },
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
