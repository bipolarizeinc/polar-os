-- Migration history reconciliation: foundational baseline and institutional heart
-- Source: verified production schema history plus preserved repository prerequisites.
-- Reconciled 2026-08-17; no production SQL was executed by this commit.

-- BEGIN PRESERVED: 20260805_polar_intake_foundation.sql
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
-- END PRESERVED: 20260805_polar_intake_foundation.sql

-- BEGIN PRESERVED: 20260805_polar_intelligence_layer.sql
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
-- END PRESERVED: 20260805_polar_intelligence_layer.sql

-- BEGIN PRESERVED: 20260805_polar_memory_layer.sql
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
-- END PRESERVED: 20260805_polar_memory_layer.sql

-- BEGIN PRESERVED: 20260807_polar_institutional_heart_v2.sql
-- P.O.L.A.R. Institutional Heart v2
-- Hierarchical, compartmentalized enterprise memory with default-deny RLS,
-- immutable audit events, integrity hashes, and backup checkpoints.

create extension if not exists pgcrypto;

create table if not exists public.polar_memory_namespaces (
  id uuid primary key default gen_random_uuid(),
  parent_id uuid references public.polar_memory_namespaces(id) on delete cascade,
  organization_id uuid,
  namespace_type text not null check (namespace_type in (
    'enterprise','client','division','extension','project','session','system'
  )),
  namespace_key text not null,
  display_name text not null,
  classification text not null default 'internal' check (classification in (
    'public','internal','confidential','constitutional','restricted'
  )),
  retention_policy text not null default 'standard',
  is_active boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (parent_id, namespace_key)
);

create unique index if not exists polar_memory_root_namespace_key_idx
  on public.polar_memory_namespaces(namespace_key)
  where parent_id is null;

create table if not exists public.polar_memory_records_v2 (
  id uuid primary key default gen_random_uuid(),
  namespace_id uuid not null references public.polar_memory_namespaces(id) on delete cascade,
  record_type text not null check (record_type in (
    'fact','decision','constraint','contradiction','preference','goal','risk',
    'asset','relationship','instruction','policy','event','summary','artifact'
  )),
  title text not null,
  content_text text,
  content_json jsonb,
  source_type text not null default 'system',
  source_ref text,
  classification text not null default 'internal' check (classification in (
    'public','internal','confidential','constitutional','restricted'
  )),
  confidence numeric(4,3) not null default 1.000 check (confidence between 0 and 1),
  integrity_sha256 text not null check (integrity_sha256 ~ '^[0-9a-f]{64}$'),
  supersedes_id uuid references public.polar_memory_records_v2(id) on delete set null,
  is_active boolean not null default true,
  expires_at timestamptz,
  tags text[] not null default '{}',
  metadata jsonb not null default '{}'::jsonb,
  created_by text not null default 'polar-system',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (content_text is not null or content_json is not null)
);

create table if not exists public.polar_memory_access_grants (
  id uuid primary key default gen_random_uuid(),
  namespace_id uuid not null references public.polar_memory_namespaces(id) on delete cascade,
  principal_type text not null check (principal_type in ('user','agent','service','role')),
  principal_key text not null,
  permission text not null check (permission in ('read','write','approve','admin','backup')),
  granted_by text not null,
  reason text,
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  revoked_at timestamptz,
  unique(namespace_id, principal_type, principal_key, permission)
);

create table if not exists public.polar_memory_audit_log (
  id bigint generated always as identity primary key,
  event_id uuid not null default gen_random_uuid() unique,
  namespace_id uuid references public.polar_memory_namespaces(id) on delete set null,
  record_id uuid references public.polar_memory_records_v2(id) on delete set null,
  actor_type text not null check (actor_type in ('user','agent','service','system')),
  actor_key text not null,
  action text not null,
  authority_level text not null default 'autonomous' check (authority_level in (
    'autonomous','recommendation','approval-required','prohibited'
  )),
  outcome text not null default 'recorded',
  request_id text,
  ip_hash text,
  details jsonb not null default '{}'::jsonb,
  event_sha256 text not null check (event_sha256 ~ '^[0-9a-f]{64}$'),
  created_at timestamptz not null default now()
);

create table if not exists public.polar_memory_checkpoints (
  id uuid primary key default gen_random_uuid(),
  namespace_id uuid references public.polar_memory_namespaces(id) on delete cascade,
  checkpoint_type text not null check (checkpoint_type in (
    'major-move','manual','scheduled','pre-deploy','post-deploy','incident'
  )),
  status text not null default 'created' check (status in (
    'created','verified','backed-up','protected','failed'
  )),
  manifest jsonb not null default '{}'::jsonb,
  manifest_sha256 text not null check (manifest_sha256 ~ '^[0-9a-f]{64}$'),
  external_backup_provider text,
  external_backup_ref text,
  verified_at timestamptz,
  protected_at timestamptz,
  created_by text not null default 'polar-system',
  created_at timestamptz not null default now()
);

