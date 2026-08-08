import { NextRequest, NextResponse } from "next/server";
import { exchangeFounderBootstrap, FOUNDER_COOKIE } from "../../../../lib/polar-founder-auth";

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

  const result = await exchangeFounderBootstrap({
    bootstrapToken,
    userAgent: request.headers.get("user-agent"),
  });
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
