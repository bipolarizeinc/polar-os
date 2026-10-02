-- Customer-linked Blueprint Extraction records and paid ETSA reassessment access.
create extension if not exists pgcrypto;

create table if not exists public.polar_intake_sessions (
  id uuid primary key default gen_random_uuid(),
  extraction_id text not null unique,
  customer_user_id uuid references auth.users(id) on delete set null,
  status text not null default 'analyzed'
    check (status in ('draft','submitted','analyzed','reviewing','routed','archived')),
  founder_name text,
  email text,
  phone text,
  company_name text,
  thing text not null,
  audience text not null,
  problem text not null,
  blocker text not null,
  desired_outcome text not null,
  existing_assets text,
  requested_help text,
  constraints text,
  additional_context text,
  recommended_module text,
  routing_reason text,
  recovery_token_hash text not null,
  progress_percent integer not null default 100 check (progress_percent between 0 and 100),
  clarity_score integer check (clarity_score between 0 and 100),
  readiness_score integer check (readiness_score between 0 and 100),
  contradiction_flags jsonb not null default '[]'::jsonb,
  risk_flags jsonb not null default '[]'::jsonb,
  blueprint_brief jsonb,
  analysis_snapshot jsonb,
  memory_state jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  last_saved_at timestamptz,
  submitted_at timestamptz
);

-- Reconcile installations that already have the earlier POLAR intake table.
alter table public.polar_intake_sessions
  add column if not exists customer_user_id uuid references auth.users(id) on delete set null,
  add column if not exists routing_reason text,
  add column if not exists recovery_token_hash text,
  add column if not exists progress_percent integer not null default 100,
  add column if not exists clarity_score integer,
  add column if not exists readiness_score integer,
  add column if not exists risk_flags jsonb not null default '[]'::jsonb,
  add column if not exists blueprint_brief jsonb,
  add column if not exists analysis_snapshot jsonb,
  add column if not exists memory_state jsonb not null default '{}'::jsonb,
  add column if not exists last_saved_at timestamptz;

alter table public.polar_intake_sessions
  drop constraint if exists polar_intake_sessions_status_check;
alter table public.polar_intake_sessions
  add constraint polar_intake_sessions_status_check
  check (status in ('draft','submitted','analyzed','reviewing','routed','archived'));

create index if not exists polar_intake_customer_idx
  on public.polar_intake_sessions(customer_user_id, submitted_at desc);
create index if not exists polar_intake_email_idx
  on public.polar_intake_sessions(lower(email));
create index if not exists polar_intake_recovery_idx
  on public.polar_intake_sessions(recovery_token_hash);

create table if not exists public.etsa_reassessment_entitlements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  assessment_id uuid not null references public.etsa_assessment_sessions(id) on delete cascade,
  checkout_session_id text not null unique,
  payment_intent_id text,
  amount_total integer,
  currency text,
  status text not null default 'paid' check (status in ('paid','refunded','disputed','revoked')),
  unlocked_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, assessment_id)
);

create index if not exists etsa_entitlement_payment_intent_idx
  on public.etsa_reassessment_entitlements(payment_intent_id);

alter table public.polar_intake_sessions enable row level security;
alter table public.etsa_reassessment_entitlements enable row level security;

-- Intake data remains server-only. Customers see it through authenticated pages
-- after the server verifies their Supabase identity.
revoke all on table public.polar_intake_sessions from anon, authenticated;
grant select on table public.etsa_reassessment_entitlements to authenticated;

drop policy if exists "participants read own reassessment entitlements"
  on public.etsa_reassessment_entitlements;
create policy "participants read own reassessment entitlements"
  on public.etsa_reassessment_entitlements for select
  to authenticated
  using ((select auth.uid()) = user_id);

create or replace function public.bpei_set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists polar_intake_sessions_updated_at on public.polar_intake_sessions;
create trigger polar_intake_sessions_updated_at
before update on public.polar_intake_sessions
for each row execute function public.bpei_set_updated_at();

drop trigger if exists etsa_reassessment_entitlements_updated_at on public.etsa_reassessment_entitlements;
create trigger etsa_reassessment_entitlements_updated_at
before update on public.etsa_reassessment_entitlements
for each row execute function public.bpei_set_updated_at();

comment on table public.polar_intake_sessions is
  'Blueprint Extraction intake sessions linked to an authenticated customer when available.';
comment on table public.etsa_reassessment_entitlements is
  'Stripe-fulfilled access to a completed ETSA reassessment report.';
