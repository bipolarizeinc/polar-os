# BPEI service purchasing — November 16, 2026

## Approved direction
Customer request: optimize website functionality so customers can purchase a flagship engagement or an individual service.
User confirmed use of Stripe Tax. After learning Tax Settings were pending, user selected **Prepare checkout for now**. Keep new checkout activation disabled until details are confirmed.

## Implemented
- /shop provides a flagship and individual service catalog; desktop/mobile/home navigation exposes it.
- 16 review routes: existing $499 Blueprint price plus the 15 published service fees. Registered agent remains subject to eligibility review.
- Extraction is the first part of the Blueprint process. No standalone extraction price, package discount, or price for later custom stages was invented.
- Secure POST checkout uses server catalog amounts, quantity one, USD, automatic tax, accepted terms, and canonical return URLs.
- New commerce checkout defaults OFF. Inactive purchasing offers service-specific intake.
- Success URL does not prove payment. Server retrieves Stripe session before displaying payment confirmation; fulfillment only occurs via signed webhook.
- Paid orders and refunds/disputes are immutable, replay-safe facts in private database tables; refund facts survive out-of-order delivery.
- Existing ETSA account/access flow is preserved.

## Verified live configuration before changes
Vercel production: polar-os, repository bipolarizeinc/polar-os.
Stripe account holding the existing Blueprint and ETSA products: acct_1U9GciB1NPv2er2w.
Existing Blueprint: price_1UVFXvB1NPv2er2wBpQoQFu5, $499 USD.
Existing Blueprint payment link remains unchanged. The new storefront does not activate it as a tax-enabled checkout.
Stripe Tax settings: pending; missing head_office. Tax registrations: none returned.
Existing webhook endpoint: https://www.polarpaw.online/api/stripe/webhook.
Production environment inventory did not include STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, or SUPABASE_SERVICE_ROLE_KEY. Existing ETSA payment availability must not be claimed without these.

## Remaining activation gates
1. Obtain BPEI's complete current head-office address. Confirm exact jurisdictions where BPEI is already registered with the tax authority. Do not infer registration from its address.
2. Complete Stripe Tax settings and record confirmed registrations. Stripe Tax collects no tax in a state or country until a registration is added there.
3. Confirm product tax classifications; a single STRIPE_COMMERCE_TAX_CODE is appropriate only if it accurately covers every offer. Otherwise extend the catalog with confirmed per-service codes before activation.
4. Apply supabase/migrations/20261116000100_commerce_orders.sql and inspect RLS/grants.
5. Configure production STRIPE_SECRET_KEY (prefer restricted key with required permissions), STRIPE_WEBHOOK_SECRET, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, STRIPE_COMMERCE_TAX_CODE. Do not store secrets in Git.
6. After verified setup set COMMERCE_TAX_READY=true and COMMERCE_ORDER_STORAGE_READY=true. Keep COMMERCE_CHECKOUT_ENABLED unset until sandbox payment, tax, duplicate-event, and webhook-delivery checks pass.
7. In a separate Stripe sandbox verify completed/async payments, cancellation, return-page verification, order persistence, and refund/dispute replay. Verify taxability_reason using an address in a registered jurisdiction; no live charge was made in this task.
8. Enable COMMERCE_CHECKOUT_ENABLED=true and redeploy. Recheck canonical checkout destinations, merchant/amount/tax display, and order persistence. Human service delivery follows scope/schedule confirmation; no instant portal access is promised.

Stripe Tax setup: https://docs.stripe.com/tax/set-up
