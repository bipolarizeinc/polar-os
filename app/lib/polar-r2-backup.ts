import "server-only";

import { createCipheriv, createHash, createHmac, randomBytes } from "node:crypto";
import { appendAuditEvent } from "./polar-institutional-memory";
import { getSupabaseConfig, supabaseRequest } from "./polar-memory";

type R2Config = {
  endpoint: URL;
  accessKeyId: string;
  secretAccessKey: string;
  bucket: string;
  encryptionKey: Buffer;
  environment: string;
};

type BackupInput = {
  checkpointId: string;
  namespaceId: string;
  payload: unknown;
  createdBy?: string;
};

type EncryptedEnvelope = {
  version: 1;
  algorithm: "AES-256-GCM";
  createdAt: string;
  plaintextSha256: string;
  iv: string;
  authTag: string;
  ciphertext: string;
};

const EMPTY_SHA256 = createHash("sha256").update("").digest("hex");

function sha256(value: string | Buffer) {
  return createHash("sha256").update(value).digest("hex");
}

function hmac(key: Buffer | string, value: string) {
  return createHmac("sha256", key).update(value).digest();
}

function required(name: string) {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`Missing required P.O.L.A.R. backup configuration: ${name}.`);
  return value;
}

function parseEncryptionKey(raw: string) {
  if (!/^[0-9a-fA-F]{64}$/.test(raw.trim())) {
    throw new Error("POLAR_BACKUP_ENCRYPTION_KEY must be a 32-byte key encoded as 64 hex characters.");
  }
  return Buffer.from(raw.trim(), "hex");
}

function resolveR2Endpoint() {
  const configured = process.env.CLOUDFLARE_R2_ENDPOINT?.trim();
  const endpoint = configured
    ? new URL(configured)
    : new URL(`https://${required("CLOUDFLARE_ACCOUNT_ID")}.r2.cloudflarestorage.com`);

  if (endpoint.protocol !== "https:" || endpoint.username || endpoint.password || endpoint.search || endpoint.hash) {
    throw new Error("CLOUDFLARE_R2_ENDPOINT must be a credential-free HTTPS endpoint.");
  }
  endpoint.pathname = endpoint.pathname.replace(/\/$/, "");
  return endpoint;
}

export function getR2Config(): R2Config {
  return {
    endpoint: resolveR2Endpoint(),
    accessKeyId: required("CLOUDFLARE_R2_ACCESS_KEY_ID"),
    secretAccessKey: required("CLOUDFLARE_R2_SECRET_ACCESS_KEY"),
    bucket: required("CLOUDFLARE_R2_BUCKET"),
    encryptionKey: parseEncryptionKey(required("POLAR_BACKUP_ENCRYPTION_KEY")),
    environment: process.env.VERCEL_ENV?.trim() || process.env.NODE_ENV?.trim() || "production",
  };
}

