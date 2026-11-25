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

    const result = await runPolarAgentV2(message, session, {
      gatewayCredential: request.headers.get("x-vercel-oidc-token") ?? undefined,
    });
    return NextResponse.json(result, {
      status: 200,
      headers: {
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("POLAR agent runtime failed", error);
    const errorMessage = error instanceof Error ? error.message : "";
    const configurationError =
      errorMessage.includes("not configured") || errorMessage.includes("API key");
    const billingVerificationRequired =
      errorMessage.includes("valid credit card") ||
      errorMessage.includes("customer_verification_required");

    return NextResponse.json(
      {
        error: billingVerificationRequired
          ? "POLAR intelligence is configured, but the AI inference provider requires billing verification."
          : configurationError
            ? "POLAR intelligence services are not configured in this environment."
            : "POLAR could not complete this run.",
      },
      {
        status: configurationError || billingVerificationRequired ? 503 : 502,
        headers: { "Cache-Control": "no-store" },
      },
    );
  }
}
