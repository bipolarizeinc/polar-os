import { NextRequest, NextResponse } from "next/server";
import { FOUNDER_COOKIE, hashOpaqueToken, validateFounderSession } from "../../../lib/polar-founder-auth";
import { founderPublicRpc } from "../../../lib/polar-founder-public-db";

type SecurityStatus = {
  activeSessions: number;
  recoveryCredentials: number;
  currentSessionExpiresAt: string;
  passkeys: Array<{
    id: string;
    label: string;
    transports: string[];
    lastUsedAt: string | null;
    createdAt: string;
    backupEligible: boolean | null;
    backupState: boolean | null;
  }>;
};

async function sessionHash(request: NextRequest) {
  const raw = request.cookies.get(FOUNDER_COOKIE)?.value;
  if (!raw) return null;
  const session = await validateFounderSession(raw);
  if (!session) return null;
  return { raw, hash: hashOpaqueToken(raw) };
}

export async function GET(request: NextRequest) {
  const auth = await sessionHash(request);
  if (!auth) return NextResponse.json({ error: "Founder authority required." }, { status: 401 });

  const status = await founderPublicRpc<SecurityStatus | null>("polar_founder_security_status", {
    body: { p_session_hash: auth.hash },
  });
  if (!status) return NextResponse.json({ error: "Founder session is no longer active." }, { status: 401 });

  const response = NextResponse.json(status);
  response.headers.set("Cache-Control", "no-store");
  return response;
}

export async function POST(request: NextRequest) {
  const auth = await sessionHash(request);
  if (!auth) return NextResponse.json({ error: "Founder authority required." }, { status: 401 });

  const body = await request.json().catch(() => ({}));
  const action = String(body.action ?? "");

  if (action === "lockAll") {
    const count = await founderPublicRpc<number>("polar_founder_revoke_all_sessions", {
      body: { p_session_hash: auth.hash },
    });
    const response = NextResponse.json({ ok: true, revokedSessions: count ?? 0 });
    response.cookies.set(FOUNDER_COOKIE, "", { httpOnly: true, secure: true, sameSite: "strict", path: "/", maxAge: 0 });
    return response;
  }

  const passkeyId = String(body.passkeyId ?? "");
  if (!/^[0-9a-f-]{36}$/i.test(passkeyId)) {
    return NextResponse.json({ error: "Valid passkey ID required." }, { status: 400 });
  }

  if (action === "revokePasskey") {
    const ok = await founderPublicRpc<boolean>("polar_founder_revoke_passkey", {
      body: { p_session_hash: auth.hash, p_passkey_id: passkeyId },
    });
    return NextResponse.json({ ok: Boolean(ok) }, { status: ok ? 200 : 404 });
  }

  if (action === "renamePasskey") {
    const label = String(body.label ?? "").trim().slice(0, 80);
    if (!label) return NextResponse.json({ error: "Passkey label required." }, { status: 400 });
    const ok = await founderPublicRpc<boolean>("polar_founder_rename_passkey", {
      body: { p_session_hash: auth.hash, p_passkey_id: passkeyId, p_label: label },
    });
    return NextResponse.json({ ok: Boolean(ok) }, { status: ok ? 200 : 404 });
  }

  return NextResponse.json({ error: "Unsupported security action." }, { status: 400 });
}
