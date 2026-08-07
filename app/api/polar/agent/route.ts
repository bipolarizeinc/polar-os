import { NextResponse } from "next/server";
import { runPolarAgent, type PolarAgentContext } from "../../../../lib/polar/agent";

type PolarAgentRequest = {
  message?: string;
  context?: PolarAgentContext;
};

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: "POLAR agent runtime is not configured with OPENAI_API_KEY." },
      { status: 503 },
    );
  }

  let payload: PolarAgentRequest;

  try {
    payload = (await request.json()) as PolarAgentRequest;
  } catch {
    return NextResponse.json({ error: "Invalid POLAR agent payload." }, { status: 400 });
  }

  const message = payload.message?.trim();
  if (!message) {
    return NextResponse.json({ error: "A message is required." }, { status: 400 });
  }

  try {
    const result = await runPolarAgent(message, payload.context);
    return NextResponse.json(
      {
        ...result,
        status: "completed",
        model: "gpt-5.6",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("POLAR agent run failed", error);
    return NextResponse.json(
      { error: "POLAR could not complete this agent run." },
      { status: 502 },
    );
  }
}
