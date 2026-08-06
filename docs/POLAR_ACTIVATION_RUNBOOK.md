# POLAR OS Production Activation Runbook

## Purpose

This runbook activates persistent intake, institutional memory, intelligence snapshots, secure session recovery, and the Client Command Center without exposing Supabase credentials.

## Required Vercel environment variables

Configure these as encrypted server-only variables for Production, Preview, and Development:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

Never prefix the service-role key with `NEXT_PUBLIC_`. Never commit either value to the repository.

## Required Supabase migrations

Apply the migrations in this exact order:

1. `supabase/migrations/20260805_polar_intake_foundation.sql`
2. `supabase/migrations/20260805_polar_memory_layer.sql`
3. `supabase/migrations/20260805_polar_intelligence_layer.sql`

## Activation verification

1. Redeploy the production project after setting the Vercel variables.
2. Request `GET /api/system/status`.
3. Confirm the response status is `200` and `memory.configured` is `true`.
4. Submit a controlled intake through `/intake`.
5. Confirm the response includes:
   - extraction ID
   - one-time recovery token
   - module recommendation
   - clarity score
   - readiness score
   - Blueprint brief
6. Open `/command-center`.
7. Recover the session with the extraction ID and recovery token.
8. Confirm the dashboard displays the stored analysis, priorities, risks, contradictions, and routing rationale.

## Expected configuration-mode behavior

Before Supabase is connected, `/api/system/status` returns `503` with `CONFIGURATION_REQUIRED`. Intake analysis can still run, but records are not persistent and no recovery token is issued.

## Security verification

- The service-role key must remain server-only.
- Raw recovery tokens must never be stored.
- Only token hashes may be persisted.
- Row-level security remains enabled on memory tables.
- Production logs must not print intake payloads, credentials, or recovery tokens.
