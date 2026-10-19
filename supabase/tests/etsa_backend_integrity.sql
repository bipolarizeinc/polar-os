-- Run as postgres against an ETSA database. All synthetic fixtures roll back.
begin;
create temporary table etsa_test_state(user_id uuid, other_user_id uuid, assessment_id uuid, founder_hash text, payload jsonb, result_id uuid);
grant all on etsa_test_state to authenticated, anon;
insert into etsa_test_state values(gen_random_uuid(),gen_random_uuid(),gen_random_uuid(),encode(extensions.gen_random_bytes(32),'hex'),null,null);
insert into auth.users(id,email) select user_id,user_id||'@example.invalid' from etsa_test_state union all select other_user_id,other_user_id||'@example.invalid' from etsa_test_state;
insert into public.etsa_profiles(user_id,full_name) select user_id,'ETSA synthetic integration test' from etsa_test_state union all select other_user_id,'Other synthetic participant' from etsa_test_state;
insert into public.polar_founder_sessions(session_hash,authority_profile,expires_at) select founder_hash,'ETSA_TEST_'||user_id,now()+interval '5 minutes' from etsa_test_state;
select set_config('request.jwt.claims',jsonb_build_object('sub',user_id,'role','authenticated')::text,true) from etsa_test_state;
set local role authenticated;
do $$
declare failed boolean := false;
begin
  begin insert into public.etsa_assessment_sessions(id,user_id) select assessment_id,user_id from etsa_test_state;
  exception when others then failed := true; end;
  if not failed then raise exception 'FAIL: session without consent accepted'; end if;
end $$;
insert into public.etsa_consent_records(user_id,notice_version) select user_id,'ETSA-DATA-1.0' from etsa_test_state;
insert into public.etsa_assessment_sessions(id,user_id) select assessment_id,user_id from etsa_test_state;
do $$
declare failed boolean := false;
begin
  begin update public.etsa_assessment_sessions set status='COMPLETE' where id=(select assessment_id from etsa_test_state);
  exception when others then failed := true; end;
  if not failed then raise exception 'FAIL: participant forged completion'; end if;
  failed := false;
  begin update public.etsa_assessment_sessions set status='REVIEW_REQUIRED' where id=(select assessment_id from etsa_test_state);
  exception when others then failed := true; end;
  if not failed then raise exception 'FAIL: incomplete assessment submitted'; end if;
  failed := false;
  begin insert into public.etsa_responses(assessment_id,user_id,question_id,answer_value) select assessment_id,user_id,1,'999' from etsa_test_state;
  exception when others then failed := true; end;
  if not failed then raise exception 'FAIL: invalid answer accepted'; end if;
end $$;
reset role;
-- The approved question rules generate valid fixture answers without real data.
insert into public.etsa_responses(assessment_id,user_id,question_id,answer_value,answer_text)
select t.assessment_id,t.user_id,r.question_id,
  case when r.kind='multi' then jsonb_build_array(r.options->0) when r.kind in ('text','challenge') then 'null'::jsonb else '0'::jsonb end,
  case when r.kind in ('text','challenge') then 'Synthetic integration answer.' else null end
from etsa_test_state t cross join etsa_private.question_rules r;
-- A second participant may not attach their own user_id to another assessment.
select set_config('request.jwt.claims',jsonb_build_object('sub',other_user_id,'role','authenticated')::text,true) from etsa_test_state;
set local role authenticated;
do $$
declare failed boolean := false;
begin
  if exists(select 1 from public.etsa_responses where assessment_id=(select assessment_id from etsa_test_state)) then raise exception 'FAIL: cross-user answers visible'; end if;
  begin insert into public.etsa_responses(assessment_id,user_id,question_id,answer_value) select assessment_id,other_user_id,1,'0' from etsa_test_state;
  exception when others then failed := true; end;
  if not failed then raise exception 'FAIL: cross-user answer written'; end if;
end $$;
reset role;
select set_config('request.jwt.claims',jsonb_build_object('sub',user_id,'role','authenticated')::text,true) from etsa_test_state;
set local role authenticated;
update public.etsa_assessment_sessions set status='REVIEW_REQUIRED' where id=(select assessment_id from etsa_test_state);
do $$
declare failed boolean := false;
begin
  begin update public.etsa_responses set answer_value='1' where assessment_id=(select assessment_id from etsa_test_state) and question_id=1;
  exception when others then failed := true; end;
  if not failed then raise exception 'FAIL: submitted answer edited'; end if;
  if (public.etsa_reviewer_operation('invalid','detail',(select assessment_id from etsa_test_state))->>'status')::int <> 401 then raise exception 'FAIL: unauthenticated reviewer accepted'; end if;
