import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getEtsaUser } from "@/app/lib/etsa/auth";

export async function GET() {
  try {
    const store = await cookies();
    const accessToken = store.get("etsa_access")?.value;
    if (!accessToken) return NextResponse.json({ authenticated: false }, { status: 401 });
    const user = await getEtsaUser(accessToken);
    return NextResponse.json({ authenticated: true, user });
  } catch {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}
