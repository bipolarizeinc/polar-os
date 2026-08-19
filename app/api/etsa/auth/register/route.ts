import { NextResponse } from "next/server";
import { loginEtsaUser, registerEtsaUser } from "@/app/lib/etsa/auth";
import { ensureEtsaProfile } from "@/app/lib/etsa/data";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const fullName = String(body.fullName ?? "").trim();
    const email = String(body.email ?? "").trim().toLowerCase();
    const password = String(body.password ?? "");

    if (!fullName || !email || password.length < 8) {
      return NextResponse.json({ error: "Name, valid email, and an 8+ character password are required." }, { status: 400 });
    }

    const signup = await registerEtsaUser(email, password, fullName);
    const session = signup.access_token && signup.user?.id
      ? signup
      : await loginEtsaUser(email, password);

    if (!session.access_token || !session.user?.id) {
      return NextResponse.json({ error: "ETSA could not open your secure session. Please use the login option and try again." }, { status: 409 });
    }

    await ensureEtsaProfile(session.access_token, session.user.id, fullName);

    const response = NextResponse.json({ ok: true, user: session.user });
    response.cookies.set("etsa_access", session.access_token, { httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: session.expires_in || 3600 });
    if (session.refresh_token) {
      response.cookies.set("etsa_refresh", session.refresh_token, { httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 30 });
    }
    return response;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Registration failed.";
    const normalized = message.toLowerCase();
    if (normalized.includes("invalid login credentials") || normalized.includes("already registered")) {
      return NextResponse.json({ error: "An ETSA account already exists for this email. Select ‘I ALREADY HAVE AN ETSA ACCOUNT’ and log in with your password." }, { status: 409 });
    }
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