end $$;
reset role;
-- Score through the same limited RPC used by the reviewer API.
do $$
declare t record; q int; reply jsonb;
begin
  select * into t from etsa_test_state;
  reply := public.etsa_reviewer_operation(t.founder_hash,'queue');
  if reply->>'status' <> '200' or not (reply->'data'->'queue' @> jsonb_build_array(jsonb_build_object('id',t.assessment_id))) then raise exception 'FAIL: submitted assessment missing from reviewer queue'; end if;
  for q in 66..70 loop
    reply := public.etsa_reviewer_operation(t.founder_hash,'score',t.assessment_id,jsonb_build_object('questionId',q,'score',3,'notes','Synthetic test score'));
    if reply->>'status' <> '200' then raise exception 'FAIL: score RPC %',reply; end if;
  end loop;
  reply := public.etsa_reviewer_operation(t.founder_hash,'detail',t.assessment_id);
  update etsa_test_state set payload=jsonb_build_object('expected',jsonb_build_object('responses',reply->'data'->'responses','scores',reply->'data'->'scores'),
    'result',jsonb_build_object('dimensionScores','{}'::jsonb,'layerScores','{}'::jsonb,'departmentScores','{}'::jsonb,'evidenceConfidence','{}'::jsonb,'internalFlags','[]'::jsonb,'candidateReport',jsonb_build_object('fixture',true),'internalReport',jsonb_build_object('fixture',true)));
  reply := public.etsa_reviewer_operation(t.founder_hash,'finalize',t.assessment_id,'{}');
  if reply->>'status' <> '409' then raise exception 'FAIL: stale/missing snapshot not rejected %',reply; end if;
end $$;
-- Fault injection proves that a late report-write failure rolls back the result.
create function pg_temp.fail_etsa_report() returns trigger language plpgsql as $$ begin
  if new.user_id=(select user_id from etsa_test_state) then raise exception 'ETSA_TEST_INJECTED_FAILURE'; end if;
  return new;
end $$;
create trigger etsa_test_report_failure before insert on public.etsa_internal_reports for each row execute function pg_temp.fail_etsa_report();
do $$
declare t record; failed boolean := false;
begin
  select * into t from etsa_test_state;
  begin perform public.etsa_reviewer_operation(t.founder_hash,'finalize',t.assessment_id,t.payload);
  exception when others then
    if sqlerrm <> 'ETSA_TEST_INJECTED_FAILURE' then raise; end if;
    failed := true;
  end;
  if not failed then raise exception 'FAIL: fault injection did not fire'; end if;
  if exists(select 1 from public.etsa_results where assessment_id=t.assessment_id) or exists(select 1 from public.etsa_candidate_reports where user_id=t.user_id) or (select status from public.etsa_assessment_sessions where id=t.assessment_id) <> 'REVIEW_REQUIRED' then raise exception 'FAIL: partial finalization escaped transaction'; end if;
end $$;
drop trigger etsa_test_report_failure on public.etsa_internal_reports;
do $$
declare t record; reply jsonb; original_id uuid;
begin
  select * into t from etsa_test_state;
  reply := public.etsa_reviewer_operation(t.founder_hash,'finalize',t.assessment_id,t.payload);
  if reply->>'status' <> '200' then raise exception 'FAIL: finalize RPC %',reply; end if;
  original_id := (reply->'data'->>'resultId')::uuid;
  reply := public.etsa_reviewer_operation(t.founder_hash,'finalize',t.assessment_id,'{}');
  if reply->'data'->>'resultId' <> original_id::text or reply->'data'->>'alreadyFinalized' <> 'true' then raise exception 'FAIL: finalization is not idempotent'; end if;
  reply := public.etsa_reviewer_operation(t.founder_hash,'score',t.assessment_id,'{"questionId":66,"score":5}');
  if reply->>'status' <> '409' then raise exception 'FAIL: completed review mutable'; end if;
  if (select count(*) from public.etsa_candidate_reports where result_id=original_id) <> 1 or (select count(*) from public.etsa_internal_reports where result_id=original_id) <> 1 then raise exception 'FAIL: both reports not committed'; end if;
