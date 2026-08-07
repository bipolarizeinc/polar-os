-- POLAR OS Memory Kernel v1
-- Hierarchical institutional memory, compartmentalization, auditability, and checkpointing.

create extension if not exists pgcrypto;

create table if not exists public.polar_memory_namespaces (
  id uuid primary key default gen_random_uuid(),
  parent_id uuid references public.polar_memory_namespaces(id) on delete restrict,
  organization_id uuid references public.polar_organizations(id) on delete cascade,
  namespace_type text not null check (namespace_type in ('enterprise','organization','division','extension','project','session')),
  slug text not null,
  display_name text not null,
  classification text not null default 'internal' check (classification in ('public','internal','confidential','restricted','constitutional')),
  inheritance_mode text not null default 'parent_read' check (inheritance_mode in ('isolated','parent_read','bidirectional')),
  retention_policy text not null default 'institutional',
  metadata jsonb not null default '{}'::jsonb,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, parent_id, slug)
);

alter table public.polar_memory_records
  add column if not exists namespace_id uuid references public.polar_memory_namespaces(id) on delete restrict,
  add column if not exists classification text not null default 'internal' check (classification in ('public','internal','confidential','restricted','constitutional')),
  add column if not exists sensitivity text not null default 'normal' check (sensitivity in ('normal','sensitive','secret')),
  add column if not exists content_hash text,
  add column if not exists expires_at timestamptz,
  add column if not exists archived_at timestamptz,
  add column if not exists immutable boolean not null default false;

create table if not exists public.polar_memory_access_grants (
  id uuid primary key default gen_random_uuid(),
  namespace_id uuid not null references public.polar_memory_namespaces(id) on delete cascade,
  principal_type text not null check (principal_type in ('founder','user','role','agent','service')),
  principal_id text not null,
  can_read boolean not null default true,
  can_write boolean not null default false,
  can_export boolean not null default false,
  can_admin boolean not null default false,
  granted_by text not null,
  reason text,
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  unique (namespace_id, principal_type, principal_id)
);

create table if not exists public.polar_memory_audit_log (
  id bigint generated always as identity primary key,
  occurred_at timestamptz not null default now(),
  namespace_id uuid references public.polar_memory_namespaces(id) on delete set null,
  memory_record_id uuid references public.polar_memory_records(id) on delete set null,
  actor_type text not null,
  actor_id text,
  action text not null check (action in ('create','read','update','archive','restore','export','deny','checkpoint','security_event')),
  request_id text,
  source text,
  detail jsonb not null default '{}'::jsonb,
  ip_hash text,
  user_agent_hash text
);

create table if not exists public.polar_change_checkpoints (
  id uuid primary key default gen_random_uuid(),
  checkpoint_key text not null unique,
  namespace_id uuid references public.polar_memory_namespaces(id) on delete set null,
  change_type text not null,
  change_summary text not null,
  source_ref text,
  commit_sha text,
  schema_version text,
  state_hash text,
  security_review_status text not null default 'pending' check (security_review_status in ('pending','passed','failed','waived')),
  backup_status text not null default 'pending' check (backup_status in ('pending','verified','failed','not_applicable')),
  protection_status text not null default 'pending' check (protection_status in ('pending','verified','failed')),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  verified_at timestamptz
);

create table if not exists public.polar_memory_snapshots (
  id uuid primary key default gen_random_uuid(),
  namespace_id uuid not null references public.polar_memory_namespaces(id) on delete restrict,
  checkpoint_id uuid references public.polar_change_checkpoints(id) on delete set null,
  snapshot_version bigint not null,
  record_count integer not null default 0,
  manifest jsonb not null default '{}'::jsonb,
  manifest_hash text not null,
  storage_provider text,
  storage_locator text,
  encryption_status text not null default 'pending' check (encryption_status in ('pending','encrypted','failed')),
  verification_status text not null default 'pending' check (verification_status in ('pending','verified','failed')),
  created_at timestamptz not null default now(),
  unique (namespace_id, snapshot_version)
);

create index if not exists polar_memory_namespaces_org_idx on public.polar_memory_namespaces (organization_id);
create index if not exists polar_memory_namespaces_parent_idx on public.polar_memory_namespaces (parent_id);
create index if not exists polar_memory_records_namespace_idx on public.polar_memory_records (namespace_id) where archived_at is null;
create index if not exists polar_memory_audit_namespace_idx on public.polar_memory_audit_log (namespace_id, occurred_at desc);
create index if not exists polar_memory_checkpoint_created_idx on public.polar_change_checkpoints (created_at desc);

create or replace function public.polar_set_memory_hash()
returns trigger
language plpgsql
as $$
begin
  new.content_hash := encode(digest(coalesce(new.title,'') || E'\n' || coalesce(new.content,''), 'sha256'), 'hex');
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists polar_memory_records_hash_trigger on public.polar_memory_records;
create trigger polar_memory_records_hash_trigger
before insert or update of title, content on public.polar_memory_records
for each row execute function public.polar_set_memory_hash();

-- Memory is server-controlled by default. No browser/anon access.
alter table public.polar_memory_namespaces enable row level security;
alter table public.polar_memory_records enable row level security;
alter table public.polar_memory_access_grants enable row level security;
alter table public.polar_memory_audit_log enable row level security;
alter table public.polar_change_checkpoints enable row level security;
alter table public.polar_memory_snapshots enable row level security;

revoke all on public.polar_memory_namespaces from anon, authenticated;
revoke all on public.polar_memory_records from anon, authenticated;
revoke all on public.polar_memory_access_grants from anon, authenticated;
revoke all on public.polar_memory_audit_log from anon, authenticated;
revoke all on public.polar_change_checkpoints from anon, authenticated;
revoke all on public.polar_memory_snapshots from anon, authenticated;

-- Service-role access remains server-side and bypasses RLS. Future user access must go through
-- explicit server authorization or narrowly-scoped policies, never direct browser queries.

-- Seed enterprise + division namespace skeleton without requiring organization rows.
insert into public.polar_memory_namespaces (organization_id, parent_id, namespace_type, slug, display_name, classification, inheritance_mode)
select null, null, 'enterprise', 'bpei', 'BI POLARIZE ENTERPRISES, INC.', 'constitutional', 'parent_read'
where not exists (
  select 1 from public.polar_memory_namespaces where organization_id is null and parent_id is null and slug = 'bpei'
);

with root as (
  select id from public.polar_memory_namespaces where organization_id is null and parent_id is null and slug = 'bpei' limit 1
), divisions(slug, display_name) as (
  values
    ('blueprint','Blueprint™'),
    ('dr-docx','Dr.Docx™'),
    ('brandforge','BrandForge™'),
    ('launchpad','LaunchPad™'),
    ('nexus','Nexus™'),
    ('pulse','Pulse™'),
    ('vault','Vault™'),
    ('cipher','Cipher™'),
    ('sav-vidzgen','Sav.VidzGen™')
)
insert into public.polar_memory_namespaces (organization_id, parent_id, namespace_type, slug, display_name, classification, inheritance_mode)
select null, root.id, 'division', divisions.slug, divisions.display_name, 'internal', 'parent_read'
from root cross join divisions
where not exists (
  select 1 from public.polar_memory_namespaces existing
  where existing.organization_id is null and existing.parent_id = root.id and existing.slug = divisions.slug
);
