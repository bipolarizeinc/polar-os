import { NextRequest, NextResponse } from "next/server";
import { FOUNDER_COOKIE, validateFounderSession } from "../../../../lib/polar-founder-auth";
import {
  COMPOSIO_GITHUB_COOKIE, GitHubConnectionError, connectGitHub,
  getGitHubConnection, getGitHubSession, hasComposioGitHubCredentials, verifyGitHubConnection,
} from "../../../../lib/polar-composio-github";

export const runtime = "nodejs";
export const maxDuration = 60;

function json(body: unknown, status = 200, sessionId?: string) {
  const response = NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });
  if (sessionId) response.cookies.set(COMPOSIO_GITHUB_COOKIE, sessionId, {
    httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", path: "/api/founder/connections/github", maxAge: 8 * 60 * 60,
  });
  return response;
}

function failed(error: unknown) {
  if (error instanceof GitHubConnectionError) return json({ error: error.message }, error.status);
  // Do not log SDK error objects: they can contain authenticated request headers.
  return json({ error: "GitHub connection could not complete. Check Composio logs and try again." }, 502);
}

export async function GET(request: NextRequest) {
  try {
    const founder = await validateFounderSession(request.cookies.get(FOUNDER_COOKIE)?.value);
    if (!founder) return json({ error: "Founder authorization required." }, 401);
    if (!hasComposioGitHubCredentials()) return json({ configured: false, connected: false });
    const session = await getGitHubSession(founder.authority_profile, request.cookies.get(COMPOSIO_GITHUB_COOKIE)?.value);
    return json({ configured: true, ...await getGitHubConnection(session) }, 200, session.sessionId);
  } catch (error) { return failed(error); }
}

export async function POST(request: NextRequest) {
  try {
    if (request.headers.get("origin") !== request.nextUrl.origin) return json({ error: "Same-origin request required." }, 403);
    const founder = await validateFounderSession(request.cookies.get(FOUNDER_COOKIE)?.value);
    if (!founder) return json({ error: "Founder authorization required." }, 401);
    const body = await request.json().catch(() => null);
    if (body?.action !== "connect" && body?.action !== "verify") return json({ error: "Choose connect or verify." }, 400);
    const session = await getGitHubSession(founder.authority_profile, request.cookies.get(COMPOSIO_GITHUB_COOKIE)?.value);
    const result = body.action === "connect"
      ? await connectGitHub(session, new URL("/founder", request.url).href)
      : await verifyGitHubConnection(session);
    return json({ configured: true, ...result }, 200, session.sessionId);
  } catch (error) { return failed(error); }
}
