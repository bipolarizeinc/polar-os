# ETSA backend release — 2026-10-19

ETSA remains the approved 70-question ETSA-1.0 pilot. Questions 66–70 require human scores; this release does not automate or change that scoring policy.

## Behavior

- Participant sign-in retains an existing profile and repairs a missing profile.
- Consent, answer type/length/word limits, session ownership, the two-attempt limit, and the submitted-answer lock are enforced inside Postgres as well as the Next.js handlers.
- Each assessment has a stable attempt number. The first result is included; the completed reassessment requires a paid entitlement.
- Result and candidate-report RLS enforce payment access even when the Data API is called directly. Internal reports and reviewer scores remain inaccessible to participant sessions.
- Founder review uses a narrow database RPC authenticated with the existing hashed, expiring/revocable founder-session token. It does not require a Supabase service-role environment variable. Scores use the stable founder authority profile so they survive a new founder login.
- Finalization validates all answers and five human scores, compares the reviewed response/score snapshot while holding the session lock, and writes the result, both reports, and COMPLETE state in one transaction. A repeated finalization returns the existing result.
- Refunded, disputed, or revoked access cannot be reinstated by a delayed duplicate paid webhook for the same checkout. A new checkout may purchase access again.
- Payment availability is checked before displaying or creating checkout. A returned checkout query parameter never grants access or claims independently verified payment.

## Verification

`npm test` covers authentication/session handling, validation, review guards, immutable retries, stale-review conflicts, and customer-scoped entitlement reads.

`supabase/tests/etsa_backend_integrity.sql` uses synthetic users inside a rolled-back transaction. It exercises the actual database permissions and triggers, review RPC, injected report-write failure/rollback, repeat finalization, both allowed attempts, paid access, refund/replay behavior, and expired founder sessions. No participant responses are used or changed by the fixture suite.

The migration chain is additive and includes the follow-up transaction-name and stable-attempt-order fixes found during integration testing. Production changes were applied through the connected Supabase migration tool.

## Payment configuration still required

Production Vercel currently has the reassessment price identifier, but is missing `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `SUPABASE_URL`, and `SUPABASE_SERVICE_ROLE_KEY`. These must be configured privately in [Vercel project settings](https://vercel.com/bpei1/polar-os/settings/environment-variables), followed by a redeployment, before accepting payments. Do not paste secrets into chat or commit them.

The webhook destination is `https://www.polarpaw.online/api/stripe/webhook`. Its signing secret must match the configured endpoint; it must receive checkout completion/asynchronous success and refund/dispute events. Test a complete sandbox checkout → signed webhook → report unlock/refund before treating the paid flow as verified. No real payment was made for this release.
