import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { claimPolarSession, recoverPolarSession } from "../../../lib/polar-session";
import { getEtsaUser } from "../../../lib/etsa/auth";

type RecoveryRequest = {
  extractionId?: string;
  recoveryToken?: string;
};

export async function POST(request: Request) {
  const body = (await request.json()) as RecoveryRequest;
  if (!body.extractionId?.trim() || !body.recoveryToken?.trim()) {
    return NextResponse.json(
      { error: "Extraction ID and recovery token are required." },
      { status: 400 },
    );
  }

  try {
    const accessToken = (await cookies()).get("etsa_access")?.value;
    let userId: string | null = null;
    if (accessToken) {
      try { userId = (await getEtsaUser(accessToken)).id; } catch {}
    }
    const session = userId
      ? await claimPolarSession({ ...body, userId })
      : await recoverPolarSession(body);
    if (!session) {
      // Intentionally avoid telling the caller which credential was wrong.
      return NextResponse.json(
        { error: "The POLAR recovery credentials were not accepted." },
        { status: 404 },
      );
    }

    return NextResponse.json({ session }, { status: 200 });
  } catch (error) {
    console.error("POLAR recovery failed", error);
    const unavailable = error instanceof Error && error.message.includes("not configured");
    return NextResponse.json(
      { error: unavailable ? "POLAR memory is not configured." : "POLAR could not recover this session." },
      { status: unavailable ? 503 : 502 },
    );
  }
}
