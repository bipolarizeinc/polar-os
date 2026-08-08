import "server-only";

import { readConnectionCredential, storeConnectionCredential } from "./polar-connection-vault";

const ZOHO_PROVIDER = "zoho-mail";
const READ_SCOPES = [
  "ZohoMail.accounts.READ",
  "ZohoMail.folders.READ",
  "ZohoMail.messages.READ",
] as const;

type ZohoTokenResponse = {
  access_token?: string;
  refresh_token?: string;
  api_domain?: string;
  expires_in?: number;
  token_type?: string;
  error?: string;
};

type ZohoAccount = {
  accountId?: string | number;
  primaryEmailAddress?: string;
  displayName?: string;
};

type ZohoAccountsResponse = {
  data?: ZohoAccount[];
};

function required(name: string) {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`Missing required Zoho configuration: ${name}.`);
  return value;
}

function accountsBase() {
  return (process.env.ZOHO_ACCOUNTS_BASE_URL?.trim() || "https://accounts.zoho.com").replace(/\/$/, "");
}

function mailApiBase() {
  return (process.env.ZOHO_MAIL_API_BASE_URL?.trim() || "https://mail.zoho.com/api").replace(/\/$/, "");
}

export function zohoReadScopes() {
  return [...READ_SCOPES];
}

export function createZohoAuthorizationUrl(state: string) {
  const params = new URLSearchParams({
    client_id: required("ZOHO_CLIENT_ID"),
    response_type: "code",
    redirect_uri: required("ZOHO_REDIRECT_URI"),
    scope: READ_SCOPES.join(","),
    access_type: "offline",
    prompt: "consent",
    state,
  });
  return `${accountsBase()}/oauth/v2/auth?${params}`;
}

async function tokenRequest(params: URLSearchParams) {
  const response = await fetch(`${accountsBase()}/oauth/v2/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params.toString(),
    cache: "no-store",
    signal: AbortSignal.timeout(15_000),
  });
  const payload = (await response.json()) as ZohoTokenResponse;
  if (!response.ok || payload.error || !payload.access_token) {
    console.error("Zoho token exchange rejected", { status: response.status, error: payload.error ?? null });
    throw new Error("Zoho authorization could not be completed.");
  }
  return payload;
}

export async function exchangeZohoAuthorizationCode(code: string) {
  return tokenRequest(new URLSearchParams({
    grant_type: "authorization_code",
    client_id: required("ZOHO_CLIENT_ID"),
    client_secret: required("ZOHO_CLIENT_SECRET"),
    redirect_uri: required("ZOHO_REDIRECT_URI"),
    code,
  }));
}

export async function refreshZohoAccessToken(principalKey: string) {
  const credential = await readConnectionCredential({
    provider: ZOHO_PROVIDER,
    principalKey,
  });
  if (!credential) throw new Error("Zoho Mail is not authorized for this P.O.L.A.R. principal.");

  return tokenRequest(new URLSearchParams({
    grant_type: "refresh_token",
    client_id: required("ZOHO_CLIENT_ID"),
    client_secret: required("ZOHO_CLIENT_SECRET"),
    refresh_token: credential.secret,
  }));
}

async function zohoApi<T>(path: string, accessToken: string): Promise<T> {
  const response = await fetch(`${mailApiBase()}/${path.replace(/^\//, "")}`, {
    method: "GET",
    headers: { Authorization: `Zoho-oauthtoken ${accessToken}` },
    cache: "no-store",
    signal: AbortSignal.timeout(15_000),
  });
  if (!response.ok) {
    console.error("Zoho Mail API request rejected", { status: response.status, path: path.split("?")[0] });
    throw new Error(`Zoho Mail request failed (${response.status}).`);
  }
  return (await response.json()) as T;
}

export async function verifyZohoMailbox(accessToken: string) {
  const response = await zohoApi<ZohoAccountsResponse>("accounts", accessToken);
  const account = response.data?.[0];
  if (!account?.accountId) throw new Error("Zoho Mail authorization returned no usable mailbox account.");
  return {
    accountId: String(account.accountId),
    primaryEmailAddress: account.primaryEmailAddress ?? null,
    displayName: account.displayName ?? null,
  };
}

export async function persistZohoRefreshToken(input: {
  principalKey: string;
  refreshToken: string;
  accountId: string;
  primaryEmailAddress?: string | null;
  apiDomain?: string | null;
}) {
  return storeConnectionCredential({
    provider: ZOHO_PROVIDER,
    principalKey: input.principalKey,
    secret: input.refreshToken,
    metadata: {
      accountId: input.accountId,
      primaryEmailAddress: input.primaryEmailAddress ?? null,
      apiDomain: input.apiDomain ?? null,
      scopes: READ_SCOPES,
      authority: "read-only",
    },
  });
}

export async function listZohoMessages(input: {
  principalKey: string;
  accountId: string;
  folderId?: string;
  start?: number;
  limit?: number;
}) {
  const token = await refreshZohoAccessToken(input.principalKey);
  const params = new URLSearchParams({
    start: String(input.start ?? 1),
    limit: String(Math.min(Math.max(input.limit ?? 20, 1), 50)),
  });
  if (input.folderId) params.set("folderId", input.folderId);
  return zohoApi<Record<string, unknown>>(
    `accounts/${encodeURIComponent(input.accountId)}/messages/view?${params}`,
    token.access_token!,
  );
}
