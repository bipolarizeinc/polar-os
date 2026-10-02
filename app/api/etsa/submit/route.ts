import { validEtsaAnswer } from "@/app/lib/etsa/answer-validation";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { etsaRest } from "@/app/lib/etsa/data";
import { getEtsaUser } from "@/app/lib/etsa/auth";

export async function POST(request: Request) {
  try {
    const store = await cookies();
    const token = store.get("etsa_access")?.value;
    if (!token) return NextResponse.json({ error: "Authentication required." }, { status: 401 });
    const user = await getEtsaUser(token);
    const body = await request.json();
    const assessmentId = String(body.assessmentId ?? "");
    if (!assessmentId) return NextResponse.json({ error: "Assessment ID required." }, { status: 400 });

    const sessions = await etsaRest<Array<{id:string;status:string}>>(`etsa_assessment_sessions?id=eq.${encodeURIComponent(assessmentId)}&user_id=eq.${user.id}&select=id,status`, token);
    if (!sessions.length) return NextResponse.json({ error: "Assessment not found." }, { status: 404 });
    if (!["CREATED","IN_PROGRESS","PAUSED"].includes(sessions[0].status)) return NextResponse.json({ error: "This assessment has already been submitted." }, { status: 409 });
    const responses = await etsaRest<Array<{question_id:number;answer_value:unknown;answer_text:string|null}>>(`etsa_responses?assessment_id=eq.${assessmentId}&user_id=eq.${user.id}&select=question_id,answer_value,answer_text`, token);
    const answered = new Set(responses.filter(r => validEtsaAnswer(r.question_id, r.answer_value, r.answer_text)).map(r => Number(r.question_id)));
    const missing = Array.from({ length: 70 }, (_, i) => i + 1).filter(id => !answered.has(id));
    if (missing.length) return NextResponse.json({ error: "Assessment is incomplete.", missing }, { status: 400 });

    const now = new Date().toISOString();
    await etsaRest(`etsa_assessment_sessions?id=eq.${assessmentId}&user_id=eq.${user.id}`, token, {
      method: "PATCH",
      body: JSON.stringify({ status: "REVIEW_REQUIRED", submitted_at: now, current_question: 70 })
    });

    return NextResponse.json({ ok: true, status: "REVIEW_REQUIRED" });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Assessment submission failed." }, { status: 400 });
  }
}
