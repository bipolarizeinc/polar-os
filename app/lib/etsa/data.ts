import "server-only";

const SUPABASE_URL = "https://ymdcypufespbrmvrfunt.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_fZEenW98U72YnfIFcHRWgA_ivFGEO16";

export async function etsaRest<T>(path: string, accessToken: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: SUPABASE_PUBLISHABLE_KEY,
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
      ...(init.headers ?? {})
    },
    cache: "no-store",
    signal: AbortSignal.timeout(12_000)
  });

  const text = await response.text();
  const body = text ? JSON.parse(text) : null;
  if (!response.ok) {
    const message = body?.message ?? body?.hint ?? body?.details ?? `ETSA data request failed (${response.status}).`;
    throw new Error(message);
  }
  return body as T;
}

export async function ensureEtsaProfile(accessToken: string, userId: string, fullName: string) {
  return etsaRest("etsa_profiles?on_conflict=user_id", accessToken, {
    method: "POST",
    headers: { Prefer: "resolution=merge-duplicates,return=representation" },
    body: JSON.stringify({ user_id: userId, full_name: fullName })
  });
}
