import { NextRequest, NextResponse } from "next/server";

const requiredEnv = (name: string) => {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
};

export async function POST(request: NextRequest) {
  try {
    const accessKey = request.headers.get("x-polar-access-key");
    const expectedAccessKey = requiredEnv("POLAR_ACCESS_KEY");

    if (!accessKey || accessKey !== expectedAccessKey) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }

    const makeApiToken = requiredEnv("MAKE_API_TOKEN");
    const makeApiBaseUrl = requiredEnv("MAKE_API_BASE_URL").replace(/\/$/, "");
    const scenarioId = requiredEnv("MAKE_GOOGLE_BUSINESS_SCENARIO_ID");

    const body = await request.json();
    const action = typeof body?.action === "string" ? body.action : null;

    if (!action) {
      return NextResponse.json(
        { ok: false, error: "Missing action" },
        { status: 400 },
      );
    }

    const response = await fetch(
      `${makeApiBaseUrl}/api/v2/scenarios/${encodeURIComponent(scenarioId)}/run`,
      {
        method: "POST",
        headers: {
          Authorization: `Token ${makeApiToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          data: {
            action,
            payload: body?.payload ?? {},
            source: "polar-os",
          },
          responsive: true,
        }),
        cache: "no-store",
      },
    );

    const text = await response.text();
    let result: unknown = null;

    try {
      result = text ? JSON.parse(text) : null;
    } catch {
      result = text;
    }

    if (!response.ok) {
      return NextResponse.json(
        {
          ok: false,
          error: "Make scenario execution failed",
          status: response.status,
          details: result,
        },
        { status: 502 },
      );
    }

    return NextResponse.json({ ok: true, result });
  } catch (error) {
    console.error("[POLAR Make Bridge]", error);
    return NextResponse.json(
      { ok: false, error: "Integration bridge is not configured" },
      { status: 500 },
    );
  }
}