function stableSerialize(value: unknown): string {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(stableSerialize).join(",")}]`;
  return `{${Object.entries(value as Record<string, unknown>)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, item]) => `${JSON.stringify(key)}:${stableSerialize(item)}`)
    .join(",")}}`;
}

function encryptPayload(payload: unknown, key: Buffer): EncryptedEnvelope {
  const plaintext = Buffer.from(stableSerialize(payload), "utf8");
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key, iv);
  const ciphertext = Buffer.concat([cipher.update(plaintext), cipher.final()]);
  return {
    version: 1,
    algorithm: "AES-256-GCM",
    createdAt: new Date().toISOString(),
    plaintextSha256: sha256(plaintext),
    iv: iv.toString("base64url"),
    authTag: cipher.getAuthTag().toString("base64url"),
    ciphertext: ciphertext.toString("base64url"),
  };
}

function encodePath(value: string) {
  return value
    .split("/")
    .map((segment) =>
      encodeURIComponent(segment).replace(/[!'()*]/g, (char) => `%${char.charCodeAt(0).toString(16).toUpperCase()}`),
    )
    .join("/");
}

function signingKey(secret: string, date: string) {
  const dateKey = hmac(`AWS4${secret}`, date);
  const regionKey = hmac(dateKey, "auto");
  const serviceKey = hmac(regionKey, "s3");
  return hmac(serviceKey, "aws4_request");
}

function amzDate(now = new Date()) {
  return now.toISOString().replace(/[:-]|\.\d{3}/g, "");
}

function createSignedHeaders(input: {
  config: R2Config;
  method: "PUT" | "HEAD";
  objectKey: string;
  payloadSha256: string;
  contentType?: string;
  metadataSha256?: string;
}) {
  const host = input.config.endpoint.host;
  const timestamp = amzDate();
  const date = timestamp.slice(0, 8);
  const basePath = input.config.endpoint.pathname.replace(/\/$/, "");
  const canonicalUri = `${basePath}/${encodePath(input.config.bucket)}/${encodePath(input.objectKey)}` || "/";

  const canonicalHeaders: Array<[string, string]> = [
    ["host", host],
    ["x-amz-content-sha256", input.payloadSha256],
    ["x-amz-date", timestamp],
  ];
  if (input.contentType) canonicalHeaders.push(["content-type", input.contentType]);
  if (input.metadataSha256) canonicalHeaders.push(["x-amz-meta-polar-sha256", input.metadataSha256]);
  canonicalHeaders.sort(([a], [b]) => a.localeCompare(b));

  const signedHeaders = canonicalHeaders.map(([name]) => name).join(";");
  const canonicalHeaderBlock = canonicalHeaders.map(([name, value]) => `${name}:${value.trim()}\n`).join("");
  const canonicalRequest = [
    input.method,
    canonicalUri,
    "",
    canonicalHeaderBlock,
    signedHeaders,
    input.payloadSha256,
  ].join("\n");

  const scope = `${date}/auto/s3/aws4_request`;
  const stringToSign = ["AWS4-HMAC-SHA256", timestamp, scope, sha256(canonicalRequest)].join("\n");
  const signature = createHmac("sha256", signingKey(input.config.secretAccessKey, date))
    .update(stringToSign)
    .digest("hex");

  const headers: Record<string, string> = {
    Host: host,
    "x-amz-content-sha256": input.payloadSha256,
    "x-amz-date": timestamp,
    Authorization: `AWS4-HMAC-SHA256 Credential=${input.config.accessKeyId}/${scope}, SignedHeaders=${signedHeaders}, Signature=${signature}`,
  };
  if (input.contentType) headers["Content-Type"] = input.contentType;
  if (input.metadataSha256) headers["x-amz-meta-polar-sha256"] = input.metadataSha256;

  return { url: `${input.config.endpoint.origin}${canonicalUri}`, headers };
}

function checkpointObjectKey(config: R2Config, namespaceId: string, checkpointId: string) {
  const now = new Date();
  const yyyy = String(now.getUTCFullYear());
  const mm = String(now.getUTCMonth() + 1).padStart(2, "0");
  const cleanNamespace = namespaceId.replace(/[^a-zA-Z0-9._-]/g, "_");
  const cleanCheckpoint = checkpointId.replace(/[^a-zA-Z0-9._-]/g, "_");
  return `polar-backups/${config.environment}/${cleanNamespace}/${yyyy}/${mm}/${cleanCheckpoint}/checkpoint.enc.json`;
}

async function putEncryptedObject(config: R2Config, objectKey: string, body: string, objectSha256: string) {
  const signed = createSignedHeaders({
    config,
    method: "PUT",
    objectKey,
    payloadSha256: sha256(body),
    contentType: "application/json",
    metadataSha256: objectSha256,
  });
  const response = await fetch(signed.url, {
    method: "PUT",
    headers: signed.headers,
    body,
    signal: AbortSignal.timeout(20_000),
  });
  if (!response.ok) {
    console.error("POLAR R2 upload rejected", { status: response.status, objectKey });
    throw new Error(`P.O.L.A.R. R2 backup upload failed (${response.status}).`);
  }
}

async function verifyEncryptedObject(config: R2Config, objectKey: string, expectedSha256: string) {
  const signed = createSignedHeaders({ config, method: "HEAD", objectKey, payloadSha256: EMPTY_SHA256 });
  const response = await fetch(signed.url, {
    method: "HEAD",
    headers: signed.headers,
    signal: AbortSignal.timeout(12_000),
  });
  if (!response.ok) {
    console.error("POLAR R2 verification rejected", { status: response.status, objectKey });
    throw new Error(`P.O.L.A.R. R2 backup verification failed (${response.status}).`);
  }
  const storedSha256 = response.headers.get("x-amz-meta-polar-sha256");
  if (!storedSha256 || storedSha256 !== expectedSha256) {
    throw new Error("P.O.L.A.R. R2 backup verification failed: integrity metadata mismatch.");
  }
}

async function markCheckpointProtected(input: {
  checkpointId: string;
  externalRef: string;
  objectSha256: string;
  actorKey: string;
}) {
  const supabase = getSupabaseConfig();
  if (!supabase) throw new Error("POLAR institutional memory is not configured.");
  const query = new URLSearchParams({ id: `eq.${input.checkpointId}` });
  const now = new Date().toISOString();
  await supabaseRequest(supabase, `polar_memory_checkpoints?${query}`, {
    method: "PATCH",
    body: JSON.stringify({
      status: "protected",
      external_backup_provider: "cloudflare-r2",
      external_backup_ref: input.externalRef,
      verified_at: now,
      protected_at: now,
    }),
  });
  await appendAuditEvent({
    actorType: "system",
    actorKey: input.actorKey,
    action: "memory.checkpoint.protected",
    outcome: "verified",
    details: {
      checkpointId: input.checkpointId,
      provider: "cloudflare-r2",
      externalRef: input.externalRef,
      objectSha256: input.objectSha256,
    },
  });
}

export async function backupCheckpointToR2(input: BackupInput) {
  const config = getR2Config();
  const envelope = encryptPayload(input.payload, config.encryptionKey);
  const body = JSON.stringify(envelope);
  const objectSha256 = sha256(body);
  const objectKey = checkpointObjectKey(config, input.namespaceId, input.checkpointId);

  await putEncryptedObject(config, objectKey, body, objectSha256);
  await verifyEncryptedObject(config, objectKey, objectSha256);
  await markCheckpointProtected({
    checkpointId: input.checkpointId,
    externalRef: `r2://${config.bucket}/${objectKey}`,
    objectSha256,
    actorKey: input.createdBy ?? "polar-backup-service",
  });

  return {
    provider: "cloudflare-r2" as const,
    objectKey,
    objectSha256,
    plaintextSha256: envelope.plaintextSha256,
    status: "protected" as const,
  };
}
