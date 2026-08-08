import { NextRequest, NextResponse } from "next/server";
import { FOUNDER_COOKIE } from "../../../../../lib/polar-founder-auth";
import { consumeWebAuthnChallenge, issueFounderSessionFromPasskey, verifyFounderAssertion } from "../../../../../lib/polar-founder-passkey";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const challenge = String(body.challenge ?? "");
    const row = await consumeWebAuthnChallenge({ purpose: "authenticate", challenge });
    if (!row) return NextResponse.json({ error: "Passkey challenge rejected." }, { status: 401 });
    const ok = await verifyFounderAssertion({
      credentialId: String(body.credentialId ?? ""),
      clientDataJSON: String(body.clientDataJSON ?? ""),
      authenticatorData: String(body.authenticatorData ?? ""),
      signature: String(body.signature ?? ""),
      challengeRow: row,
      expectedChallenge: challenge,
    });
    if (!ok) return NextResponse.json({ error: "Passkey signature rejected." }, { status: 401 });
    const session = await issueFounderSessionFromPasskey(request.headers.get("user-agent"));
    const response = NextResponse.json({ ok: true, expiresAt: session.expiresAt });
    response.cookies.set(FOUNDER_COOKIE, session.token, { httpOnly: true, secure: true, sameSite: "strict", path: "/", expires: new Date(session.expiresAt) });
    response.headers.set("Cache-Control", "no-store");
    return response;
  } catch (error) {
    console.error("Founder passkey authentication rejected", { message: error instanceof Error ? error.message : "unknown" });
    return NextResponse.json({ error: "Passkey authentication failed." }, { status: 401 });
  }
}
