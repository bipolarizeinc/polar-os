# P.O.L.A.R. Runtime v2

## Runtime contract

P.O.L.A.R. v2 is the reasoning layer attached to a recovered Bipolarized Blueprint session.

### Input

- founder/operator message
- Blueprint extraction identifier
- recovery credential

### Authorization

The server revalidates the extraction ID + recovery credential against Supabase before every agent run. Client-provided venture context is not accepted as an authorization source.

The recovery credential is used only for session validation and is excluded from the model prompt.

### Current tools

- deterministic Blueprint intake analysis
- governed real-time public web research with provenance
- authority/policy check

### Current non-capabilities

Until corresponding execution tools and approvals exist, P.O.L.A.R. must not claim it:

- sent an email/message
- published content
- modified or deleted consequential records
- deployed code
- changed permissions
- committed funds
- bound the enterprise
- changed governance

Institutional memory v2 writes are also withheld until the database migration is activated.

## Command Center credential handling

The browser retains the recovery credential only in active React component state while the Command Center is unlocked.

It is not intentionally persisted to:

- localStorage
- sessionStorage
- URL/query parameters
- rendered page content
- model prompts

Locking the Command Center clears the active session and credential state.

## Web research

P.O.L.A.R. can use live web research for current public information. Research results remain external evidence and should retain source provenance. Secrets and restricted client information must not be placed in search queries.

## Approval model

Reasoning is broad. Execution is narrow.

Actions classified `approval-required` remain blocked until a real execution tool receives independently verified approval. Actions classified `prohibited` are outside P.O.L.A.R.'s delegated authority.

## Activation dependencies

Production reasoning requires:

- `OPENAI_API_KEY` in server environment configuration
- existing Supabase intake/recovery configuration

The hierarchical institutional memory migration and Cloudflare/R2 perimeter are separate activation stages and must not be represented as active until actually deployed.
