import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const access = request.cookies.get("etsa_access")?.value;

  if (access) return NextResponse.next();

  const welcome = new URL("/welcome", request.url);
  const requested = `${request.nextUrl.pathname}${request.nextUrl.search}`;
  if (requested !== "/") welcome.searchParams.set("next", requested);
  return NextResponse.redirect(welcome);
}

export const config = {
  matcher: [
    "/",
    "/portal/:path*",
    "/services/:path*",
    "/etsa/:path*",
    "/about/:path*",
    "/contact/:path*",
    "/intake/:path*",
  ],
};
