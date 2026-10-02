# Website functionality audit — October 2, 2026

Customer journey: public offer or ETSA → shared customer login → intended destination → consent → saved assessment → human review → candidate results.

## Fixed

- Verify customer access cookies; refresh expired/missing access tokens using refresh cookies in Next.js Proxy. Forward refreshed cookies to the browser and downstream handlers. Return JSON 401 to APIs, preserve destinations for page redirects, and keep credentials during retryable upstream outages.
- Use one customer login screen for ETSA and client operations. Default Client Login to sign-in, support account creation, handle confirmation-required signup without attempting a password login prematurely, and validate internal return destinations.
- Revoke the current Supabase session on logout and clear both local cookies. Local cookie removal still succeeds during upstream outages.
- Make consent acknowledgment repeatable with insert-only conflict handling matching the existing RLS policies. Require acknowledgment before creating an assessment.
- Validate answer types, option ranges, nonempty responses and word limits. Reject edits/submission of submitted attempts through the application APIs.
- Recover from assessment loading, saving, submission, results and notice network failures. Save answered questions before going back. Route submitted assessments to results and unfinished assessments to their saved question.
- Show actual ETSA status and saved progress in the client dashboard.
- Preserve requested service in contact email and intake links. Add Platforms and Blueprint recovery to mobile navigation, hide closed-menu links from keyboard navigation, support Escape.
- Catch command-center recovery failures. Correct reassessment eligibility redirects so Next.js redirects are not swallowed by catch blocks.
- Remove the disconnected Pay & Unlock path; use a contextual request-access path until billing fulfillment exists.

## Validation

- Production Next.js build: pass.
- ESLint: pass.
- 18 automated regression checks: pass. Tests mock Supabase boundaries; no production customer accounts are created.
- Local production-server crawl: 138 page/link destinations pass, 20 rendered media references checked, no missing referenced files.
- Read-only production database policy inspection confirmed consent supports SELECT/INSERT but not UPDATE.

## Remaining product integration work

- ETSA reassessment payment fulfillment is absent. The result API locks attempt two unconditionally; there is no entitlement table/check or payment webhook. Do not market automatic payment unlocking until verified payment fulfillment and authorization are implemented.
- Blueprint intake uses extraction ID/recovery-token access. It is not attached to the customer Auth user ID. The dashboard does not claim to track an engagement it cannot query.
- Password recovery is not implemented; the shared login links to account support.
- Full live registration, authenticated assessment completion and human-review finalization have not been exercised with a real customer account in this pass.
- Application API checks protect submitted assessment edits, but existing Supabase ownership policies alone do not enforce immutable submitted records for direct Data API clients. Database enforcement is a separate migration.
