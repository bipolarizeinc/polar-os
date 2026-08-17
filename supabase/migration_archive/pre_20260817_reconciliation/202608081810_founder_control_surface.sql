-- P.O.L.A.R. Founder Control Surface v1
-- Single-use bootstrap credentials, opaque founder sessions, and OAuth state tracking.

create table if not exists public.polar_founder_access_credentials (
  id uuid primary key default gen_random_uuid(),
  credential_hash text not null unique check (credential_hash ~ '^[0-9a-f]{64}$'),
  label text not null default 'founder-bootstrap',
  expires_at timestamptz not null,
  used_at timestamptz,
  revoked_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.polar_founder_sessions (
  id uuid primary key default gen_random_uuid(),
  session_hash text not null unique check (session_hash ~ '^[0-9a-f]{64}$'),
  authority_profile text not null default 'founder',
  user_agent_hash text check (user_agent_hash is null or user_agent_hash ~ '^[0-9a-f]{64}$'),
  expires_at timestamptz not null,
  last_seen_at timestamptz not null default now(),
  revoked_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.polar_oauth_states (
  id uuid primary key default gen_random_uuid(),
  provider text not null,
  state_hash text not null unique check (state_hash ~ '^[0-9a-f]{64}$'),
  founder_session_id uuid not null references public.polar_founder_sessions(id) on delete cascade,
  expires_at timestamptz not null,
  used_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists polar_founder_credentials_active_idx
  on public.polar_founder_access_credentials(expires_at)
  where used_at is null and revoked_at is null;
create index if not exists polar_founder_sessions_active_idx
  on public.polar_founder_sessions(expires_at)
  where revoked_at is null;
create index if not exists polar_oauth_states_active_idx
  on public.polar_oauth_states(provider, expires_at)
  where used_at is null;

alter table public.polar_founder_access_credentials enable row level security;
alter table public.polar_founder_sessions enable row level security;
alter table public.polar_oauth_states enable row level security;

-- No anon/authenticated browser policies. Service role only.

create or replace function public.polar_exchange_founder_bootstrap(
  p_credential_hash text,
  p_session_hash text,
  p_user_agent_hash text default null
)
returns table(session_id uuid, expires_at timestamptz)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_credential_id uuid;
  v_session_id uuid;
  v_expires_at timestamptz := now() + interval '8 hours';
begin
  select id into v_credential_id
  from public.polar_founder_access_credentials
  where credential_hash = p_credential_hash
    and used_at is null
    and revoked_at is null
    and expires_at > now()
  for update;

  if v_credential_id is null then
    return;
  end if;

  update public.polar_founder_access_credentials
  set used_at = now()
  where id = v_credential_id;

  insert into public.polar_founder_sessions(session_hash, user_agent_hash, expires_at)
  values (p_session_hash, p_user_agent_hash, v_expires_at)
  returning id into v_session_id;

  return query select v_session_id, v_expires_at;
end;
$$;

revoke all on function public.polar_exchange_founder_bootstrap(text,text,text) from public;
