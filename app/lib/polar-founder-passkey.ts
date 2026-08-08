import "server-only";

import { createHash, createPublicKey, randomBytes, verify as verifySignature } from "node:crypto";
import { createOpaqueToken, hashOpaqueToken } from "./polar-founder-auth";
import { getSupabaseConfig, supabaseRequest } from "./polar-memory";

type ChallengeRow = { id: string; purpose: "register" | "authenticate"; founder_session_id: string | null; rp_id: string; expected_origin: string; expires_at: string };
type PasskeyRow = { id: string; credential_id: string; public_key_spki: string; sign_count: number; transports: string[] | null };

function b64url(value: Buffer | Uint8Array) { return Buffer.from(value).toString("base64url"); }
function fromB64url(value: string) { return Buffer.from(value, "base64url"); }
function sha256Buffer(value: string | Buffer) { return createHash("sha256").update(value).digest(); }
function sha256Hex(value: string) { return createHash("sha256").update(value, "utf8").digest("hex"); }

function normalizeRpId(value: string) {
  const raw = value.trim();
  if (!raw) throw new Error("WebAuthn RP ID is empty.");
  const hostname = raw.includes("://") ? new URL(raw).hostname : raw.split("/")[0].split(":")[0];
  const normalized = hostname.toLowerCase().replace(/^\.+|\.+$/g, "");
  if (!normalized || !/^(localhost|(?=.{1,253}$)(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)*[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)$/.test(normalized)) {
    throw new Error("WebAuthn RP ID must be a bare valid domain name.");
  }
  return normalized;
}

function normalizeOrigin(value: string) {
  const parsed = new URL(value.trim());
  if (parsed.protocol !== "https:" && !(parsed.protocol === "http:" && parsed.hostname === "localhost")) {
    throw new Error("WebAuthn origin must use HTTPS, except localhost development.");
  }
  return parsed.origin;
}

export function relyingParty(requestUrl: string) {
  const url = new URL(requestUrl);
  const rpId = normalizeRpId(process.env.POLAR_WEBAUTHN_RP_ID?.trim() || url.hostname);
  const origin = normalizeOrigin(process.env.POLAR_WEBAUTHN_ORIGIN?.trim() || url.origin);
  const originHost = new URL(origin).hostname.toLowerCase();
  if (originHost !== rpId && !originHost.endsWith(`.${rpId}`)) {
    throw new Error("WebAuthn RP ID is not valid for the configured origin.");
  }
  return { rpId, origin };
}

export async function createWebAuthnChallenge(input: { purpose: "register" | "authenticate"; founderSessionId?: string | null; rpId: string; origin: string }) {
  const config = getSupabaseConfig();
  if (!config) throw new Error("Passkey storage is not configured.");
  const challenge = b64url(randomBytes(32));
  await supabaseRequest(config, "polar_webauthn_challenges", { method: "POST", body: JSON.stringify({ challenge_hash: sha256Hex(challenge), purpose: input.purpose, founder_session_id: input.founderSessionId ?? null, rp_id: input.rpId, expected_origin: input.origin, expires_at: new Date(Date.now() + 5 * 60_000).toISOString() }) });
  return challenge;
}

export async function consumeWebAuthnChallenge(input: { purpose: "register" | "authenticate"; challenge: string }) {
  const config = getSupabaseConfig();
  if (!config) throw new Error("Passkey storage is not configured.");
  const query = new URLSearchParams({ challenge_hash: `eq.${sha256Hex(input.challenge)}`, purpose: `eq.${input.purpose}`, used_at: "is.null", select: "id,purpose,founder_session_id,rp_id,expected_origin,expires_at", limit: "1" });
  const rows = await supabaseRequest<ChallengeRow[]>(config, `polar_webauthn_challenges?${query}`);
  const row = rows[0];
  if (!row || new Date(row.expires_at).getTime() <= Date.now()) return null;
  await supabaseRequest(config, `polar_webauthn_challenges?id=eq.${row.id}`, { method: "PATCH", body: JSON.stringify({ used_at: new Date().toISOString() }) });
  return row;
}

export function validateClientData(input: { encoded: string; expectedType: "webauthn.create" | "webauthn.get"; expectedChallenge: string; expectedOrigin: string }) {
  const raw = fromB64url(input.encoded);
  const parsed = JSON.parse(raw.toString("utf8")) as { type?: string; challenge?: string; origin?: string; crossOrigin?: boolean };
  if (parsed.type !== input.expectedType || parsed.challenge !== input.expectedChallenge || parsed.origin !== input.expectedOrigin || parsed.crossOrigin === true) throw new Error("WebAuthn client data rejected.");
  return raw;
}

export function validateAuthenticatorData(encoded: string, rpId: string) {
  const data = fromB64url(encoded);
  if (data.length < 37) throw new Error("WebAuthn authenticator data rejected.");
  const expectedRp = sha256Buffer(rpId);
  if (!data.subarray(0, 32).equals(expectedRp)) throw new Error("WebAuthn relying party mismatch.");
  const flags = data[32];
  if ((flags & 0x01) === 0 || (flags & 0x04) === 0) throw new Error("WebAuthn user verification required.");
  const signCount = data.readUInt32BE(33);
  return { data, signCount, backupEligible: Boolean(flags & 0x08), backupState: Boolean(flags & 0x10) };
}

export async function listFounderPasskeys() {
  const config = getSupabaseConfig();
  if (!config) return [] as PasskeyRow[];
  return supabaseRequest<PasskeyRow[]>(config, "polar_founder_passkeys?revoked_at=is.null&select=id,credential_id,public_key_spki,sign_count,transports&order=created_at.desc");
}

export async function registerFounderPasskey(input: { credentialId: string; publicKeySpki: string; signCount: number; transports?: string[]; label?: string; backupEligible: boolean; backupState: boolean }) {
  const config = getSupabaseConfig();
  if (!config) throw new Error("Passkey storage is not configured.");
  const spki = fromB64url(input.publicKeySpki);
  createPublicKey({ key: spki, format: "der", type: "spki" });
  return supabaseRequest(config, "polar_founder_passkeys", { method: "POST", body: JSON.stringify({ credential_id: input.credentialId, public_key_spki: input.publicKeySpki, sign_count: input.signCount, transports: input.transports ?? [], device_label: input.label ?? null, backup_eligible: input.backupEligible, backup_state: input.backupState }) });
}

export async function verifyFounderAssertion(input: { credentialId: string; clientDataJSON: string; authenticatorData: string; signature: string; challengeRow: ChallengeRow; expectedChallenge: string }) {
  const config = getSupabaseConfig();
  if (!config) throw new Error("Passkey storage is not configured.");
  const query = new URLSearchParams({ credential_id: `eq.${input.credentialId}`, revoked_at: "is.null", select: "id,credential_id,public_key_spki,sign_count,transports", limit: "1" });
  const rows = await supabaseRequest<PasskeyRow[]>(config, `polar_founder_passkeys?${query}`);
  const passkey = rows[0];
  if (!passkey) return false;
  const clientData = validateClientData({ encoded: input.clientDataJSON, expectedType: "webauthn.get", expectedChallenge: input.expectedChallenge, expectedOrigin: input.challengeRow.expected_origin });
  const auth = validateAuthenticatorData(input.authenticatorData, input.challengeRow.rp_id);
  if ((auth.signCount !== 0 || passkey.sign_count !== 0) && auth.signCount <= passkey.sign_count) throw new Error("WebAuthn signature counter rejected.");
  const signed = Buffer.concat([auth.data, sha256Buffer(clientData)]);
  const publicKey = createPublicKey({ key: fromB64url(passkey.public_key_spki), format: "der", type: "spki" });
  const ok = verifySignature("sha256", signed, publicKey, fromB64url(input.signature));
  if (!ok) return false;
  await supabaseRequest(config, `polar_founder_passkeys?id=eq.${passkey.id}`, { method: "PATCH", body: JSON.stringify({ sign_count: auth.signCount, last_used_at: new Date().toISOString() }) });
  return true;
}

export async function issueFounderSession(userAgent?: string | null) {
  const config = getSupabaseConfig();
  if (!config) throw new Error("Founder session storage is not configured.");
  const token = createOpaqueToken();
  const expiresAt = new Date(Date.now() + 8 * 60 * 60_000).toISOString();
  const rows = await supabaseRequest<Array<{ id: string }>>(config, "polar_founder_sessions", { method: "POST", body: JSON.stringify({ session_hash: hashOpaqueToken(token), authority_profile: "founder", user_agent_hash: userAgent ? sha256Hex(userAgent) : null, expires_at: expiresAt }) });
  return { token, expiresAt, sessionId: rows[0]?.id ?? null };
}

export const issueFounderSessionFromPasskey = issueFounderSession;
