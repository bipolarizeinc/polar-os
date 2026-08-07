# P.O.L.A.R. Institutional Memory Security Standard

**Status:** Implementation baseline  
**Scope:** POLAR OS institutional memory, client memory, division memory, extension memory, projects, sessions, audit records, and backup checkpoints.

## 1. Governing lifecycle

Every major creation, implementation, deployment, or state-changing operation follows:

**CREATE → VALIDATE → SECURE → SAVE → SNAPSHOT → BACK UP → PROTECT → VERIFY → AUDIT**

A major move is not considered complete until a checkpoint exists and its backup/protection state is recorded.

## 2. Memory hierarchy

The memory tree is hierarchical rather than one undifferentiated context pool:

- Enterprise
  - Governance / constitutional memory
  - Executive and operational memory
  - Nine division namespaces
  - Extension/tool namespaces
  - Client namespaces
    - Project namespaces
      - Session namespaces

Each memory record belongs to exactly one namespace. Cross-namespace retrieval must be explicitly authorized by the orchestration layer.

## 3. Classifications

- `public`: safe for public website and approved external publication.
- `internal`: normal enterprise operations; not public by default.
- `confidential`: client-sensitive, commercially sensitive, personnel, or restricted operational context.
- `constitutional`: governance, ratified doctrine, authority boundaries, and other controlling enterprise records.
- `restricted`: secrets, security material, credentials, incident evidence, or information requiring the narrowest access.

Classification may only become less restrictive through an explicit approved action. Derived summaries inherit the highest classification of material facts they disclose.

## 4. Default-deny database posture

P.O.L.A.R. memory tables use Supabase/Postgres Row Level Security.

- No anonymous browser policy is permitted.
- No general authenticated-user read policy is permitted.
- Server-side service-role access is isolated to server code.
- Client/organization policies are added only after authenticated membership and authorization claims exist.
- Service-role credentials never ship to browser bundles, public logs, static files, GitHub, or generated artifacts.

## 5. Integrity and history

Every governed memory record receives a SHA-256 integrity digest from canonical content.

Decision and memory history is superseded, not silently rewritten, when provenance matters.

Audit events are append-only. Database triggers reject UPDATE and DELETE operations on the audit ledger. Corrections are represented as new events.

## 6. Compartmentalized retrieval

P.O.L.A.R. should retrieve the smallest sufficient context for a task.

Default order:

1. current session
2. current project
3. current division/extension
4. current client/organization
5. enterprise policy and controlling doctrine

The orchestrator may expand scope only when the task requires it and the authority policy permits it.

## 7. Backup architecture

### Active system of record
Supabase/Postgres remains the live structured memory authority.

### Secondary recovery vault
Cloudflare R2 is the approved external object-backup layer for:

- checkpoint manifests
- encrypted exports
- governed documents/media
- recovery bundles
- integrity manifests

R2 is not the live relational source of truth.

### Source history
GitHub stores application code, migrations, policy definitions, and non-secret deployment configuration.

## 8. R2 object layout

Recommended object keys:

`polar-backups/{environment}/{namespace-id}/{yyyy}/{mm}/{checkpoint-id}/manifest.json`

Associated encrypted payloads use the same checkpoint prefix.

Every uploaded payload is recorded with:

- checkpoint ID
- provider (`cloudflare-r2`)
- external object reference
- SHA-256 digest
- creation timestamp
- verification timestamp

## 9. Required Cloudflare controls

When the Cloudflare account is connected:

- proxy the public domain through Cloudflare
- enable managed WAF rules
- rate-limit intake/recovery/agent endpoints
- challenge obvious automated abuse
- block known malicious traffic where appropriate
- keep R2 buckets private by default
- use narrowly-scoped R2 API credentials
- protect administrative surfaces with Zero Trust / Access where applicable
- log security events without recording raw credentials or recovery tokens

## 10. Recovery endpoint controls

Command Center recovery requires both an extraction identifier and recovery credential. Recovery credentials are hashed before persistence/lookup.

Edge rate limiting must protect `/api/intake/recover`. Distributed edge controls are preferred over per-instance memory counters.

Responses must not reveal whether an extraction identifier exists independently of credential validity once the hardened recovery policy is enabled.

## 11. Secrets

Secrets belong only in approved secret stores / environment configuration.

Never persist raw:

- OpenAI API keys
- Supabase service-role keys
- Cloudflare API tokens
- R2 secret access keys
- OAuth refresh tokens
- recovery credentials

Credential rotation is required after suspected disclosure.

## 12. Restore verification

A backup is not considered valid merely because upload succeeded.

Verification requires:

1. retrieve manifest/object metadata
2. compare expected SHA-256 digest
3. confirm namespace/checkpoint relationship
4. verify decryptability where encryption applies
5. record `verified_at`
6. periodically exercise a non-production restore path

## 13. Major-move completion rule

A P.O.L.A.R. operation may report `COMPLETE` only when required lifecycle stages are satisfied. If external backup or edge protection is unavailable, the result must explicitly report the incomplete stage rather than silently treating it as complete.
