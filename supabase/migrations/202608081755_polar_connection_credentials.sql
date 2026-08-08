-- P.O.L.A.R. Connector Credential Vault
-- Secrets are stored separately from institutional memory and are never browser-readable.

create table if not exists public.polar_connection_credentials (
  id uuid primary key default gen_random_uuid(),
  provider text not null,
  principal_key text not null,
  credential_type text not null default 'oauth_refresh_token',
  ciphertext text not null,
  iv text not null,
  auth_tag text not null,
  key_version text not null default 'v1',
  metadata jsonb not null default '{}'::jsonb,
  expires_at timestamptz,
  revoked_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(provider, principal_key, credential_type)
);

create index if not exists polar_connection_credentials_provider_idx
  on public.polar_connection_credentials(provider, principal_key)
  where revoked_at is null;

alter table public.polar_connection_credentials enable row level security;

-- Deliberately no anon/authenticated policies. Access is service-role only.

create or replace function public.polar_connection_credentials_set_updated_at()
returns trigger language plpgsql
set search_path = pg_catalog, public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists polar_connection_credentials_updated_at on public.polar_connection_credentials;
create trigger polar_connection_credentials_updated_at
before update on public.polar_connection_credentials
for each row execute function public.polar_connection_credentials_set_updated_at();
