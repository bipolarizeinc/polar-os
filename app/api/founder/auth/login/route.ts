import { NextRequest, NextResponse } from "next/server";
import { exchangeFounderBootstrap, FOUNDER_COOKIE, matchesFounderAccessKey } from "../../../../lib/polar-founder-auth";
import { issueFounderSession } from "../../../../lib/polar-founder-passkey";

export async function POST(request: NextRequest) {
  let bootstrapToken = "";
  try {
    const body = await request.json();
    bootstrapToken = String(body?.bootstrapToken ?? "").trim();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (bootstrapToken.length < 32 || bootstrapToken.length > 256) {
    return NextResponse.json({ error: "Founder credential rejected." }, { status: 401 });
  }

  const userAgent = request.headers.get("user-agent");
  const result = matchesFounderAccessKey(bootstrapToken)
    ? await issueFounderSession(userAgent)
    : await exchangeFounderBootstrap({ bootstrapToken, userAgent });
  if (!result) return NextResponse.json({ error: "Founder credential rejected." }, { status: 401 });

  const response = NextResponse.json({ ok: true, expiresAt: result.expiresAt });
  response.cookies.set(FOUNDER_COOKIE, result.token, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
    expires: new Date(result.expiresAt),
  });
  response.headers.set("Cache-Control", "no-store");
  return response;
}
