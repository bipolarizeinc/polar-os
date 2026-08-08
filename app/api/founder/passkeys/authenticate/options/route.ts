import { NextRequest, NextResponse } from "next/server";
import { createWebAuthnChallenge, listFounderPasskeys, relyingParty } from "../../../../../lib/polar-founder-passkey";

export async function POST(request: NextRequest) {
  const { rpId, origin } = relyingParty(request.url);
  const challenge = await createWebAuthnChallenge({ purpose: "authenticate", rpId, origin });
  const passkeys = await listFounderPasskeys();
  if (!passkeys.length) return NextResponse.json({ error: "No founder passkey is enrolled." }, { status: 404 });
  return NextResponse.json({
    challenge,
    rpId,
    allowCredentials: passkeys.map((item) => ({ id: item.credential_id, type: "public-key", transports: item.transports ?? [] })),
    userVerification: "required",
    timeout: 60000,
  }, { headers: { "Cache-Control": "no-store" } });
}
