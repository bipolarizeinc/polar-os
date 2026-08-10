-- P.O.L.A.R. founder-approved memory guard + historical seed
-- Protects founder-approved records from mutation and prevents duplicate provenance.

create unique index if not exists polar_memory_source_ref_unique_idx
  on public.polar_memory_records_v2(source_ref)
  where source_ref is not null;

create or replace function public.polar_memory_protect_founder_approved()
returns trigger language plpgsql as $$
begin
  if old.metadata->>'authority' = 'founder-approved' then
    raise exception 'Founder-approved POLAR memory is append-only; create a superseding record instead.';
  end if;
  return old;
end;
$$;

drop trigger if exists polar_memory_founder_approved_no_mutation
  on public.polar_memory_records_v2;
create trigger polar_memory_founder_approved_no_mutation
before update or delete on public.polar_memory_records_v2
for each row execute function public.polar_memory_protect_founder_approved();

-- Historical reconstruction rules:
-- verified GitHub events remain evidence-backed events, not retroactive approvals.
-- Explicit founder approvals are recorded as protected constitutional decisions.

with root as (
  select id from public.polar_memory_namespaces
  where parent_id is null and namespace_key='bpei'
  limit 1
), seed(record_type,title,content_json,source_type,source_ref,classification,confidence,integrity_sha256,tags,metadata,created_by,created_at) as (
  values
  ('event','Rebrand experience initiated','{"event":"Branded ambient experience introduced into POLAR OS","commit":"50ed95e17780c61fc172e7a9467e68cc597f5359"}'::jsonb,'github','github:commit:50ed95e17780c61fc172e7a9467e68cc597f5359','internal',0.990,'f09a1def658634a60e4e5d6ed8b8f8ff7230ff19183e5a34ac38dcf3c636fdce',array['rebrand','milestone','verified-event'],jsonb_build_object('evidence_kind','verified-event','authority','evidence-backed'),'polar-history-import','2026-07-25T03:29:29Z'::timestamptz),
  ('event','Live brand image delivery corrected','{"event":"Production brand image delivery fixed","commit":"e921ed34edadbd1c6f0c7722369123d913646885"}'::jsonb,'github','github:commit:e921ed34edadbd1c6f0c7722369123d913646885','internal',1.000,'2dece17f6c4ad488f61f983fd247c524a9d04dca29b5f8803cee34e1a80d869e',array['brand','production','verified-event'],jsonb_build_object('evidence_kind','verified-event','authority','evidence-backed'),'polar-history-import','2026-07-28T00:36:32Z'::timestamptz),
  ('event','Updated brand assets deployed','{"event":"Official updated brand assets deployed","commit":"6a4c1053b3152e1873a6ad3e7050848f11d523c7"}'::jsonb,'github','github:commit:6a4c1053b3152e1873a6ad3e7050848f11d523c7','constitutional',1.000,'a8b6ee5ae62ce8ca11a939907f3761efdc2c2b228894e810af509e78cebf8625',array['rebrand','deployment','milestone','verified-event'],jsonb_build_object('evidence_kind','verified-event','authority','evidence-backed'),'polar-history-import','2026-08-02T07:03:42Z'::timestamptz),
  ('event','P.O.L.A.R. institutional memory heart v2 established','{"event":"Hierarchical governed institutional memory v2 merged","pull_request":18}'::jsonb,'github','github:pr:18','constitutional',1.000,'bf77cf7b2f6c437c82aa6dd7562d01b5c3bcca9588716317a3a5ba371c6cc7de',array['polar','memory','architecture','verified-event'],jsonb_build_object('evidence_kind','verified-event','authority','evidence-backed'),'polar-history-import','2026-08-07T21:28:38Z'::timestamptz),
  ('event','Governed operational learning established','{"event":"Operational learning candidate pipeline and durable-memory promotion rules merged","pull_request":24}'::jsonb,'github','github:pr:24','constitutional',1.000,'423bd99de53cb78f83f40944de77e7bbd1a1717b6444f658c8918d5c8e7157fd',array['polar','learning','memory','verified-event'],jsonb_build_object('evidence_kind','verified-event','authority','evidence-backed'),'polar-history-import','2026-08-08T00:15:59Z'::timestamptz),
  ('event','P.O.L.A.R. brand and founder access unified','{"event":"POLAR brand and founder access unified in production architecture","commit":"46ceb753d8986e224cceaefb78ece8a087e1d442"}'::jsonb,'github','github:commit:46ceb753d8986e224cceaefb78ece8a087e1d442','constitutional',1.000,'dd2e459b5e4b3a22a7522e948917f46377cea01ae1a9ddb8006b5682eff2a2c3',array['polar','brand','founder-access','verified-event'],jsonb_build_object('evidence_kind','verified-event','authority','evidence-backed'),'polar-history-import','2026-08-08T21:24:35Z'::timestamptz),
  ('decision','Issue #13 forward-port approved','{"decision":"Forward-port approved Issue #13 enhancements onto current production architecture","authority":"founder-approved"}'::jsonb,'chat','chat:approval:issue13:2026-08-09','constitutional',1.000,'cdedcd9507618e6c71089fb36ebb92dbe59f814f3a217551dfdadc65df6e1553',array['approval','issue-13','website'],jsonb_build_object('evidence_kind','explicit-approval','authority','founder-approved','protected',true),'founder-approval-log','2026-08-10T03:56:00Z'::timestamptz),
  ('decision','P.O.L.A.R. Institutional Autonomous Memory Architecture approved','{"decision":"Use governed enterprise history and approvals as autonomous institutional memory","authority":"founder-approved"}'::jsonb,'chat','chat:approval:polar-memory:2026-08-09','constitutional',1.000,'76006bdad482b48e47ee6fb7110497370569421dd209908bb1f2587080aab50e',array['approval','polar','memory','governance'],jsonb_build_object('evidence_kind','explicit-approval','authority','founder-approved','protected',true),'founder-approval-log','2026-08-10T04:31:00Z'::timestamptz)
)
insert into public.polar_memory_records_v2(
  namespace_id,record_type,title,content_json,source_type,source_ref,
  classification,confidence,integrity_sha256,tags,metadata,created_by,created_at,updated_at
)
select root.id, seed.record_type, seed.title, seed.content_json, seed.source_type,
  seed.source_ref, seed.classification, seed.confidence, seed.integrity_sha256,
  seed.tags, seed.metadata, seed.created_by, seed.created_at, seed.created_at
from root cross join seed
on conflict (source_ref) where source_ref is not null do nothing;
