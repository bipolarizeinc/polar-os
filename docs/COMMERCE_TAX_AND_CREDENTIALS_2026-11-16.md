# Commerce tax and production credential correction

Founder instructions: "Fix classification and add production credentials." Earlier confirmation: prices include tax; current head office is the existing Stripe address; existing sales-tax registration is Utah only.

## Catalog correction
Each offer has its own Stripe code. No global default can override it. The mapping describes the currently sold service/delivery, not a claim of professional licensure or a registration obligation.

| Offer | Stripe category | Code |
|---|---|---|
| The Bipolarized Blueprint™ | Consulting Services | txcd_20060048 |
| Business Structure & Formation | General - Services | txcd_20030000 |
| State Registration & Compliance | General - Services | txcd_20030000 |
| EIN Application Assistance | General - Services | txcd_20030000 |
| Business Identity / D-U-N-S & UEI Guidance | Consulting Services | txcd_20060048 |
| Operating Agreement / Bylaws | Digital documents — permanent download | txcd_10503000 |
| Marketing Strategy Session | Consulting Services | txcd_20060048 |
| 5-Page Website | Website Design | txcd_10701200 |
| Logo + Branding Kit | Digital Finished Artwork — permanent download | txcd_10505001 |
| Business Presence | General - Services | txcd_20030000 |
| Business Credit Development | Consulting Services | txcd_20060048 |
| Comprehensive Business Plan | Consulting Services | txcd_20060048 |
| Banking Solution Guidance | Consulting Services | txcd_20060048 |
| Registered Agent | General - Services | txcd_20030000 |
| Business Coaching | Consulting Services | txcd_20060048 |
| Annual Compliance Package | General - Services | txcd_20030000 |

Classifications were selected from Stripe's live canonical Tax Code catalog and applied under the Founder's explicit instruction to fix the classifications. General Services is confined to administrative setup/filing work without a more specific matching category. Bespoke advice/plans remain consulting; permanent downloadable governance documents and artwork have their own digital-delivery classifications. Website design has its own code. If the underlying deliverable or rights change, reassess the affected offer's code.

Canonical definitions: https://docs.stripe.com/tax/tax-codes

## Inclusive prices
The server sends tax_behavior=inclusive. Published service prices remain the final service amount, including applicable tax. Payment verification rejects an increased total, discounts/shipping not supported by the current offer, incorrect tax metadata, and incompatible catalog versions. The new catalog version avoids confusing earlier exclusive-price sessions with the new behavior.

## Credential progress
- Private order tables were installed and their RLS/grants verified in the prior activation step.
- Utah registration is recorded in Stripe: taxreg_1UcZUgB1NPv2er2w8wZ7FvEY.
- A replacement signing credential for webhook we_1UcZUhB1NPv2er2w3zAxvsJX was generated and installed as a Production Secret in Vercel. Its value is absent from source and this record.
- The replacement endpoint is deliberately disabled until runtime credentials and delivery verification are complete. The prior ETSA endpoint was not rotated or disabled.
- STRIPE_SECRET_KEY and SUPABASE_SERVICE_ROLE_KEY are still absent from the project environment inventory. The current connectors cannot export or mint these server keys. Vercel integration-configuration lookup returned 403; the temporary runtime has no independently authenticated Vercel CLI for the allowed fallback. No secret was guessed, copied from public configuration, or committed.

## Remaining activation steps
Install the missing Stripe restricted API key and Supabase server credential securely in Vercel Production. Verify the replacement signed webhook, private order persistence, cancellation, payment completion, and refunds. Then retire the superseded endpoint and enable the replacement. Set checkout readiness/activation flags only after verified runtime configuration; do not claim a live payment test or full activation before it occurs.
