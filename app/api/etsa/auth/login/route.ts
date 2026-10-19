import { NextResponse } from "next/server";
import { setCustomerSession } from "@/app/lib/etsa/session-cookies";
import { loginEtsaUser } from "@/app/lib/etsa/auth";
import { ensureEtsaProfile } from "@/app/lib/etsa/data";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = String(body.email ?? "").trim().toLowerCase();
    const password = String(body.password ?? "");

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
    }

    const session = await loginEtsaUser(email, password);
    const fullName = session.user.user_metadata?.full_name;
    await ensureEtsaProfile(session.access_token, session.user.id, typeof fullName === "string" && fullName.trim() ? fullName.trim() : "Participant");
    const response = NextResponse.json({ ok: true, user: session.user });

    setCustomerSession(response, session);

    return response;
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Login failed." }, { status: 401 });
  }
}
