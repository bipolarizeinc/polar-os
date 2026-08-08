-- P.O.L.A.R. Founder Passkeys v1
-- Service-role-only WebAuthn credential and one-time challenge storage.

create table if not exists public.polar_founder_passkeys (
  id uuid primary key default gen_random_uuid(),
  credential_id text not null unique,
  public_key_spki text not null,
  sign_count bigint not null default 0 check (sign_count >= 0),
  transports text[] not null default '{}',
  device_label text,
  backup_eligible boolean,
  backup_state boolean,
  last_used_at timestamptz,
  revoked_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.polar_webauthn_challenges (
  id uuid primary key default gen_random_uuid(),
  challenge_hash text not null unique check (challenge_hash ~ '^[0-9a-f]{64}$'),
  purpose text not null check (purpose in ('register','authenticate')),
  founder_session_id uuid references public.polar_founder_sessions(id) on delete cascade,
  rp_id text not null,
  expected_origin text not null,
  expires_at timestamptz not null,
  used_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists polar_founder_passkeys_active_idx
  on public.polar_founder_passkeys(created_at desc)
  where revoked_at is null;
create index if not exists polar_webauthn_challenges_active_idx
  on public.polar_webauthn_challenges(purpose, expires_at)
  where used_at is null;

alter table public.polar_founder_passkeys enable row level security;
alter table public.polar_webauthn_challenges enable row level security;

-- Intentionally no anon/authenticated browser policies. Service role only.
