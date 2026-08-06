alter table public.polar_intake_sessions
  add column if not exists analysis_snapshot jsonb not null default '{}'::jsonb,
  add column if not exists clarity_score integer,
  add column if not exists readiness_score integer,
  add column if not exists contradiction_flags jsonb not null default '[]'::jsonb,
  add column if not exists risk_flags jsonb not null default '[]'::jsonb,
  add column if not exists blueprint_brief jsonb not null default '{}'::jsonb;

alter table public.polar_intake_sessions
  drop constraint if exists polar_intake_sessions_clarity_score_check;

alter table public.polar_intake_sessions
  add constraint polar_intake_sessions_clarity_score_check
  check (clarity_score is null or clarity_score between 0 and 100);

alter table public.polar_intake_sessions
  drop constraint if exists polar_intake_sessions_readiness_score_check;

alter table public.polar_intake_sessions
  add constraint polar_intake_sessions_readiness_score_check
  check (readiness_score is null or readiness_score between 0 and 100);

create index if not exists polar_intake_sessions_clarity_idx
  on public.polar_intake_sessions (clarity_score);

create index if not exists polar_intake_sessions_readiness_idx
  on public.polar_intake_sessions (readiness_score);

comment on column public.polar_intake_sessions.analysis_snapshot is
  'Versioned deterministic POLAR analysis produced at submission time.';
comment on column public.polar_intake_sessions.blueprint_brief is
  'First-pass structured concept brief for downstream Blueprint generation.';
