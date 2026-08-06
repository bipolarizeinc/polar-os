import { NextResponse } from "next/server";
import { analyzeIntake, type IntakeAnalysisInput } from "../../../../lib/polar/analyze-intake";

export async function POST(request: Request) {
  let payload: IntakeAnalysisInput;

  try {
    payload = (await request.json()) as IntakeAnalysisInput;
  } catch {
    return NextResponse.json({ error: "Invalid intake payload." }, { status: 400 });
  }

  if (!payload.thing?.trim() || !payload.problem?.trim() || !payload.desiredOutcome?.trim()) {
    return NextResponse.json(
      { error: "Thing, problem, and desired outcome are required for POLAR analysis." },
      { status: 400 },
    );
  }

  return NextResponse.json({ analysis: analyzeIntake(payload) });
}
