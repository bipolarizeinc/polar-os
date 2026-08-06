-- POLAR OS Phase 2: institutional memory layer
create extension if not exists pgcrypto;

create table if not exists public.polar_founders (
  id uuid primary key default gen_random_uuid(),
  email text unique,
  full_name text,
  phone text,
  preferred_contact_method text,
  timezone text default 'America/Denver',
  profile_status text not null default 'prospect' check (profile_status in ('prospect','active','paused','archived')),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.polar_organizations (
  id uuid primary key default gen_random_uuid(),
  owner_founder_id uuid references public.polar_founders(id) on delete set null,
  name text not null,
  legal_name text,
  slug text unique,
  status text not null default 'discovery' check (status in ('discovery','architecture','build','active','paused','archived')),
  primary_module text not null default 'Blueprint™',
  institutional_summary text,
  operating_context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.polar_organization_members (
  organization_id uuid not null references public.polar_organizations(id) on delete cascade,
  founder_id uuid not null references public.polar_founders(id) on delete cascade,
  role text not null default 'owner',
  permissions jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  primary key (organization_id, founder_id)
);

alter table public.polar_intake_sessions
  add column if not exists founder_id uuid references public.polar_founders(id) on delete set null,
  add column if not exists organization_id uuid references public.polar_organizations(id) on delete set null,
  add column if not exists recovery_token_hash text,
  add column if not exists last_saved_at timestamptz,
  add column if not exists progress_percent integer not null default 100 check (progress_percent between 0 and 100),
  add column if not exists routing_reason text,
  add column if not exists memory_state jsonb not null default '{}'::jsonb;

create table if not exists public.polar_memory_records (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.polar_organizations(id) on delete cascade,
  founder_id uuid references public.polar_founders(id) on delete set null,
  intake_session_id uuid references public.polar_intake_sessions(id) on delete set null,
  record_type text not null check (record_type in ('fact','decision','constraint','contradiction','preference','goal','risk','asset','relationship','instruction')),
  title text not null,
  content text not null,
  source text not null default 'intake',
  confidence numeric(4,3) not null default 1.000 check (confidence between 0 and 1),
  is_active boolean not null default true,
  supersedes_id uuid references public.polar_memory_records(id) on delete set null,
  tags text[] not null default '{}',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.polar_decision_log (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.polar_organizations(id) on delete cascade,
  founder_id uuid references public.polar_founders(id) on delete set null,
  decision text not null,
  rationale text,
  alternatives jsonb not null default '[]'::jsonb,
  downstream_effects jsonb not null default '[]'::jsonb,
  status text not null default 'active' check (status in ('proposed','active','superseded','reversed')),
  effective_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table if not exists public.polar_module_links (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.polar_organizations(id) on delete cascade,
  source_module text not null,
  target_module text not null,
  relationship text not null,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, source_module, target_module, relationship)
);

create index if not exists polar_founders_email_idx on public.polar_founders (lower(email));
create index if not exists polar_org_owner_idx on public.polar_organizations (owner_founder_id);
create index if not exists polar_intake_founder_idx on public.polar_intake_sessions (founder_id);
create index if not exists polar_intake_org_idx on public.polar_intake_sessions (organization_id);
create index if not exists polar_intake_recovery_idx on public.polar_intake_sessions (recovery_token_hash);
create index if not exists polar_memory_org_type_idx on public.polar_memory_records (organization_id, record_type, is_active);
create index if not exists polar_memory_tags_idx on public.polar_memory_records using gin (tags);
create index if not exists polar_memory_metadata_idx on public.polar_memory_records using gin (metadata);
create index if not exists polar_decision_org_idx on public.polar_decision_log (organization_id, effective_at desc);

create or replace function public.polar_set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists polar_founders_updated_at on public.polar_founders;
create trigger polar_founders_updated_at before update on public.polar_founders
for each row execute function public.polar_set_updated_at();

drop trigger if exists polar_organizations_updated_at on public.polar_organizations;
create trigger polar_organizations_updated_at before update on public.polar_organizations
for each row execute function public.polar_set_updated_at();

drop trigger if exists polar_memory_records_updated_at on public.polar_memory_records;
create trigger polar_memory_records_updated_at before update on public.polar_memory_records
for each row execute function public.polar_set_updated_at();

alter table public.polar_founders enable row level security;
alter table public.polar_organizations enable row level security;
alter table public.polar_organization_members enable row level security;
alter table public.polar_memory_records enable row level security;
alter table public.polar_decision_log enable row level security;
alter table public.polar_module_links enable row level security;

-- Server-side service-role access is intentional for Phase 2. User-scoped policies
-- will be introduced with authentication in the Client Command Center phase.
