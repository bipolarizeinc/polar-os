import { NextRequest, NextResponse } from "next/server";
import { createOAuthState, FOUNDER_COOKIE, validateFounderSession } from "../../../../../lib/polar-founder-auth";
import { createZohoAuthorizationUrl } from "../../../../../lib/polar-zoho-mail";

export async function POST(request: NextRequest) {
  const session = await validateFounderSession(request.cookies.get(FOUNDER_COOKIE)?.value);
  if (!session) return NextResponse.json({ error: "Founder authorization required." }, { status: 401 });

  try {
    const state = await createOAuthState({ provider: "zoho-mail", founderSessionId: session.id });
    const authorizationUrl = createZohoAuthorizationUrl(state);
    return NextResponse.json({ authorizationUrl }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Zoho OAuth start unavailable", { message: error instanceof Error ? error.message : "unknown" });
    return NextResponse.json({ error: "Zoho Mail enrollment is not configured in production yet." }, { status: 503 });
  }
}
