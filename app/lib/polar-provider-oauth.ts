import "server-only";

import { readConnectionCredential, storeConnectionCredential } from "./polar-connection-vault";

export type ProviderEnrollmentKey = "google-business" | "linkedin" | "tiktok";

type ProviderConfig = {
  provider: ProviderEnrollmentKey;
  authorizeUrl: string;
  tokenUrl: string;
  clientIdEnv: string;
  clientSecretEnv: string;
  redirectUriEnv: string;
  scopes: string[];
};

const PROVIDERS: Record<ProviderEnrollmentKey, ProviderConfig> = {
  "google-business": {
    provider: "google-business",
    authorizeUrl: "https://accounts.google.com/o/oauth2/v2/auth",
    tokenUrl: "https://oauth2.googleapis.com/token",
    clientIdEnv: "GOOGLE_BUSINESS_CLIENT_ID",
    clientSecretEnv: "GOOGLE_BUSINESS_CLIENT_SECRET",
    redirectUriEnv: "GOOGLE_BUSINESS_REDIRECT_URI",
    scopes: ["https://www.googleapis.com/auth/business.manage"],
  },
  linkedin: {
    provider: "linkedin",
    authorizeUrl: "https://www.linkedin.com/oauth/v2/authorization",
    tokenUrl: "https://www.linkedin.com/oauth/v2/accessToken",
    clientIdEnv: "LINKEDIN_CLIENT_ID",
    clientSecretEnv: "LINKEDIN_CLIENT_SECRET",
    redirectUriEnv: "LINKEDIN_REDIRECT_URI",
    scopes: ["openid", "profile", "email", "r_organization_social"],
  },
  tiktok: {
    provider: "tiktok",
    authorizeUrl: "https://www.tiktok.com/v2/auth/authorize/",
    tokenUrl: "https://open.tiktokapis.com/v2/oauth/token/",
    clientIdEnv: "TIKTOK_CLIENT_KEY",
    clientSecretEnv: "TIKTOK_CLIENT_SECRET",
    redirectUriEnv: "TIKTOK_REDIRECT_URI",
    scopes: ["user.info.basic", "video.list"],
  },
};

function required(name: string) {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`Missing provider configuration: ${name}.`);
  return value;
}

export function isProviderEnrollmentKey(value: string): value is ProviderEnrollmentKey {
  return value === "google-business" || value === "linkedin" || value === "tiktok";
}

export function createProviderAuthorizationUrl(provider: ProviderEnrollmentKey, state: string) {
  const config = PROVIDERS[provider];
  const params = new URLSearchParams({
    client_id: required(config.clientIdEnv),
    redirect_uri: required(config.redirectUriEnv),
    response_type: "code",
    state,
    scope: config.scopes.join(provider === "tiktok" ? "," : " "),
  });

  if (provider === "google-business") {
    params.set("access_type", "offline");
    params.set("prompt", "consent");
  }
  if (provider === "tiktok") {
    params.delete("client_id");
    params.set("client_key", required(config.clientIdEnv));
  }

  return `${config.authorizeUrl}?${params}`;
}

type TokenPayload = {
  access_token?: string;
  refresh_token?: string;
  expires_in?: number;
  scope?: string;
  token_type?: string;
  open_id?: string;
  error?: string;
  error_description?: string;
};

export async function exchangeProviderCode(provider: ProviderEnrollmentKey, code: string) {
  const config = PROVIDERS[provider];
  const params = new URLSearchParams({
    code,
    redirect_uri: required(config.redirectUriEnv),
    grant_type: "authorization_code",
  });

  if (provider === "tiktok") {
    params.set("client_key", required(config.clientIdEnv));
    params.set("client_secret", required(config.clientSecretEnv));
  } else {
    params.set("client_id", required(config.clientIdEnv));
    params.set("client_secret", required(config.clientSecretEnv));
  }

  const response = await fetch(config.tokenUrl, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params.toString(),
    cache: "no-store",
    signal: AbortSignal.timeout(15_000),
  });
  const payload = (await response.json()) as TokenPayload;
  if (!response.ok || payload.error || !payload.access_token) {
    console.error("Provider token exchange rejected", {
      provider,
      status: response.status,
      error: payload.error ?? null,
    });
    throw new Error(`${provider} authorization could not be completed.`);
  }
  return payload;
}

export async function persistProviderCredential(input: {
  provider: ProviderEnrollmentKey;
  principalKey: string;
  token: TokenPayload;
}) {
  const secret = input.token.refresh_token || input.token.access_token;
  if (!secret) throw new Error("Provider authorization returned no storable credential.");

  return storeConnectionCredential({
    provider: input.provider,
    principalKey: input.principalKey,
    secret,
    metadata: {
      scope: input.token.scope ?? PROVIDERS[input.provider].scopes.join(" "),
      tokenType: input.token.token_type ?? null,
      expiresIn: input.token.expires_in ?? null,
      openId: input.token.open_id ?? null,
      storesRefreshToken: Boolean(input.token.refresh_token),
      authority: "read-first",
    },
  });
}

export async function hasProviderCredential(provider: ProviderEnrollmentKey, principalKey: string) {
  return Boolean(await readConnectionCredential({ provider, principalKey }));
}
