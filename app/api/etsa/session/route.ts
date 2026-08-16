import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { etsaRest } from "@/app/lib/etsa/data";
import { getEtsaUser } from "@/app/lib/etsa/auth";

type AssessmentSession={
  id:string;
  status:string;
  started_at:string;
  assessment_version?:string;
  current_question?:number;
};
type AssessmentResponse={question_id:number;answer_value:unknown;answer_text:string|null};

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
    const sessions = await etsaRest<AssessmentSession[]>(`etsa_assessment_sessions?user_id=eq.${user.id}&assessment_version=eq.ETSA-1.0&order=started_at.desc&limit=1`, token);
    if (!sessions.length) return NextResponse.json({ session: null, responses: [], attemptNumber: 0 });
    const session = sessions[0];
    const allSessions = await etsaRest<Array<{id:string}>>(`etsa_assessment_sessions?user_id=eq.${user.id}&assessment_version=eq.ETSA-1.0&order=started_at.asc&select=id`, token);
    const attemptNumber = Math.max(1, allSessions.findIndex(item => item.id === session.id) + 1);
    const responses = await etsaRest<AssessmentResponse[]>(`etsa_responses?assessment_id=eq.${session.id}&order=question_id.asc`, token);
    return NextResponse.json({ session, responses, attemptNumber });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Session lookup failed." }, { status: 401 });
  }
}

export async function POST() {
  try {
    const { token, user } = await auth();
    const allSessions = await etsaRest<Array<{id:string;status:string;started_at:string}>>(`etsa_assessment_sessions?user_id=eq.${user.id}&assessment_version=eq.ETSA-1.0&order=started_at.asc&select=id,status,started_at`, token);
    const active = [...allSessions].reverse().find(item => ["CREATED","IN_PROGRESS","PAUSED","SUBMITTED","SCORING","REVIEW_REQUIRED"].includes(item.status));
    if (active) {
      const attemptNumber = allSessions.findIndex(item => item.id === active.id) + 1;
      return NextResponse.json({ session: active, attemptNumber });
    }

    if (allSessions.length >= 2) {
      return NextResponse.json({
        error: "Your included ETSA assessment and one reassessment have already been completed.",
        code: "ETSA_REASSESSMENT_LIMIT",
        unlockPath: "/etsa/unlock"
      }, { status: 409 });
    }

    if (allSessions.length === 1 && allSessions[0].status !== "COMPLETE") {
      return NextResponse.json({
        error: "Your current ETSA assessment must be finalized before a reassessment can begin.",
        code: "ETSA_FIRST_NOT_FINAL"
      }, { status: 409 });
    }

    const attemptNumber = allSessions.length + 1;
    const created = await etsaRest<AssessmentSession[]>("etsa_assessment_sessions", token, {
      method: "POST",
      body: JSON.stringify({ user_id: user.id, assessment_version: "ETSA-1.0", status: "CREATED", current_question: 1 })
    });
    return NextResponse.json({ session: created[0], attemptNumber });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Session creation failed." }, { status: 400 });
  }
}
