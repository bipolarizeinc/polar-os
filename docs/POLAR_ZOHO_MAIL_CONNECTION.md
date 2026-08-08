# P.O.L.A.R. Zoho Mail Connection

**Status:** code-ready, authorization pending  
**Authority:** read-only initial consent

## Purpose

P.O.L.A.R. uses Zoho Mail as a governed business-mail extension for inbox intelligence, message retrieval, folder-aware search, and follow-up analysis.

Initial OAuth consent is deliberately read-only:

- `ZohoMail.accounts.READ`
- `ZohoMail.folders.READ`
- `ZohoMail.messages.READ`

Outbound mail authority is not included in the initial consent. Sending/replying will require a later scope elevation and explicit P.O.L.A.R. approval gate.

## Credential boundary

OAuth refresh tokens are not institutional memory.

They are stored in `polar_connection_credentials`, a service-role-only table with RLS enabled and no browser policies. Refresh tokens are encrypted before storage with AES-256-GCM using `POLAR_CONNECTION_ENCRYPTION_KEY`.

Required production secrets:

- `ZOHO_CLIENT_ID`
- `ZOHO_CLIENT_SECRET`
- `ZOHO_REDIRECT_URI`
- `POLAR_CONNECTION_ENCRYPTION_KEY` (32 bytes / 64 hex characters)

Optional data-center overrides:

- `ZOHO_ACCOUNTS_BASE_URL`
- `ZOHO_MAIL_API_BASE_URL`

No OAuth token, client secret, encryption key, or decrypted credential may be written into institutional memory, logs, GitHub, browser bundles, or model prompts.

## API behavior

Zoho OAuth access tokens normally expire after one hour. P.O.L.A.R. stores only the long-lived encrypted refresh token, obtains short-lived access tokens server-side, and uses the Zoho Mail-required header format:

`Authorization: Zoho-oauthtoken <access_token>`

The token endpoint reports `Bearer` as the token type, but Zoho Mail's resource API requires the `Zoho-oauthtoken` prefix.

## Activation boundary

The server-side OAuth client and credential vault are implemented first. A public OAuth start route is intentionally not exposed until P.O.L.A.R.'s authenticated founder/control surface is ready to bind provider authorization to a verified principal.

Live activation requires:

1. register the P.O.L.A.R. OAuth client in the Zoho API Console
2. configure the exact callback URL
3. add the production secrets to the runtime secret store
4. complete consent from the authenticated P.O.L.A.R. control surface
5. verify `/api/accounts` returns the intended mailbox
6. store the encrypted refresh token
7. run a read-only message-list verification
8. promote the Zoho connection registry status from `code-ready` to `live-verified`
