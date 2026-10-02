import { NextRequest, NextResponse } from "next/server";
import { CustomerAuthError, getEtsaUser, refreshEtsaSession } from "./app/lib/etsa/auth";
import { clearCustomerSession, setCustomerSession } from "./app/lib/etsa/session-cookies";

export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  if (path.startsWith("/api/etsa/auth/") && path !== "/api/etsa/auth/status") return NextResponse.next();
  if (path.startsWith("/api/etsa/admin/")) return NextResponse.next();
  const access = request.cookies.get("etsa_access")?.value;
  const refresh = request.cookies.get("etsa_refresh")?.value;
  const isApi = path.startsWith("/api/");
  try {
    if (access) {
      try {
        await getEtsaUser(access);
        const response = NextResponse.next();
        response.headers.set("Cache-Control", "private, no-store");
        return response;
      } catch (error) {
        if (!(error instanceof CustomerAuthError) || ![401, 403].includes(error.status)) throw error;
      }
    }
    if (refresh) {
      const session = await refreshEtsaSession(refresh);
      if (!session.access_token || !session.refresh_token || !session.user?.id) throw new CustomerAuthError("Invalid session", 401);
      request.cookies.set("etsa_access", session.access_token);
      request.cookies.set("etsa_refresh", session.refresh_token);
      return setCustomerSession(NextResponse.next({ request }), session);
    }
  } catch (error) {
    if (!(error instanceof CustomerAuthError) || ![400, 401, 403].includes(error.status)) {
      return NextResponse.json({ error: "Customer access is temporarily unavailable. Please retry." }, { status: 503, headers: { "Cache-Control": "private, no-store" } });
    }
  }
  if (isApi) return clearCustomerSession(NextResponse.json({ error: "Your session has ended. Please sign in again.", authenticated: false }, { status: 401 }));
  const destination = new URL("/welcome", request.url);
  destination.searchParams.set("next", `${path}${request.nextUrl.search}`);
  destination.searchParams.set("mode", "login");
  if (access || refresh) destination.searchParams.set("reason", "session");
  return clearCustomerSession(NextResponse.redirect(destination));
}
export const config = { matcher: ["/dashboard/:path*", "/portal/:path*", "/etsa/assessment/:path*", "/etsa/notice/:path*", "/etsa/results/:path*", "/etsa/unlock/:path*", "/api/etsa/:path*"] };
