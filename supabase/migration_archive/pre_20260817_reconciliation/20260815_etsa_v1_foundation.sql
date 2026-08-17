-- ETSA v1 foundation
-- Enterprise Talent & Skills Alignment System

create extension if not exists pgcrypto;

create table if not exists public.etsa_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  preferred_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.etsa_consent_records (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  notice_version text not null,
  accepted_at timestamptz not null default now(),
  assessment_version text not null default 'ETSA-1.0',
  unique (user_id, notice_version)
);

create table if not exists public.etsa_assessment_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  assessment_version text not null default 'ETSA-1.0',
  status text not null default 'CREATED' check (status in ('CREATED','IN_PROGRESS','PAUSED','SUBMITTED','SCORING','REVIEW_REQUIRED','COMPLETE','ARCHIVED')),
  current_question integer not null default 1 check (current_question between 1 and 70),
  started_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  submitted_at timestamptz,
  completed_at timestamptz
);

create unique index if not exists etsa_one_active_assessment_per_version
on public.etsa_assessment_sessions(user_id, assessment_version)
where status in ('CREATED','IN_PROGRESS','PAUSED','SUBMITTED','SCORING','REVIEW_REQUIRED');

create table if not exists public.etsa_responses (
  id uuid primary key default gen_random_uuid(),
  assessment_id uuid not null references public.etsa_assessment_sessions(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  question_id integer not null check (question_id between 1 and 70),
  answer_value jsonb,
  answer_text text,
  saved_at timestamptz not null default now(),
  last_modified_at timestamptz not null default now(),
  unique (assessment_id, question_id)
);

create table if not exists public.etsa_results (
  id uuid primary key default gen_random_uuid(),
  assessment_id uuid not null unique references public.etsa_assessment_sessions(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  assessment_version text not null,
  scoring_engine_version text not null default 'ETSA-1.0',
  dimension_scores jsonb not null default '{}'::jsonb,
  layer_scores jsonb not null default '{}'::jsonb,
  department_scores jsonb not null default '{}'::jsonb,
  evidence_confidence jsonb not null default '{}'::jsonb,
  readiness_level text,
  primary_archetype text,
  secondary_pattern text,
  development_priority text,
  internal_flags jsonb not null default '[]'::jsonb,
  generated_at timestamptz not null default now()
);

create table if not exists public.etsa_candidate_reports (
  id uuid primary key default gen_random_uuid(),
  result_id uuid not null unique references public.etsa_results(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  report jsonb not null,
  generated_at timestamptz not null default now()
);

create table if not exists public.etsa_internal_reports (
  id uuid primary key default gen_random_uuid(),
  result_id uuid not null unique references public.etsa_results(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  report jsonb not null,
  review_status text not null default 'PENDING',
  generated_at timestamptz not null default now()
);

alter table public.etsa_profiles enable row level security;
alter table public.etsa_consent_records enable row level security;
alter table public.etsa_assessment_sessions enable row level security;
alter table public.etsa_responses enable row level security;
alter table public.etsa_results enable row level security;
alter table public.etsa_candidate_reports enable row level security;
alter table public.etsa_internal_reports enable row level security;

create policy "participants read own profile" on public.etsa_profiles for select using (auth.uid() = user_id);
create policy "participants insert own profile" on public.etsa_profiles for insert with check (auth.uid() = user_id);
create policy "participants update own profile" on public.etsa_profiles for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "participants read own consent" on public.etsa_consent_records for select using (auth.uid() = user_id);
create policy "participants create own consent" on public.etsa_consent_records for insert with check (auth.uid() = user_id);

create policy "participants read own sessions" on public.etsa_assessment_sessions for select using (auth.uid() = user_id);
create policy "participants create own sessions" on public.etsa_assessment_sessions for insert with check (auth.uid() = user_id);
create policy "participants update own sessions" on public.etsa_assessment_sessions for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "participants read own responses" on public.etsa_responses for select using (auth.uid() = user_id);
create policy "participants save own responses" on public.etsa_responses for insert with check (auth.uid() = user_id);
create policy "participants update own responses" on public.etsa_responses for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "participants read own results" on public.etsa_results for select using (auth.uid() = user_id);
create policy "participants read own candidate reports" on public.etsa_candidate_reports for select using (auth.uid() = user_id);

-- No participant policy is intentionally created for etsa_internal_reports.
-- Internal report access must remain server/admin controlled.

create or replace function public.etsa_touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists etsa_profiles_touch on public.etsa_profiles;
create trigger etsa_profiles_touch before update on public.etsa_profiles
for each row execute function public.etsa_touch_updated_at();

drop trigger if exists etsa_sessions_touch on public.etsa_assessment_sessions;
create trigger etsa_sessions_touch before update on public.etsa_assessment_sessions
for each row execute function public.etsa_touch_updated_at();
