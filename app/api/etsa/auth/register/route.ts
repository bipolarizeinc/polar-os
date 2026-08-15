import { NextResponse } from "next/server";
import { registerEtsaUser } from "@/app/lib/etsa/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const fullName = String(body.fullName ?? "").trim();
    const email = String(body.email ?? "").trim().toLowerCase();
    const password = String(body.password ?? "");

    if (!fullName || !email || password.length < 8) {
      return NextResponse.json({ error: "Name, valid email, and an 8+ character password are required." }, { status: 400 });
    }

    const session = await registerEtsaUser(email, password, fullName);
    const response = NextResponse.json({ ok: true, user: session.user });

    if (session.access_token) {
      response.cookies.set("etsa_access", session.access_token, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        path: "/",
        maxAge: session.expires_in || 3600
      });
    }
    if (session.refresh_token) {
      response.cookies.set("etsa_refresh", session.refresh_token, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 30
      });
    }

    return response;
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Registration failed." }, { status: 400 });
  }
}
