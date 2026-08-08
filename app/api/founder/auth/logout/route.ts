import { NextRequest, NextResponse } from "next/server";
import { FOUNDER_COOKIE, revokeFounderSession } from "../../../../lib/polar-founder-auth";

export async function POST(request: NextRequest) {
  const token = request.cookies.get(FOUNDER_COOKIE)?.value;
  await revokeFounderSession(token);
  const response = NextResponse.json({ ok: true });
  response.cookies.set(FOUNDER_COOKIE, "", {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
    expires: new Date(0),
  });
  response.headers.set("Cache-Control", "no-store");
  return response;
}
