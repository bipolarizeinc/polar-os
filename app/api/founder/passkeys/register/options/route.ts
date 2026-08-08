import { NextRequest, NextResponse } from "next/server";
import { FOUNDER_COOKIE, validateFounderSession } from "../../../../../lib/polar-founder-auth";
import { createWebAuthnChallenge, listFounderPasskeys, relyingParty } from "../../../../../lib/polar-founder-passkey";

export async function POST(request: NextRequest) {
  const session = await validateFounderSession(request.cookies.get(FOUNDER_COOKIE)?.value);
  if (!session) return NextResponse.json({ error: "Founder authorization required." }, { status: 401 });
  const { rpId, origin } = relyingParty(request.url);
  const challenge = await createWebAuthnChallenge({ purpose: "register", founderSessionId: session.id, rpId, origin });
  const existing = await listFounderPasskeys();
  return NextResponse.json({
    challenge,
    rp: { id: rpId, name: "P.O.L.A.R. Founder Control" },
    user: { id: Buffer.from("bpei-founder", "utf8").toString("base64url"), name: "BPEI Founder", displayName: "BPEI Founder" },
    pubKeyCredParams: [{ type: "public-key", alg: -7 }],
    authenticatorSelection: { residentKey: "preferred", userVerification: "required" },
    timeout: 60000,
    attestation: "none",
    excludeCredentials: existing.map((item) => ({ id: item.credential_id, type: "public-key", transports: item.transports ?? [] })),
  }, { headers: { "Cache-Control": "no-store" } });
}
