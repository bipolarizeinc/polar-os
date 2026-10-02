import { NextResponse } from "next/server";
import type { EtsaAuthSession } from "./auth";

export const customerCookieOptions = { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax" as const, path: "/" };
export function setCustomerSession(response: NextResponse, session: EtsaAuthSession) {
  response.headers.set("Cache-Control", "private, no-store");
  response.cookies.set("etsa_access", session.access_token, { ...customerCookieOptions, maxAge: session.expires_in || 3600 });
  response.cookies.set("etsa_refresh", session.refresh_token, { ...customerCookieOptions, maxAge: 60 * 60 * 24 * 30 });
  return response;
}
export function clearCustomerSession(response: NextResponse) {
  response.headers.set("Cache-Control", "private, no-store");
  for (const name of ["etsa_access", "etsa_refresh"]) response.cookies.set(name, "", { ...customerCookieOptions, maxAge: 0 });
  return response;
}
