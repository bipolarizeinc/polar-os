import { NextResponse } from "next/server";
import { loginEtsaUser } from "@/app/lib/etsa/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = String(body.email ?? "").trim().toLowerCase();
    const password = String(body.password ?? "");

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
    }

    const session = await loginEtsaUser(email, password);
    const response = NextResponse.json({ ok: true, user: session.user });

    response.cookies.set("etsa_access", session.access_token, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: session.expires_in || 3600
    });
    response.cookies.set("etsa_refresh", session.refresh_token, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30
    });

    return response;
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Login failed." }, { status: 401 });
  }
}
