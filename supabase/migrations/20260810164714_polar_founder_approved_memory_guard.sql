-- Migration history reconciliation: polar_founder_approved_memory_guard
-- Source: verified production schema history plus preserved repository prerequisites.
-- Reconciled 2026-08-17; no production SQL was executed by this commit.

create unique index if not exists polar_memory_source_ref_unique_idx on public.polar_memory_records_v2(source_ref) where source_ref is not null;

create or replace function public.polar_memory_protect_founder_approved()
returns trigger language plpgsql as $$
begin
  if old.metadata->>'authority' = 'founder-approved' then
    raise exception 'Founder-approved POLAR memory is append-only; create a superseding record instead.';
  end if;
  return old;
end;
$$;

drop trigger if exists polar_memory_founder_approved_no_mutation on public.polar_memory_records_v2;
create trigger polar_memory_founder_approved_no_mutation
before update or delete on public.polar_memory_records_v2
for each row execute function public.polar_memory_protect_founder_approved();
