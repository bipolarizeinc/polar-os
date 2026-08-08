-- Sync live P.O.L.A.R. extension namespaces with current governed architecture.

with root as (
  select id from public.polar_memory_namespaces
  where parent_id is null and namespace_key = 'bpei'
  limit 1
), extensions(namespace_key, display_name, classification, metadata) as (
  values
    ('facebook','Facebook','confidential', '{"status":"code-ready","provider":"meta"}'::jsonb),
    ('instagram','Instagram','confidential', '{"status":"code-ready","provider":"meta"}'::jsonb),
    ('tiktok','TikTok','confidential', '{"status":"code-ready","provider":"tiktok"}'::jsonb),
    ('linkedin','LinkedIn','confidential', '{"status":"code-ready","provider":"linkedin"}'::jsonb),
    ('zoho-mail','Zoho Mail','confidential', '{"status":"planned"}'::jsonb),
    ('google-business-profile','Google Business Profile','confidential', '{"status":"planned"}'::jsonb),
    ('google-voice','Google Voice','confidential', '{"status":"device-bridge-planned"}'::jsonb),
    ('polar-mobile','P.O.L.A.R. Mobile Assistant','restricted', '{"status":"architecture-ready"}'::jsonb),
    ('speaker-identity','Speaker Identity','restricted', '{"status":"policy-ready"}'::jsonb),
    ('realtime-voice','Realtime Voice','confidential', '{"status":"architecture-ready"}'::jsonb)
)
insert into public.polar_memory_namespaces(parent_id, namespace_type, namespace_key, display_name, classification, metadata)
select root.id, 'extension', extensions.namespace_key, extensions.display_name, extensions.classification, extensions.metadata
from root cross join extensions
on conflict (parent_id, namespace_key)
do update set
  display_name = excluded.display_name,
  classification = excluded.classification,
  metadata = public.polar_memory_namespaces.metadata || excluded.metadata,
  is_active = true;

update public.polar_memory_namespaces
set is_active = false,
    metadata = metadata || '{"superseded_by":["facebook","instagram","tiktok","linkedin"],"status":"superseded"}'::jsonb
where namespace_key = 'social'
  and namespace_type = 'extension';
