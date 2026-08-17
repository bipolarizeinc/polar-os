-- Migration history reconciliation: etsa_reviewer_layer
-- Source: verified production schema history plus preserved repository prerequisites.
-- Reconciled 2026-08-17; no production SQL was executed by this commit.

-- ETSA v1 pilot reviewer layer

create table if not exists public.etsa_review_scores (
  id uuid primary key default gen_random_uuid(),
  assessment_id uuid not null references public.etsa_assessment_sessions(id) on delete cascade,
  question_id integer not null check (question_id between 66 and 70),
  reviewer_id text not null,
  score smallint not null check (score between 0 and 5),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (assessment_id, question_id, reviewer_id)
);

alter table public.etsa_review_scores enable row level security;
-- No participant policies. Reviewer access is server-side through validated founder/admin sessions.

create or replace function public.etsa_touch_review_updated_at()
returns trigger
language plpgsql
set search_path = public, pg_temp
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists etsa_review_scores_touch on public.etsa_review_scores;
create trigger etsa_review_scores_touch before update on public.etsa_review_scores
for each row execute function public.etsa_touch_review_updated_at();
