create extension if not exists pgcrypto;

create table if not exists public.polar_intake_sessions (
  id uuid primary key default gen_random_uuid(),
  extraction_id text not null unique,
  status text not null default 'draft' check (status in ('draft', 'submitted', 'reviewing', 'routed', 'archived')),
  founder_name text,
  email text,
  phone text,
  company_name text,
  thing text,
  audience text,
  problem text,
  blocker text,
  desired_outcome text,
  existing_assets text,
  requested_help text,
  constraints text,
  additional_context text,
  recommended_module text,
  contradiction_flags jsonb not null default '[]'::jsonb,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  submitted_at timestamptz
);

create index if not exists polar_intake_sessions_status_idx
  on public.polar_intake_sessions (status);

create index if not exists polar_intake_sessions_email_idx
  on public.polar_intake_sessions (lower(email));

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists polar_intake_sessions_set_updated_at on public.polar_intake_sessions;
create trigger polar_intake_sessions_set_updated_at
before update on public.polar_intake_sessions
for each row execute function public.set_updated_at();

alter table public.polar_intake_sessions enable row level security;

comment on table public.polar_intake_sessions is
  'POLAR Blueprint Extraction intake sessions and routing metadata.';
