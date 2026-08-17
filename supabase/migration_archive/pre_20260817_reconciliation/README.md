# Supabase migration-history reconciliation

On 2026-08-17, the production database reported 14 authoritative migration versions while the repository contained 14 files with nonmatching shortened timestamps.

This directory preserves the pre-reconciliation files exactly as they existed before normalization. Files here are intentionally outside `supabase/migrations` and are not executable migrations.

The executable migration directory now uses the exact versions recorded in `supabase_migrations.schema_migrations`. Repository-only prerequisite migrations that were present in production schema but absent from its history were folded into the earliest safe authoritative migration, preserving fresh-environment reproducibility without changing production data or history.
