import { NextResponse } from "next/server";
import { z } from "zod";
import { reviewerOperation } from "@/app/lib/etsa/reviewer";

const scoreInput = z.object({ questionId: z.number().int().min(66).max(70), score: z.number().int().min(0).max(5), notes: z.string().trim().max(10_000).optional() });
type Context = { params: Promise<{ assessmentId: string }> };

export async function GET(_: Request, context: Context) {
  const { assessmentId } = await context.params;
  if (!z.uuid().safeParse(assessmentId).success) return NextResponse.json({ error: "Invalid assessment ID." }, { status: 400 });
  try {
    const result = await reviewerOperation("detail", assessmentId);
    return NextResponse.json(result.data ?? { error: result.error }, { status: result.status, headers: { "Cache-Control": "private, no-store" } });
  } catch (error) {
    console.error("ETSA review lookup unavailable", error);
    return NextResponse.json({ error: "Review is temporarily unavailable." }, { status: 503 });
  }
}

export async function PUT(request: Request, context: Context) {
  const { assessmentId } = await context.params;
  const input = scoreInput.safeParse(await request.json().catch(() => null));
  if (!z.uuid().safeParse(assessmentId).success || !input.success) return NextResponse.json({ error: "Use a valid assessment, question 66–70, and an integer score 0–5." }, { status: 400 });
  try {
    const result = await reviewerOperation("score", assessmentId, input.data);
    return NextResponse.json(result.data ?? { error: result.error }, { status: result.status });
  } catch (error) {
    console.error("ETSA review save unavailable", error);
    return NextResponse.json({ error: "Review could not be saved. Please retry." }, { status: 503 });
  }
}
