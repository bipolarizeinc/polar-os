import "server-only";

import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";
import { getSupabaseConfig, supabaseRequest } from "./polar-memory";

type StoredCredential = {
  id: string;
  provider: string;
  principal_key: string;
  credential_type: string;
  ciphertext: string;
  iv: string;
  auth_tag: string;
  key_version: string;
  metadata: Record<string, unknown>;
  expires_at: string | null;
  revoked_at: string | null;
};

function encryptionKey() {
  const raw = process.env.POLAR_CONNECTION_ENCRYPTION_KEY?.trim();
  if (!raw || !/^[0-9a-fA-F]{64}$/.test(raw)) {
    throw new Error("POLAR_CONNECTION_ENCRYPTION_KEY must be a 32-byte key encoded as 64 hex characters.");
  }
  return Buffer.from(raw, "hex");
}

function encrypt(secret: string) {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", encryptionKey(), iv);
  const ciphertext = Buffer.concat([cipher.update(secret, "utf8"), cipher.final()]);
  return {
    ciphertext: ciphertext.toString("base64url"),
    iv: iv.toString("base64url"),
    authTag: cipher.getAuthTag().toString("base64url"),
  };
}

function decrypt(row: StoredCredential) {
  const decipher = createDecipheriv(
    "aes-256-gcm",
    encryptionKey(),
    Buffer.from(row.iv, "base64url"),
  );
  decipher.setAuthTag(Buffer.from(row.auth_tag, "base64url"));
  return Buffer.concat([
    decipher.update(Buffer.from(row.ciphertext, "base64url")),
    decipher.final(),
  ]).toString("utf8");
}

export async function storeConnectionCredential(input: {
  provider: string;
  principalKey: string;
  credentialType?: string;
  secret: string;
  metadata?: Record<string, unknown>;
  expiresAt?: string | null;
}) {
  const supabase = getSupabaseConfig();
  if (!supabase) throw new Error("P.O.L.A.R. credential storage is not configured.");

  const encrypted = encrypt(input.secret);
  const credentialType = input.credentialType ?? "oauth_refresh_token";
  const query = new URLSearchParams({
    on_conflict: "provider,principal_key,credential_type",
  });

  const rows = await supabaseRequest<StoredCredential[]>(
    supabase,
    `polar_connection_credentials?${query}`,
    {
      method: "POST",
      headers: { Prefer: "resolution=merge-duplicates,return=representation" },
      body: JSON.stringify({
        provider: input.provider,
        principal_key: input.principalKey,
        credential_type: credentialType,
        ciphertext: encrypted.ciphertext,
        iv: encrypted.iv,
        auth_tag: encrypted.authTag,
        key_version: "v1",
        metadata: input.metadata ?? {},
        expires_at: input.expiresAt ?? null,
        revoked_at: null,
      }),
    },
  );

  const row = rows?.[0];
  if (!row) throw new Error("P.O.L.A.R. credential vault did not return a stored record.");
  return { id: row.id, provider: row.provider, principalKey: row.principal_key };
}

export async function readConnectionCredential(input: {
  provider: string;
  principalKey: string;
  credentialType?: string;
}) {
  const supabase = getSupabaseConfig();
  if (!supabase) throw new Error("P.O.L.A.R. credential storage is not configured.");
  const params = new URLSearchParams({
    provider: `eq.${input.provider}`,
    principal_key: `eq.${input.principalKey}`,
    credential_type: `eq.${input.credentialType ?? "oauth_refresh_token"}`,
    revoked_at: "is.null",
    select: "id,provider,principal_key,credential_type,ciphertext,iv,auth_tag,key_version,metadata,expires_at,revoked_at",
    limit: "1",
  });
  const rows = await supabaseRequest<StoredCredential[]>(
    supabase,
    `polar_connection_credentials?${params}`,
    { method: "GET" },
  );
  const row = rows?.[0];
  if (!row) return null;
  return {
    id: row.id,
    secret: decrypt(row),
    metadata: row.metadata ?? {},
    expiresAt: row.expires_at,
  };
}
