import { NextRequest, NextResponse } from "next/server";
import { FOUNDER_COOKIE, validateFounderSession } from "../../../../../lib/polar-founder-auth";
import { consumeWebAuthnChallenge, registerFounderPasskey, validateAuthenticatorData, validateClientData } from "../../../../../lib/polar-founder-passkey";

export async function POST(request: NextRequest) {
  const session = await validateFounderSession(request.cookies.get(FOUNDER_COOKIE)?.value);
  if (!session) return NextResponse.json({ error: "Founder authorization required." }, { status: 401 });
  try {
    const body = await request.json();
    const challenge = String(body.challenge ?? "");
    const row = await consumeWebAuthnChallenge({ purpose: "register", challenge });
    if (!row || row.founder_session_id !== session.id) return NextResponse.json({ error: "Passkey challenge rejected." }, { status: 401 });
    validateClientData({ encoded: String(body.clientDataJSON ?? ""), expectedType: "webauthn.create", expectedChallenge: challenge, expectedOrigin: row.expected_origin });
    const auth = validateAuthenticatorData(String(body.authenticatorData ?? ""), row.rp_id);
    await registerFounderPasskey({
      credentialId: String(body.credentialId ?? ""),
      publicKeySpki: String(body.publicKeySpki ?? ""),
      signCount: auth.signCount,
      transports: Array.isArray(body.transports) ? body.transports.map(String) : [],
      label: typeof body.label === "string" ? body.label.slice(0, 120) : undefined,
      backupEligible: auth.backupEligible,
      backupState: auth.backupState,
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Founder passkey registration rejected", { message: error instanceof Error ? error.message : "unknown" });
    return NextResponse.json({ error: "Passkey registration failed." }, { status: 400 });
  }
}
