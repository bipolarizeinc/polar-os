import { NextRequest, NextResponse } from "next/server";
import { FOUNDER_COOKIE, validateFounderSession } from "../../../../lib/polar-founder-auth";

export async function GET(request: NextRequest) {
  const session = await validateFounderSession(request.cookies.get(FOUNDER_COOKIE)?.value);
  const response = NextResponse.json({
    authenticated: Boolean(session),
    authorityProfile: session?.authority_profile ?? null,
    expiresAt: session?.expires_at ?? null,
  }, { status: session ? 200 : 401 });
  response.headers.set("Cache-Control", "no-store");
  return response;
}
