import "server-only";
import { createHash, randomBytes } from "node:crypto";

export type SupabaseConfig = {
  url: string;
  serviceRoleKey: string;
};

export function getSupabaseConfig(): SupabaseConfig | null {
  const url = process.env.SUPABASE_URL?.trim();
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

  if (!url || !serviceRoleKey) return null;
  if (!url.startsWith("https://")) throw new Error("POLAR memory requires an HTTPS Supabase endpoint.");

  return { url: url.replace(/\/$/, ""), serviceRoleKey };
}

export function createRecoveryToken() {
  const token = randomBytes(32).toString("base64url");
  const hash = hashRecoveryToken(token);
  return { token, hash };
}

export function hashRecoveryToken(token: string) {
  return createHash("sha256").update(token, "utf8").digest("hex");
}

export function sha256(value: string | Buffer) {
  return createHash("sha256").update(value).digest("hex");
}

export async function supabaseRequest<T>(
  config: SupabaseConfig,
  path: string,
  init: RequestInit = {},
): Promise<T> {
  if (/^https?:\/\//i.test(path)) {
    throw new Error("POLAR memory paths must be relative.");
  }

  const timeoutSignal = AbortSignal.timeout(12_000);
  const response = await fetch(`${config.url}/rest/v1/${path.replace(/^\//, "")}`, {
    ...init,
    headers: {
      apikey: config.serviceRoleKey,
      Authorization: `Bearer ${config.serviceRoleKey}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
      ...(init.headers ?? {}),
    },
    cache: "no-store",
    signal: init.signal ?? timeoutSignal,
  });

  if (!response.ok) {
    // Never propagate Supabase response bodies into user-facing errors because
    // database diagnostics can disclose schema or policy details.
    console.error("POLAR memory request rejected", {
      status: response.status,
      path: path.split("?")[0],
    });
    throw new Error(`POLAR memory request failed (${response.status}).`);
  }

  if (response.status === 204) return undefined as T;

  const text = await response.text();
  if (!text) return undefined as T;
  return JSON.parse(text) as T;
}

export function normalizeEmail(value?: string) {
  const email = value?.trim().toLowerCase();
  return email || null;
}
