import { NextRequest, NextResponse } from "next/server";
import { consumeOAuthState } from "../../../../../lib/polar-founder-auth";
import {
  exchangeProviderCode,
  isProviderEnrollmentKey,
  persistProviderCredential,
} from "../../../../../lib/polar-provider-oauth";

function founderRedirect(request: NextRequest, provider: string, status: string) {
  const url = new URL("/founder", request.url);
  url.searchParams.set(provider, status);
  return NextResponse.redirect(url);
}

export async function GET(request: NextRequest, context: { params: Promise<{ provider: string }> }) {
  const { provider } = await context.params;
  if (!isProviderEnrollmentKey(provider)) return founderRedirect(request, provider, "unsupported");

  const code = request.nextUrl.searchParams.get("code")?.trim();
  const state = request.nextUrl.searchParams.get("state")?.trim();
  const providerError = request.nextUrl.searchParams.get("error")?.trim();
  if (providerError || !code || !state) return founderRedirect(request, provider, "rejected");

  try {
    const stateRow = await consumeOAuthState({ provider, state });
    if (!stateRow) return founderRedirect(request, provider, "invalid-state");

    const token = await exchangeProviderCode(provider, code);
    await persistProviderCredential({ provider, principalKey: "founder", token });
    return founderRedirect(request, provider, "connected");
  } catch (error) {
    console.error("Provider OAuth callback failed", {
      provider,
      message: error instanceof Error ? error.message : "unknown",
    });
    return founderRedirect(request, provider, "failed");
  }
}
