import { mkdir, readFile, writeFile } from "node:fs/promises";
import { connectGitHub, getGitHubSession, verifyGitHubConnection } from "../app/lib/polar-composio-github.ts";

const [action, ownerId] = process.argv.slice(2);
if (!["connect", "verify"].includes(action) || !ownerId) {
  console.error("Usage: npm run composio:github -- <connect|verify> <authority_profile>");
  process.exit(1);
}

// Local developer state only. Production resolves authority_profile from founder login.
const stateFile = new URL("../.composio/github-session.json", import.meta.url);
try {
  const previous = await readFile(stateFile, "utf8").then(JSON.parse).catch(() => null);
  const session = await getGitHubSession(ownerId, previous?.ownerId === ownerId ? previous.sessionId : undefined);
  await mkdir(new URL("../.composio/", import.meta.url), { recursive: true });
  await writeFile(stateFile, JSON.stringify({ ownerId, sessionId: session.sessionId }), { mode: 0o600 });
  const result = action === "connect" ? await connectGitHub(session) : await verifyGitHubConnection(session);
  console.log(JSON.stringify({ ownerId, sessionId: session.sessionId, ...result }, null, 2));
} catch (error) {
  // SDK errors may carry request headers. Never dump raw exceptions or credentials.
  console.error(error?.name === "GitHubConnectionError" ? error.message : "Composio GitHub request failed. Check the Composio execution logs.");
  process.exitCode = 1;
}