end $$;
set local role authenticated;
do $$ begin
  if (select count(*) from public.etsa_results where user_id=(select user_id from etsa_test_state)) <> 1 or (select count(*) from public.etsa_candidate_reports where user_id=(select user_id from etsa_test_state)) <> 1 then raise exception 'FAIL: first report unavailable'; end if;
  if exists(select 1 from public.etsa_internal_reports) then raise exception 'FAIL: internal report exposed'; end if;
end $$;
-- Start the second allowed assessment through participant permissions.
update etsa_test_state set assessment_id=gen_random_uuid();
insert into public.etsa_assessment_sessions(id,user_id) select assessment_id,user_id from etsa_test_state;
reset role;
insert into public.etsa_responses(assessment_id,user_id,question_id,answer_value,answer_text)
select t.assessment_id,t.user_id,r.question_id,
  case when r.kind='multi' then jsonb_build_array(r.options->0) when r.kind in ('text','challenge') then 'null'::jsonb else '0'::jsonb end,
  case when r.kind in ('text','challenge') then 'Synthetic integration answer.' else null end
from etsa_test_state t cross join etsa_private.question_rules r;
set local role authenticated;
update public.etsa_assessment_sessions set status='REVIEW_REQUIRED' where id=(select assessment_id from etsa_test_state);
reset role;
do $$
declare t record; q int; reply jsonb; payload jsonb;
begin
  select * into t from etsa_test_state;
  for q in 66..70 loop perform public.etsa_reviewer_operation(t.founder_hash,'score',t.assessment_id,jsonb_build_object('questionId',q,'score',4)); end loop;
  reply := public.etsa_reviewer_operation(t.founder_hash,'detail',t.assessment_id);
  payload := jsonb_set(t.payload,'{expected}',jsonb_build_object('responses',reply->'data'->'responses','scores',reply->'data'->'scores'));
  reply := public.etsa_reviewer_operation(t.founder_hash,'finalize',t.assessment_id,payload);
  if reply->>'status' <> '200' then raise exception 'FAIL: second finalization %',reply; end if;
  update etsa_test_state set result_id=(reply->'data'->>'resultId')::uuid;
end $$;
set local role authenticated;
do $$
declare failed boolean := false;
begin
  if exists(select 1 from public.etsa_results where id=(select result_id from etsa_test_state)) or exists(select 1 from public.etsa_candidate_reports where result_id=(select result_id from etsa_test_state)) then raise exception 'FAIL: paid report bypassed via REST permissions'; end if;
  begin insert into public.etsa_assessment_sessions(user_id) select user_id from etsa_test_state;
  exception when others then failed:=true; end;
  if not failed then raise exception 'FAIL: third assessment accepted'; end if;
end $$;
reset role;
insert into public.etsa_reassessment_entitlements(user_id,assessment_id,checkout_session_id,payment_intent_id) select user_id,assessment_id,'test_'||assessment_id,'test_pi_'||assessment_id from etsa_test_state;
set local role authenticated;
do $$ begin
  if not exists(select 1 from public.etsa_results where id=(select result_id from etsa_test_state)) or not exists(select 1 from public.etsa_candidate_reports where result_id=(select result_id from etsa_test_state)) then raise exception 'FAIL: paid report not unlocked'; end if;
end $$;
reset role;
update public.etsa_reassessment_entitlements set status='refunded' where user_id=(select user_id from etsa_test_state);
-- Simulate an out-of-order duplicate paid webhook.
update public.etsa_reassessment_entitlements set status='paid' where user_id=(select user_id from etsa_test_state);
set local role authenticated;
do $$ begin
  if exists(select 1 from public.etsa_candidate_reports where result_id=(select result_id from etsa_test_state)) then raise exception 'FAIL: refunded or replayed report remains unlocked'; end if;
end $$;
reset role;
update public.polar_founder_sessions set expires_at=now()-interval '1 second' where session_hash=(select founder_hash from etsa_test_state);
do $$ begin
  if (public.etsa_reviewer_operation((select founder_hash from etsa_test_state),'queue')->>'status') <> '401' then raise exception 'FAIL: expired founder session accepted'; end if;
end $$;
rollback;
select 'PASS: consent, ownership, validation, immutable submission, founder authorization, review, atomic rollback, idempotent reports, reassessment limit, paywall, unlock, refund, expired-session checks; fixtures rolled back' as result;
