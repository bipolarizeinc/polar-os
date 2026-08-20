import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const access = request.cookies.get("etsa_access")?.value;

  if (access) return NextResponse.next();
  return NextResponse.redirect(new URL("/welcome", request.url));
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
