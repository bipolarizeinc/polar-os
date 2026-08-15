import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { FOUNDER_COOKIE, validateFounderSession } from "@/app/lib/polar-founder-auth";
import { getSupabaseConfig, supabaseRequest } from "@/app/lib/polar-memory";

async function authorize() {
  const store = await cookies();
  const founder = await validateFounderSession(store.get(FOUNDER_COOKIE)?.value);
  if (!founder) throw new Error("UNAUTHORIZED");
  const config = getSupabaseConfig();
  if (!config) throw new Error("ETSA reviewer storage is not configured.");
  return { founder, config };
}

export async function GET(_: Request, context: { params: Promise<{ assessmentId: string }> }) {
  try {
    const { founder, config } = await authorize();
    const { assessmentId } = await context.params;
    const sessions = await supabaseRequest<Array<{id:string;user_id:string;status:string;assessment_version:string;submitted_at:string|null}>>(config, `etsa_assessment_sessions?id=eq.${assessmentId}&select=id,user_id,status,assessment_version,submitted_at&limit=1`);
    const session = sessions[0];
    if (!session) return NextResponse.json({ error: "Assessment not found." }, { status: 404 });
    const [responses, profiles, scores] = await Promise.all([
      supabaseRequest<Array<{question_id:number;answer_value:unknown;answer_text:string|null}>>(config, `etsa_responses?assessment_id=eq.${assessmentId}&order=question_id.asc&select=question_id,answer_value,answer_text`),
      supabaseRequest<Array<{full_name:string;preferred_name:string|null}>>(config, `etsa_profiles?user_id=eq.${session.user_id}&select=full_name,preferred_name&limit=1`),
      supabaseRequest<Array<{question_id:number;score:number;notes:string|null;reviewer_id:string}>>(config, `etsa_review_scores?assessment_id=eq.${assessmentId}&reviewer_id=eq.${founder.id}&order=question_id.asc&select=question_id,score,notes,reviewer_id`)
    ]);
    return NextResponse.json({ session, participant: profiles[0] ?? null, responses, scores });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Review lookup failed.";
    return NextResponse.json({ error: message === "UNAUTHORIZED" ? "Founder authorization required." : message }, { status: message === "UNAUTHORIZED" ? 401 : 500 });
  }
}

export async function PUT(request: Request, context: { params: Promise<{ assessmentId: string }> }) {
  try {
    const { founder, config } = await authorize();
    const { assessmentId } = await context.params;
    const body = await request.json();
    const questionId = Number(body.questionId);
    const score = Number(body.score);
    const notes = typeof body.notes === "string" ? body.notes.trim() : null;
    if (!Number.isInteger(questionId) || questionId < 66 || questionId > 70 || !Number.isInteger(score) || score < 0 || score > 5) {
      return NextResponse.json({ error: "Reviewer scores require a question from 66–70 and an integer score from 0–5." }, { status: 400 });
    }
    const rows = await supabaseRequest(config, "etsa_review_scores?on_conflict=assessment_id,question_id,reviewer_id", {
      method: "POST",
      headers: { Prefer: "resolution=merge-duplicates,return=representation" },
      body: JSON.stringify({ assessment_id: assessmentId, question_id: questionId, reviewer_id: founder.id, score, notes })
    });
    return NextResponse.json({ ok: true, score: rows });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Review save failed.";
    return NextResponse.json({ error: message === "UNAUTHORIZED" ? "Founder authorization required." : message }, { status: message === "UNAUTHORIZED" ? 401 : 500 });
  }
}
