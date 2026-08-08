import { NextRequest, NextResponse } from "next/server";
import { createOAuthState, FOUNDER_COOKIE, validateFounderSession } from "../../../../../lib/polar-founder-auth";
import { createProviderAuthorizationUrl, isProviderEnrollmentKey } from "../../../../../lib/polar-provider-oauth";

export async function POST(request: NextRequest, context: { params: Promise<{ provider: string }> }) {
  const session = await validateFounderSession(request.cookies.get(FOUNDER_COOKIE)?.value);
  if (!session) return NextResponse.json({ error: "Founder authorization required." }, { status: 401 });

  const { provider } = await context.params;
  if (!isProviderEnrollmentKey(provider)) {
    return NextResponse.json({ error: "Unsupported provider." }, { status: 404 });
  }

  try {
    const state = await createOAuthState({ provider, founderSessionId: session.id });
    const authorizationUrl = createProviderAuthorizationUrl(provider, state);
    return NextResponse.json({ authorizationUrl }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Provider OAuth start unavailable", {
      provider,
      message: error instanceof Error ? error.message : "unknown",
    });
    return NextResponse.json({ error: `${provider} enrollment is not configured in production yet.` }, { status: 503 });
  }
}
