import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { etsaRest } from "@/app/lib/etsa/data";
import { getEtsaUser } from "@/app/lib/etsa/auth";

export async function PUT(request: Request) {
  try {
    const store = await cookies();
    const token = store.get("etsa_access")?.value;
    if (!token) return NextResponse.json({ error: "Authentication required." }, { status: 401 });
    const user = await getEtsaUser(token);
    const body = await request.json();
    const assessmentId = String(body.assessmentId ?? "");
    const questionId = Number(body.questionId);
    if (!assessmentId || !Number.isInteger(questionId) || questionId < 1 || questionId > 70) {
      return NextResponse.json({ error: "Invalid assessment response." }, { status: 400 });
    }

    const row = {
      assessment_id: assessmentId,
      user_id: user.id,
      question_id: questionId,
      answer_value: body.answerValue ?? null,
      answer_text: typeof body.answerText === "string" ? body.answerText : null,
      saved_at: new Date().toISOString(),
      last_modified_at: new Date().toISOString()
    };

    await etsaRest("etsa_responses?on_conflict=assessment_id,question_id", token, {
      method: "POST",
      headers: { Prefer: "resolution=merge-duplicates,return=representation" },
      body: JSON.stringify(row)
    });

    await etsaRest(`etsa_assessment_sessions?id=eq.${assessmentId}&user_id=eq.${user.id}`, token, {
      method: "PATCH",
      body: JSON.stringify({ status: "IN_PROGRESS", current_question: Math.min(70, questionId + 1) })
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Response save failed." }, { status: 400 });
  }
}
