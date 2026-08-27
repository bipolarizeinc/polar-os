import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const access = request.cookies.get("etsa_access")?.value;

  if (access) return NextResponse.next();
  return NextResponse.redirect(new URL("/welcome", request.url));
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/portal/:path*",
    "/etsa/assessment/:path*",
    "/etsa/notice/:path*",
    "/etsa/results/:path*",
    "/etsa/unlock/:path*",
  ],
};
