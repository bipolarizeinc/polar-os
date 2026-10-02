import { NextResponse } from "next/server";
import { registerEtsaUser } from "@/app/lib/etsa/auth";
import { setCustomerSession } from "@/app/lib/etsa/session-cookies";
import { ensureEtsaProfile } from "@/app/lib/etsa/data";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const fullName = String(body.fullName ?? "").trim();
    const email = String(body.email ?? "").trim().toLowerCase();
    const password = String(body.password ?? "");

    if (!fullName || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || password.length < 8) {
      return NextResponse.json({ error: "Name, valid email, and an 8+ character password are required." }, { status: 400 });
    }

    const signup = await registerEtsaUser(email, password, fullName);
    if (!signup.access_token) {
      return NextResponse.json({ ok: true, confirmationRequired: true, message: "Check your email to confirm your account, then sign in here." });
    }
    const session = signup;

    if (!session.access_token || !session.user?.id) {
      return NextResponse.json({ error: "ETSA could not open your secure session. Please use the login option and try again." }, { status: 409 });
    }

    await ensureEtsaProfile(session.access_token, session.user.id, fullName);

    const response = NextResponse.json({ ok: true, user: session.user });
    setCustomerSession(response, session);
    return response;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Registration failed.";
    const normalized = message.toLowerCase();
    if (normalized.includes("invalid login credentials") || normalized.includes("already registered")) {
      return NextResponse.json({ error: "An ETSA account already exists for this email. Select SIGN IN and log in with your password." }, { status: 409 });
    }
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
