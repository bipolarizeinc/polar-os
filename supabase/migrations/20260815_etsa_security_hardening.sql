-- ETSA v1 security hardening
-- Pin trigger function search path so it cannot inherit a mutable caller path.

create or replace function public.etsa_touch_updated_at()
returns trigger
language plpgsql
set search_path = public, pg_temp
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
