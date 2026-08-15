import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { etsaRest } from "@/app/lib/etsa/data";
import { getEtsaUser } from "@/app/lib/etsa/auth";

export async function POST() {
  try {
    const store = await cookies();
    const token = store.get("etsa_access")?.value;
    if (!token) return NextResponse.json({ error: "Authentication required." }, { status: 401 });
    const user = await getEtsaUser(token);
    await etsaRest("etsa_consent_records?on_conflict=user_id,notice_version", token, {
      method: "POST",
      headers: { Prefer: "resolution=merge-duplicates,return=representation" },
      body: JSON.stringify({ user_id: user.id, notice_version: "ETSA-DATA-1.0", assessment_version: "ETSA-1.0" })
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Consent record failed." }, { status: 400 });
  }
}
