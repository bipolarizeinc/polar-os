import "server-only";
import { Composio } from "@composio/core";

export const COMPOSIO_GITHUB_COOKIE = "polar_composio_github_session";
export const POLAR_GITHUB_REPOSITORY = "bipolarizeinc/polar-os";

export class GitHubConnectionError extends Error {
  readonly status: number;
  constructor(message: string, status = 502) {
    super(message);
    this.name = "GitHubConnectionError";
    this.status = status;
  }
}

export function hasComposioGitHubCredentials() {
  const key = process.env.COMPOSIO_API_KEY?.trim();
  return Boolean(key && !/[*•]/.test(key));
}

function client() {
  if (!hasComposioGitHubCredentials()) {
    throw new GitHubConnectionError("GitHub connection is not configured in this environment.", 503);
  }
  return new Composio();
}

// The caller must resolve ownerId from validated FounderSession.authority_profile.
// A browser or model must never choose the connection owner.
export async function getGitHubSession(ownerId: string, sessionId?: string) {
  if (!ownerId.trim()) throw new GitHubConnectionError("Founder authority required.", 401);
  const composio = client();
  if (sessionId) {
    try {
      const session = await composio.sessions.use(sessionId);
      if (session.config.user_id !== ownerId) {
        throw new GitHubConnectionError("GitHub session belongs to another principal.", 403);
      }
      return session;
    } catch (error) {
      // Expired/missing sessions may be recreated for the same authenticated owner.
      // Authorization and transport failures must never silently switch sessions.
      if (!(error && typeof error === "object" && "status" in error && error.status === 404)) throw error;
    }
  }
  return composio.create(ownerId, { toolkits: ["github"] });
}

type GitHubSession = Awaited<ReturnType<typeof getGitHubSession>>;

export async function getGitHubConnection(session: GitHubSession) {
  const { items } = await session.toolkits({ toolkits: ["github"] });
  const github = items.find((item) => item.slug.toLowerCase() === "github");
  const account = github?.connection?.connectedAccount;
  return {
    connected: Boolean(github?.connection?.isActive && account?.status === "ACTIVE"),
    connectedAccountId: account?.id ?? null,
    connectionStatus: account?.status ?? "NOT_CONNECTED",
  };
}

export async function connectGitHub(session: GitHubSession, callbackUrl?: string) {
  const current = await getGitHubConnection(session);
  if (current.connected) return { ...current, authorizationUrl: null };
  const connection = await session.authorize("github", callbackUrl ? { callbackUrl } : undefined);
  if (!connection.redirectUrl) throw new GitHubConnectionError("GitHub did not return an authorization link.");
  return { connected: false, connectedAccountId: connection.id, connectionStatus: connection.status, authorizationUrl: connection.redirectUrl };
}

async function readGitHub(session: GitHubSession, endpoint: string) {
  const response = await session.proxyExecute({ toolkit: "github", endpoint, method: "GET" });
  if (response.resultType !== "completed") {
    throw new GitHubConnectionError("The GitHub request was blocked by connection policy.", 403);
  }
  if (response.status !== 200) {
    throw new GitHubConnectionError(`GitHub returned HTTP ${response.status}. Check account authorization and repository access.`);
  }
  const data = response.data;
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    throw new GitHubConnectionError("GitHub returned an unexpected response.");
  }
  return data as Record<string, unknown>;
}

// Fixed GET requests only: this entrypoint cannot modify GitHub or target another host.
export async function verifyGitHubConnection(session: GitHubSession) {
  const connection = await getGitHubConnection(session);
  if (!connection.connected) throw new GitHubConnectionError("Connect GitHub before verifying access.", 409);
  const profile = await readGitHub(session, "/user");
  const repository = await readGitHub(session, `/repos/${POLAR_GITHUB_REPOSITORY}`);
  if (typeof profile.login !== "string" || repository.full_name !== POLAR_GITHUB_REPOSITORY) {
    throw new GitHubConnectionError("GitHub did not return the expected account and repository.");
  }
  return {
    ...connection,
    sessionId: session.sessionId,
    login: profile.login,
    repository: repository.full_name,
    defaultBranch: typeof repository.default_branch === "string" ? repository.default_branch : null,
    openIssues: typeof repository.open_issues_count === "number" ? repository.open_issues_count : null,
    endpoint: `/repos/${POLAR_GITHUB_REPOSITORY}`,
    httpStatus: 200,
    verifiedAt: new Date().toISOString(),
  };
}
