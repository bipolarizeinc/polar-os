# P.O.L.A.R. Cloudflare Activation Standard

**Status:** code-ready, credentials pending  
**Scope:** Cloudflare R2 backup, edge protection, and recovery controls for POLAR OS.

## 1. Governing lifecycle

P.O.L.A.R. major moves follow:

**CREATE → VALIDATE → SECURE → SAVE → SNAPSHOT → BACK UP → PROTECT → VERIFY → AUDIT**

A checkpoint is not considered fully protected until the encrypted R2 object exists, its integrity metadata is verified with a signed HEAD request, and the Supabase checkpoint has been marked `protected`.

## 2. Required server-only environment variables

These values belong in the production runtime secret store only. They must never be committed to GitHub, stored in institutional memory, emitted to browser bundles, or logged.

- `CLOUDFLARE_ACCOUNT_ID` — used to derive the default R2 endpoint
- `CLOUDFLARE_R2_ACCESS_KEY_ID`
- `CLOUDFLARE_R2_SECRET_ACCESS_KEY`
- `CLOUDFLARE_R2_BUCKET`
- `POLAR_BACKUP_ENCRYPTION_KEY` — exactly 32 bytes represented as 64 hexadecimal characters

Optional:

- `CLOUDFLARE_R2_ENDPOINT` — explicit credential-free HTTPS S3 endpoint. Use this for jurisdiction-specific R2 buckets or when the endpoint supplied by Cloudflare differs from the default account endpoint.

The R2 access key must use Object Read & Write permission and be restricted to the designated P.O.L.A.R. backup bucket wherever Cloudflare permissions allow.

## 3. Backup format

`app/lib/polar-r2-backup.ts` encrypts checkpoint payloads before upload with AES-256-GCM.

Each object envelope contains:

- encryption format version
- algorithm identifier
- creation timestamp
- plaintext SHA-256
- random 96-bit IV
- GCM authentication tag
- encrypted ciphertext

The R2 object itself receives an SHA-256 integrity value in `x-amz-meta-polar-sha256`. After upload, P.O.L.A.R. issues a separately signed HEAD request and compares the returned metadata hash before marking the checkpoint protected.

## 4. R2 transport

The adapter uses Cloudflare R2's S3-compatible HTTPS API and AWS Signature Version 4 with region `auto` and service `s3`.

The default endpoint is derived as:

`https://{CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`

Jurisdiction-specific buckets must instead set the exact Cloudflare-provided S3 endpoint in `CLOUDFLARE_R2_ENDPOINT`.

## 5. Object layout

Objects use:

`polar-backups/{environment}/{namespace-id}/{YYYY}/{MM}/{checkpoint-id}/checkpoint.enc.json`

The bucket remains private. Public bucket URLs are prohibited for institutional-memory backups.

## 6. Required edge controls

When Cloudflare account access becomes available, protect the public production domain and apply the following controls.

### Sensitive application routes

Highest-priority protection:

- `/api/intake`
- `/api/intake/analyze`
- `/api/intake/recover`
- `/api/polar/agent`
- future `/api/polar/backup` only if an authenticated backup route is ever intentionally exposed
- future OAuth callback endpoints

### Baseline controls

- Cloudflare proxy enabled for the public production hostname
- Managed WAF rules enabled
- bot/challenge controls for obvious automation abuse
- rate limits on state-changing and AI-expensive endpoints
- stricter throttles on recovery/authentication endpoints
- administrative surfaces protected by Cloudflare Access where appropriate
- no cache of authenticated API responses
- TLS-only origin communication
- security logs must exclude raw credentials, recovery tokens, private message bodies, and backup encryption material

## 7. Suggested rate-limit posture

These are deployment targets, not a substitute for application-level authorization.

- `/api/intake/recover`: very low burst tolerance; repeated failures should trigger challenge/block behavior
- `/api/polar/agent`: moderate per-client request ceiling with abuse protection because each request can incur model/tool cost
- `/api/intake` and `/api/intake/analyze`: moderate burst tolerance appropriate for interactive use, not scraping
- OAuth callbacks: no generic caching; reject malformed/state-mismatched requests at the application layer

Exact numeric limits should be tuned from production traffic rather than hard-coded before launch telemetry exists.

## 8. Recovery verification

A recovery exercise must prove all of the following before R2 is considered operational:

1. encrypted checkpoint object uploads successfully
2. signed HEAD verification returns the expected object SHA-256 metadata
3. Supabase checkpoint becomes `protected`
4. immutable audit event records `memory.checkpoint.protected`
5. encrypted object can be downloaded with authorized credentials
6. AES-GCM authentication succeeds
7. decrypted plaintext SHA-256 matches the envelope value
8. recovered payload matches the original checkpoint content

## 9. Current blocker

The Cloudflare account is not currently exposed as a connected tool in this ChatGPT environment, and the plugin catalog is not returning an installable Cloudflare connector. Therefore the infrastructure code is source-controlled and production-safe, but live R2 bucket/WAF configuration cannot be truthfully reported as complete until Cloudflare account access or scoped credentials are available to the deployment environment.
