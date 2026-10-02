import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { logoutEtsaUser } from "@/app/lib/etsa/auth";
import { clearCustomerSession } from "@/app/lib/etsa/session-cookies";

export async function POST(request: Request) {
  const token = (await cookies()).get("etsa_access")?.value;
  if (token) { try { await logoutEtsaUser(token); } catch { /* Always clear local access even during an upstream outage. */ } }
  return clearCustomerSession(NextResponse.redirect(new URL("/welcome?mode=login", request.url), { status: 303 }));
}