create table if not exists public.polar_memory_security_events (
  id uuid primary key default gen_random_uuid(),
  namespace_id uuid references public.polar_memory_namespaces(id) on delete set null,
  severity text not null check (severity in ('info','low','medium','high','critical')),
  event_type text not null,
  source text not null,
  fingerprint text,
  details jsonb not null default '{}'::jsonb,
  resolved_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists polar_memory_namespace_parent_idx
  on public.polar_memory_namespaces(parent_id, namespace_type, is_active);
create index if not exists polar_memory_namespace_org_idx
  on public.polar_memory_namespaces(organization_id, namespace_type, is_active);
create index if not exists polar_memory_v2_namespace_type_idx
  on public.polar_memory_records_v2(namespace_id, record_type, is_active, created_at desc);
create index if not exists polar_memory_v2_tags_idx
  on public.polar_memory_records_v2 using gin(tags);
create index if not exists polar_memory_v2_metadata_idx
  on public.polar_memory_records_v2 using gin(metadata);
create index if not exists polar_memory_access_lookup_idx
  on public.polar_memory_access_grants(principal_type, principal_key, permission)
  where revoked_at is null;
create index if not exists polar_memory_audit_namespace_idx
  on public.polar_memory_audit_log(namespace_id, created_at desc);
create index if not exists polar_memory_checkpoint_namespace_idx
  on public.polar_memory_checkpoints(namespace_id, created_at desc);
create index if not exists polar_memory_security_open_idx
  on public.polar_memory_security_events(severity, created_at desc)
  where resolved_at is null;

create or replace function public.polar_memory_set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists polar_memory_namespaces_updated_at on public.polar_memory_namespaces;
create trigger polar_memory_namespaces_updated_at
before update on public.polar_memory_namespaces
for each row execute function public.polar_memory_set_updated_at();

drop trigger if exists polar_memory_records_v2_updated_at on public.polar_memory_records_v2;
create trigger polar_memory_records_v2_updated_at
before update on public.polar_memory_records_v2
for each row execute function public.polar_memory_set_updated_at();

-- Audit history is append-only. Even privileged application code should create
-- a corrective event instead of rewriting history.
create or replace function public.polar_memory_prevent_audit_mutation()
returns trigger language plpgsql as $$
begin
  raise exception 'POLAR audit events are immutable';
end;
$$;

drop trigger if exists polar_memory_audit_no_update on public.polar_memory_audit_log;
create trigger polar_memory_audit_no_update
before update or delete on public.polar_memory_audit_log
for each row execute function public.polar_memory_prevent_audit_mutation();

alter table public.polar_memory_namespaces enable row level security;
alter table public.polar_memory_records_v2 enable row level security;
alter table public.polar_memory_access_grants enable row level security;
alter table public.polar_memory_audit_log enable row level security;
alter table public.polar_memory_checkpoints enable row level security;
alter table public.polar_memory_security_events enable row level security;

-- IMPORTANT: no browser/client policies are created here. RLS therefore defaults
-- to deny for anon/authenticated roles. Server-side service-role access remains
-- intentional until authenticated organization memberships are wired.

-- Seed the institutional namespace tree. Client namespaces are created on demand.
insert into public.polar_memory_namespaces(parent_id, namespace_type, namespace_key, display_name, classification)
select null, 'enterprise', 'bpei', 'BI POLARIZE ENTERPRISES, INC.', 'constitutional'
where not exists (
  select 1 from public.polar_memory_namespaces where parent_id is null and namespace_key = 'bpei'
);

with root as (
  select id from public.polar_memory_namespaces where parent_id is null and namespace_key = 'bpei' limit 1
), divisions(namespace_key, display_name) as (
  values
    ('sav-vidzgen','Sav.VidzGen™'),
    ('dr-docx','Dr.Docx™'),
    ('blueprint','Blueprint™'),
    ('brandforge','BrandForge™'),
    ('launchpad','LaunchPad™'),
    ('nexus','Nexus™'),
    ('pulse','Pulse™'),
    ('vault','Vault™'),
    ('cipher','Cipher™')
)
insert into public.polar_memory_namespaces(parent_id, namespace_type, namespace_key, display_name, classification)
select root.id, 'division', divisions.namespace_key, divisions.display_name, 'internal'
from root cross join divisions
on conflict (parent_id, namespace_key) do nothing;

with root as (
  select id from public.polar_memory_namespaces where parent_id is null and namespace_key = 'bpei' limit 1
), extensions(namespace_key, display_name) as (
  values
    ('github','GitHub'),
    ('google-drive','Google Drive'),
    ('gmail','Gmail'),
    ('calendar','Google Calendar'),
    ('hyperframes','HyperFrames'),
    ('social','Social Connections'),
    ('internet-research','Real-Time Internet Research')
)
insert into public.polar_memory_namespaces(parent_id, namespace_type, namespace_key, display_name, classification)
select root.id, 'extension', extensions.namespace_key, extensions.display_name, 'internal'
from root cross join extensions
on conflict (parent_id, namespace_key) do nothing;
-- END PRESERVED: 20260807_polar_institutional_heart_v2.sql
