# Production credential activation — November 23, 2026

The owner supplied credentials as Production variables named payment and sb. Vercel refuses renaming a sensitive variable. The Stripe server wrapper now accepts the protected payment alias when STRIPE_SECRET_KEY is absent; canonical values take precedence if supplied later. The sb entry was renamed in place to SUPABASE_SERVICE_ROLE_KEY, preserving its value.

The supplied Supabase credential uses the modern sb_secret_ format. Server REST requests now use the apikey header without a non-JWT Bearer value. Legacy service-role JWT support is preserved. No secret values belong in this document or source.

An opt-in, production-only prebuild verification script validates the actual stored credentials. Read mode checks the intended live Stripe account, private database tables, Utah tax registration, canonical service classifications, and a tax-inclusive invoice preview. Delivery mode checks the deployed signed webhook with synthetic paid/unpaid events, replay behavior and a temporary verification order, which it removes. It never charges a card or claims an actual paid-customer transaction.

COMMERCE_ACTIVATION_VERIFY is temporary (read, then delivery, then unset/disabled). Checkout activation must remain gated until those live-runtime checks pass. Staged webhook we_1UcZUhB1NPv2er2w3zAxvsJX must be enabled and the superseded endpoint retired only after verification.

Modern server-key documentation: https://supabase.com/docs/guides/getting-started/api-keys
