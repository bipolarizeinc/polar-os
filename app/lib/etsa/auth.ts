import "server-only";

const SUPABASE_URL = "https://ymdcypufespbrmvrfunt.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_fZEenW98U72YnfIFcHRWgA_ivFGEO16";

export type EtsaAuthSession = {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
  user: { id: string; email?: string };
};

async function authFetch<T>(path: string, init: RequestInit): Promise<T> {
  const response = await fetch(`${SUPABASE_URL}/auth/v1${path}`, {
    ...init,
    headers: {
      apikey: SUPABASE_PUBLISHABLE_KEY,
      "Content-Type": "application/json",
      ...(init.headers ?? {})
    },
    cache: "no-store",
    signal: AbortSignal.timeout(12_000)
  });

  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = (body as { msg?: string; error_description?: string; message?: string }).msg
      ?? (body as { error_description?: string }).error_description
      ?? (body as { message?: string }).message
      ?? "Authentication request failed.";
    throw new Error(message);
  }
  return body as T;
}

export function registerEtsaUser(email: string, password: string, fullName: string) {
  return authFetch<EtsaAuthSession>("/signup", {
    method: "POST",
    body: JSON.stringify({ email, password, data: { full_name: fullName } })
  });
}

export function loginEtsaUser(email: string, password: string) {
  return authFetch<EtsaAuthSession>("/token?grant_type=password", {
    method: "POST",
    body: JSON.stringify({ email, password })
  });
}

export function refreshEtsaSession(refreshToken: string) {
  return authFetch<EtsaAuthSession>("/token?grant_type=refresh_token", {
    method: "POST",
    body: JSON.stringify({ refresh_token: refreshToken })
  });
}

export function getEtsaUser(accessToken: string) {
  return authFetch<{ id: string; email?: string; user_metadata?: Record<string, unknown> }>("/user", {
    method: "GET",
    headers: { Authorization: `Bearer ${accessToken}` }
  });
}
