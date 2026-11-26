create table public.etsa_candidate_referrals (
  assessment_id uuid not null references public.etsa_assessment_sessions(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  kind text not null check (kind in ('placement','founder')),
  preferences jsonb not null default '{}'::jsonb,
  contact_email text check (contact_email is null or length(contact_email) <= 320),
  consent_version text not null,
  consent_at timestamptz not null default now(),
  decision text not null default 'pending' check (decision in ('pending','invite','closed','withdrawn')),
  decided_at timestamptz,
  withdrawn_at timestamptz,
  contact_choice text check (contact_choice in ('as-soon-as-available','schedule')),
  requested_time text check (requested_time is null or length(requested_time) <= 32),
  requested_timezone text check (requested_timezone is null or length(requested_timezone) <= 64),
  email_notified_at timestamptz,
  schedule_notified_at timestamptz,
  primary key(assessment_id,kind)
);
alter table public.etsa_candidate_referrals enable row level security;
revoke all on public.etsa_candidate_referrals from public, anon, authenticated;
grant select, insert, update on public.etsa_candidate_referrals to service_role;

create index etsa_candidate_referrals_review_time on public.etsa_candidate_referrals(consent_at desc);
