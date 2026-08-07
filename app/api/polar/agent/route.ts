import { NextResponse } from "next/server";
import { recoverPolarSession } from "../../../lib/polar-session";
import { runPolarAgentV2 } from "../../../../lib/polar/agent-v2";

type AgentRequest = {
  message?: string;
  extractionId?: string;
  recoveryToken?: string;
};

export async function POST(request: Request) {
  const body = (await request.json()) as AgentRequest;
  const message = body.message?.trim();

  if (!message || !body.extractionId?.trim() || !body.recoveryToken?.trim()) {
    return NextResponse.json(
      { error: "Message and valid POLAR session credentials are required." },
      { status: 400 },
    );
  }

  if (message.length > 12_000) {
    return NextResponse.json({ error: "Message is too large." }, { status: 413 });
  }

  try {
    const session = await recoverPolarSession({
      extractionId: body.extractionId,
      recoveryToken: body.recoveryToken,
    });

    if (!session) {
      return NextResponse.json(
        { error: "The POLAR session credentials were not accepted." },
        { status: 401 },
      );
    }

    const result = await runPolarAgentV2(message, session);
    return NextResponse.json(result, {
      status: 200,
      headers: {
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("POLAR agent runtime failed", error);
    const configurationError =
      error instanceof Error &&
      (error.message.includes("not configured") || error.message.includes("API key"));

    return NextResponse.json(
      {
        error: configurationError
          ? "POLAR intelligence services are not configured in this environment."
          : "POLAR could not complete this run.",
      },
      {
        status: configurationError ? 503 : 502,
        headers: { "Cache-Control": "no-store" },
      },
    );
  }
}
