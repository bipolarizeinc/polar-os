import { NextResponse } from "next/server";
import { z } from "zod";
import { validEtsaAnswer } from "@/app/lib/etsa/answer-validation";
import { scoreEtsaAssessment } from "@/app/lib/etsa/engine";
import { reviewerOperation, type ReviewDetail } from "@/app/lib/etsa/reviewer";

export async function POST(_: Request, context: { params: Promise<{ assessmentId: string }> }) {
  const { assessmentId } = await context.params;
  if (!z.uuid().safeParse(assessmentId).success) return NextResponse.json({ error: "Invalid assessment ID." }, { status: 400 });
  try {
    const detail = await reviewerOperation<ReviewDetail>("detail", assessmentId);
    if (!detail.data) return NextResponse.json({ error: detail.error }, { status: detail.status });
    const { session, responses, scores } = detail.data;
    if (session.status !== "COMPLETE") {
      if (session.status !== "REVIEW_REQUIRED") return NextResponse.json({ error: "Only submitted assessments can be finalized." }, { status: 409 });
      const answered = new Set(responses.filter(r => validEtsaAnswer(r.question_id, r.answer_value, r.answer_text)).map(r => r.question_id));
      if (answered.size !== 70) return NextResponse.json({ error: "Assessment response set is incomplete or invalid." }, { status: 400 });
      if (![66, 67, 68, 69, 70].every(id => scores.some(r => r.question_id === id && Number.isInteger(r.score) && r.score >= 0 && r.score <= 5))) return NextResponse.json({ error: "Score all five applied challenges before finalization." }, { status: 400 });
    }
    const payload = session.status === "COMPLETE" ? {} : {
      result: scoreEtsaAssessment(responses, scores),
      // Compare the snapshot under the database row lock before publishing.
      expected: { responses, scores }
    };
    const result = await reviewerOperation("finalize", assessmentId, payload);
    return NextResponse.json(result.data ?? { error: result.error }, { status: result.status });
  } catch (error) {
    console.error("ETSA finalization unavailable", error);
    return NextResponse.json({ error: "Reports could not be finalized. Your assessment remains saved; please retry." }, { status: 503 });
  }
}
