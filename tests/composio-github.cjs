/* eslint-disable @typescript-eslint/no-require-imports */
const test = require("node:test");
const assert = require("node:assert/strict");
const { NextRequest } = require("next/server");
const loader = require("./support/load-ts.cjs");

const modulePath = "app/lib/polar-composio-github.ts";
const routePath = "app/api/founder/connections/github/route.ts";
const githubImport = "../../../../lib/polar-composio-github";
const authImport = "../../../../lib/polar-founder-auth";
const activeConnection = { items: [{ slug: "github", connection: { isActive: true, connectedAccount: { id: "ca_founder", status: "ACTIVE" } } }] };

test("masked project credentials are rejected before an SDK request", async () => {
  const before = process.env.COMPOSIO_API_KEY;
  process.env.COMPOSIO_API_KEY = "ak_****";
  let constructed = false;
  const github = loader({ "@composio/core": { Composio: class { constructor() { constructed = true; } } } })(modulePath);
  try {
    await assert.rejects(github.getGitHubSession("founder"), { status: 503 });
    assert.equal(constructed, false);
  } finally {
    if (before === undefined) delete process.env.COMPOSIO_API_KEY;
    else process.env.COMPOSIO_API_KEY = before;
  }
});

test("a session owned by another principal cannot be resumed", async () => {
  const before = process.env.COMPOSIO_API_KEY;
  process.env.COMPOSIO_API_KEY = "test-only-not-a-real-key";
  let created = false;
  const github = loader({ "@composio/core": { Composio: class {
    sessions = { use: async () => ({ config: { user_id: "another-founder" } }) };
    create() { created = true; }
  } } })(modulePath);
  try {
    await assert.rejects(github.getGitHubSession("founder", "foreign-session"), { status: 403 });
    assert.equal(created, false);
  } finally {
    if (before === undefined) delete process.env.COMPOSIO_API_KEY;
    else process.env.COMPOSIO_API_KEY = before;
  }
});

test("pending connection cannot trigger a provider request", async () => {
  let calls = 0;
  const github = loader({ "@composio/core": {} })(modulePath);
  await assert.rejects(github.verifyGitHubConnection({
    toolkits: async () => ({ items: [{ slug: "github", connection: { isActive: false, connectedAccount: { id: "pending", status: "INITIATED" } } }] }),
    proxyExecute: async () => { calls++; },
  }), { status: 409 });
  assert.equal(calls, 0);
});

test("verification reads only the authenticated profile and polar-os and returns a safe summary", async () => {
  const requests = [];
  const github = loader({ "@composio/core": {} })(modulePath);
  const result = await github.verifyGitHubConnection({
    sessionId: "session_founder", toolkits: async () => activeConnection,
    proxyExecute: async (request) => {
      requests.push(request);
      return { resultType: "completed", status: 200, headers: { Authorization: "secret" }, data: request.endpoint === "/user"
        ? { login: "bipolarizeinc", private_field: "secret" }
        : { full_name: "bipolarizeinc/polar-os", default_branch: "main", open_issues_count: 2 } };
    },
  });
  assert.equal(requests.length, 2);
  assert.equal(requests[0].endpoint, "/user");
  assert.equal(requests[1].endpoint, "/repos/bipolarizeinc/polar-os");
  assert.ok(requests.every((request) => request.method === "GET" && request.toolkit === "github"));
  assert.equal(result.httpStatus, 200);
  assert.equal(result.login, "bipolarizeinc");
  assert.equal(JSON.stringify(result).includes("secret"), false);
});

test("a provider HTTP failure cannot be reported as verified", async () => {
  const github = loader({ "@composio/core": {} })(modulePath);
  await assert.rejects(github.verifyGitHubConnection({
    toolkits: async () => activeConnection,
    proxyExecute: async () => ({ resultType: "completed", status: 401, data: { message: "unauthorized" } }),
  }), /HTTP 401/);
});

test("Founder API denies unauthenticated and cross-origin requests before Composio", async () => {
  let calls = 0;
  const route = loader({
    [authImport]: { FOUNDER_COOKIE: "founder", validateFounderSession: async () => null },
    [githubImport]: { GitHubConnectionError: Error, getGitHubSession: async () => { calls++; } },
  })(routePath);
  assert.equal((await route.GET(new NextRequest("https://polar.example/api/founder/connections/github"))).status, 401);
  assert.equal((await route.POST(new NextRequest("https://polar.example/api/founder/connections/github", { method: "POST", headers: { origin: "https://evil.example" } }))).status, 403);
  assert.equal(calls, 0);
});

test("Founder API derives connection owner from login and keeps its session cookie private", async () => {
  let owner;
  const route = loader({
    [authImport]: { FOUNDER_COOKIE: "founder", validateFounderSession: async () => ({ authority_profile: "founder" }) },
    [githubImport]: {
      COMPOSIO_GITHUB_COOKIE: "polar_composio_github_session", GitHubConnectionError: Error,
      getGitHubSession: async (ownerId) => { owner = ownerId; return { sessionId: "session_founder" }; },
      verifyGitHubConnection: async () => ({ httpStatus: 200 }),
    },
  })(routePath);
  const response = await route.POST(new NextRequest("https://polar.example/api/founder/connections/github", {
    method: "POST", headers: { origin: "https://polar.example", "content-type": "application/json" },
    body: JSON.stringify({ action: "verify", ownerId: "attacker", endpoint: "/user/repos", method: "DELETE" }),
  }));
  assert.equal(response.status, 200);
  assert.equal(owner, "founder");
  assert.equal(response.headers.get("cache-control"), "no-store");
  assert.match(response.headers.get("set-cookie"), /HttpOnly/);
  assert.match(response.headers.get("set-cookie"), /SameSite=strict/);
});
