import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { etsaRest } from "@/app/lib/etsa/data";
import { getEtsaUser } from "@/app/lib/etsa/auth";

async function auth() {
  const store = await cookies();
  const token = store.get("etsa_access")?.value;
  if (!token) throw new Error("AUTH_REQUIRED");
  const user = await getEtsaUser(token);
  return { token, user };
}

export async function GET() {
  try {
    const { token, user } = await auth();
    const sessions = await etsaRest<any[]>(`etsa_assessment_sessions?user_id=eq.${user.id}&assessment_version=eq.ETSA-1.0&order=started_at.desc&limit=1`, token);
    if (!sessions.length) return NextResponse.json({ session: null, responses: [] });
    const session = sessions[0];
    const responses = await etsaRest<any[]>(`etsa_responses?assessment_id=eq.${session.id}&order=question_id.asc`, token);
    return NextResponse.json({ session, responses });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Session lookup failed." }, { status: 401 });
  }
}

export async function POST() {
  try {
    const { token, user } = await auth();
    const existing = await etsaRest<any[]>(`etsa_assessment_sessions?user_id=eq.${user.id}&assessment_version=eq.ETSA-1.0&status=in.(CREATED,IN_PROGRESS,PAUSED,SUBMITTED,SCORING,REVIEW_REQUIRED)&order=started_at.desc&limit=1`, token);
    if (existing.length) return NextResponse.json({ session: existing[0] });
    const created = await etsaRest<any[]>("etsa_assessment_sessions", token, {
      method: "POST",
      body: JSON.stringify({ user_id: user.id, assessment_version: "ETSA-1.0", status: "CREATED", current_question: 1 })
    });
    return NextResponse.json({ session: created[0] });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Session creation failed." }, { status: 400 });
  }
}
