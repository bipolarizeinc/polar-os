# GitHub through Composio

Founder Control now connects GitHub through Composio Platform and verifies the authenticated GitHub profile and `bipolarizeinc/polar-os` repository with two GET requests. The existing customer agent, model, and Blueprint identity remain in place. This connector belongs to Founder Control.

## Configure

Use Node.js 22.22.3 or newer. Install dependencies with `npm ci`.

Set `COMPOSIO_API_KEY` through the server's secret environment. For local work, use the ignored `.env.local` file. Never prefix this key with `NEXT_PUBLIC_` or commit it. Next.js loads it automatically; the verification command explicitly loads `.env.local`.

The existing Vercel credential is saved as the Sensitive variable `composiom`. The server accepts this owner-supplied alias when the canonical variable is absent or masked, preserving its secret value without exporting or recreating it. A usable `COMPOSIO_API_KEY` takes precedence.

If Composio is not configured yet, use the official CLI:

```sh
composio login
composio dev init
```

Reuse the existing Composio project. If setup supplies a masked key, replace the local masked value with the full existing project key from Platform → project → Getting Started → Step 1. A masked key cannot authenticate SDK requests. Do not rotate a working project key to resolve this.

## Connect and verify

Sign in at `/founder`. The GitHub card provides **Connect GitHub**, **Refresh status**, and **Verify repository access**. The connection returns to `/founder` after authorization. Refresh its status, then verify. An active connection alone is labelled **Connected**. Only a successful profile and repository read marks the card **Live verified**, with the account, repository, and verification time.

The protected API at `/api/founder/connections/github` supports:

- GET: connection status, without calling the GitHub provider.
- POST `{"action":"connect"}`: obtain a Composio Connect Link.
- POST `{"action":"verify"}`: read `/user` and `/repos/bipolarizeinc/polar-os` through Composio's session proxy.

POST requests require the application's own Origin and the existing Founder session. The owner comes exclusively from `FounderSession.authority_profile`; the current founder profile is `founder`. Client-supplied owner, account, endpoint, or method fields are never used. Composio session IDs are kept in an HttpOnly cookie and checked against this owner when resumed. A missing or expired Composio session can be recreated for the same founder; connected accounts remain owned by that profile in Composio.

The connector uses only fixed GET requests and cannot write, publish, or deploy to GitHub. SDK exceptions and provider response headers are not exposed to the browser or dumped into logs.

For local verification of the same server helper, explicitly name the authorized profile:

```sh
npm run composio:github -- connect founder
# Open the returned authorizationUrl and complete GitHub consent.
npm run composio:github -- verify founder
```

The command stores its session ID under ignored `.composio/` and prints only connection metadata or a safe verification summary. Success requires HTTP 200 responses containing the authenticated account and expected repository. This path does not require an OpenAI key, a model call, or a tool-catalog lookup. It is the documented auth-only Connect Link + Proxy Execute pattern, using Composio's current session API (REST v3.1).

To deploy, add `COMPOSIO_API_KEY` to the intended Vercel environment and deploy the code. A key saved in the development workspace does not configure Vercel.

## Sources

- https://docs.composio.dev/docs/authentication/managed-auth-for-custom-tools
- https://docs.composio.dev/reference/sdk-reference/typescript/session
- https://docs.composio.dev/toolkits/github
