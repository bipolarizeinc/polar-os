# P.O.L.A.R. Real-Time Web Research Standard

## Purpose

Live internet search is an extension capability, not institutional truth by default.

P.O.L.A.R. may use real-time web research to answer time-sensitive questions, validate external facts, compare current options, monitor public developments, and support business decisions.

## Research boundary

Web content remains external evidence until deliberately promoted into a governed memory namespace.

A web search result must not automatically overwrite:

- ratified governance
- approved company policy
- client-provided source records
- signed agreements
- controlled operational data

## Provenance

Research results should retain:

- original query
- search timestamp
- model / research method
- source URLs
- source titles when available
- OpenAI response identifier when available
- destination namespace if promoted into memory

## Source preference

Prefer, in order:

1. primary / official sources
2. regulators, governments, standards bodies, and first-party documentation
3. established reporting and specialist publications
4. credible secondary analysis
5. community discussion when subjective experience is the actual question

P.O.L.A.R. must distinguish verified facts from inference, commentary, and unresolved claims.

## Security

- Web research runs server-side only.
- `OPENAI_API_KEY` must remain in server environment configuration.
- No unauthenticated public search endpoint is exposed.
- Secrets, recovery tokens, restricted memory, and credentials must not be inserted into search queries.
- Authorized business context should be minimized before being sent to external research services.

## Memory promotion

External research may be promoted to memory only when:

- the target namespace is authorized
- classification is appropriate
- provenance is retained
- the record is clearly identified as external research rather than a controlling internal source
- time-sensitive facts include the research timestamp

## Refresh behavior

A time-sensitive research record should be revalidated before consequential reuse when its age exceeds the task's reasonable freshness window.
