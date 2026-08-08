import { NextRequest, NextResponse } from "next/server";
import { consumeOAuthState } from "../../../../../lib/polar-founder-auth";
import {
  exchangeZohoAuthorizationCode,
  persistZohoRefreshToken,
  verifyZohoMailbox,
} from "../../../../../lib/polar-zoho-mail";

function founderRedirect(request: NextRequest, status: string) {
  const url = new URL("/founder", request.url);
  url.searchParams.set("zoho", status);
  return NextResponse.redirect(url);
}

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code")?.trim();
  const state = request.nextUrl.searchParams.get("state")?.trim();
  const providerError = request.nextUrl.searchParams.get("error")?.trim();
  if (providerError || !code || !state) return founderRedirect(request, "rejected");

  try {
    const stateRow = await consumeOAuthState({ provider: "zoho-mail", state });
    if (!stateRow) return founderRedirect(request, "invalid-state");

    const token = await exchangeZohoAuthorizationCode(code);
    if (!token.refresh_token) return founderRedirect(request, "missing-refresh-token");
    const mailbox = await verifyZohoMailbox(token.access_token!);
    await persistZohoRefreshToken({
      principalKey: "founder",
      refreshToken: token.refresh_token,
      accountId: mailbox.accountId,
      primaryEmailAddress: mailbox.primaryEmailAddress,
      apiDomain: token.api_domain ?? null,
    });
    return founderRedirect(request, "connected");
  } catch (error) {
    console.error("Zoho OAuth callback failed", { message: error instanceof Error ? error.message : "unknown" });
    return founderRedirect(request, "failed");
  }
}
