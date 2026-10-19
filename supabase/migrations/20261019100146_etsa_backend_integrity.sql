-- Enforce the assessment contract at the Data API boundary as well as Next.js.
-- Reviewer operations use the existing opaque founder-session credential; no
-- service-role key is needed for participant reads or founder review.
create schema if not exists etsa_private;
revoke all on schema etsa_private from public;
grant usage on schema etsa_private to anon, authenticated;

create table etsa_private.question_rules (
  question_id integer primary key,
  kind text not null,
  options jsonb not null,
  max_words integer
);
insert into etsa_private.question_rules(question_id,kind,options,max_words) values
(1,'rating','["1", "2", "3", "4", "5"]'::jsonb,null),
(2,'rating','["1", "2", "3", "4", "5"]'::jsonb,null),
(3,'rating','["1", "2", "3", "4", "5"]'::jsonb,null),
(4,'rating','["1", "2", "3", "4", "5"]'::jsonb,null),
(5,'rating','["1", "2", "3", "4", "5"]'::jsonb,null),
(6,'rating','["1", "2", "3", "4", "5"]'::jsonb,null),
(7,'rating','["1", "2", "3", "4", "5"]'::jsonb,null),
(8,'rating','["1", "2", "3", "4", "5"]'::jsonb,null),
(9,'rating','["1", "2", "3", "4", "5"]'::jsonb,null),
(10,'rating','["1", "2", "3", "4", "5"]'::jsonb,null),
(11,'multi','["AI assistants/generative AI", "Office/productivity software", "Graphic design", "Video/audio production", "Website development", "Coding/software development", "Data analysis", "CRM/customer management", "Project management", "Accounting/financial tools", "Cybersecurity", "Social media/marketing platforms", "Document production", "Automation/no-code tools", "None", "Other"]'::jsonb,null),
(12,'single','["Primarily academic/personal learning", "Entry-level or limited professional experience", "Multiple completed professional projects", "Several years of demonstrated professional responsibility", "Advanced/specialized professional experience", "Leadership or enterprise-level responsibility"]'::jsonb,null),
(13,'text','[]'::jsonb,null),
(14,'text','[]'::jsonb,null),
(15,'text','[]'::jsonb,null),
(16,'single','["Finish their work myself.", "Immediately escalate the person to management.", "Identify the blocker, establish ownership, and create a recovery plan.", "Wait to see whether they recover before intervening.", "Reassign their responsibilities immediately."]'::jsonb,null),
(17,'single','["Wait for detailed instructions.", "Research it, develop an approach, and verify major assumptions.", "Immediately improvise a solution.", "Ask someone else to complete it.", "Decline because it is outside my experience."]'::jsonb,null),
(18,'single','["Tell them the idea won''t work.", "Build exactly what they requested.", "Ask questions until the underlying objective becomes clear.", "Refer them elsewhere.", "Replace their idea with what I think is better."]'::jsonb,null),
(19,'single','["Keep using it because it is established.", "Quietly use my own process.", "Document the problem and propose an improved process.", "Complain about it to coworkers.", "Replace it immediately without approval."]'::jsonb,null),
(20,'single','["Follow the highest-ranking person''s instruction.", "Choose whichever instruction I prefer.", "Surface the conflict and clarify the controlling objective.", "Do nothing until they resolve it themselves.", "Attempt both simultaneously."]'::jsonb,null),
(21,'single','["Hide the problem and work longer.", "Miss the deadline and explain afterward.", "Raise the risk early and propose scope, resource, or timing alternatives.", "Blame the original estimate.", "Sacrifice quality to meet the date."]'::jsonb,null),
(22,'single','["Defend every decision.", "Accept every suggestion automatically.", "Separate useful feedback from preference and revise accordingly.", "Lose confidence in the work.", "Ignore the criticism."]'::jsonb,null),
(23,'single','["Ignore it.", "Publicly correct them.", "Verify the issue and raise it respectfully with evidence.", "Quietly fix it without telling anyone.", "Tell coworkers first."]'::jsonb,null),
(24,'single','["Start whichever seems easiest.", "Work on all of them simultaneously.", "Rank them by consequence, dependency, deadline, and effort.", "Ask someone else to prioritize everything.", "Choose the most interesting task."]'::jsonb,null),
(25,'single','["Always complete the task for them.", "Stop helping.", "Help identify the recurring knowledge gap and teach the process.", "Immediately report them.", "Continue answering individual questions indefinitely."]'::jsonb,null),
(26,'single','["Say no.", "Promise it anyway.", "Determine the underlying need and identify an appropriate solution or escalation.", "Ignore the request.", "Create an entirely new service immediately."]'::jsonb,null),
(27,'single','["Use the first source.", "Use whichever supports my position.", "Compare methodology, authority, date, context, and supporting evidence.", "Average their conclusions.", "Stop researching."]'::jsonb,null),
(28,'single','["Keep arguing until accepted.", "Abandon it permanently.", "Understand the objection, preserve the useful work, and revisit if evidence changes.", "Implement it secretly.", "Take the rejection personally."]'::jsonb,null),
(29,'single','["Wait until someone writes one.", "Improvise without documenting anything.", "Establish a provisional workflow, test it, and document what works.", "Copy another company''s process exactly.", "Avoid the project."]'::jsonb,null),
(30,'single','["Claim primary credit.", "Say nothing.", "Document the contribution while recognizing the team''s work.", "Let someone senior take credit.", "Use the success to criticize weaker teammates."]'::jsonb,null),
(31,'single','["Try to win the argument.", "Give in.", "Compare objectives, assumptions, evidence, and tradeoffs.", "Avoid working with them.", "Ask management to decide immediately."]'::jsonb,null),
(32,'single','["Continue because you''ve already invested time.", "Hide the mistake.", "Reassess, change course, and communicate material consequences.", "Start completely over without analysis.", "Ask someone else to take over."]'::jsonb,null),
(33,'single','["Accept its output as correct.", "Refuse to use AI.", "Use AI as a tool while independently verifying important outputs.", "Have AI perform the entire assignment without review.", "Only use AI for formatting."]'::jsonb,null),
(34,'single','["Accept it as part of the job.", "Rush through it.", "Investigate templates, automation, delegation, or process redesign.", "Stop doing it.", "Ask someone else to handle it."]'::jsonb,null),
(35,'single','["Attempt everything without changing anything.", "Refuse additional responsibility.", "Reassess priorities, resources, systems, and capacity.", "Work indefinitely longer hours.", "Immediately delegate everything new."]'::jsonb,null),
(36,'single','["Emails", "Presentation", "Website outage", "Filing", "Whichever arrived first"]'::jsonb,null),
(37,'single','["Employee attendance", "Checkout/payment funnel", "Logo design", "Social follower count", "Office expenses"]'::jsonb,null),
(38,'single','["25", "100", "125", "400", "425"]'::jsonb,null),
(39,'single','["Marketing", "Payment processing", "Social media", "Graphic design", "Analytics"]'::jsonb,null),
(40,'single','["The founder likes it.", "Competitors offer something similar.", "Social media users say it sounds cool.", "Customers repeatedly pay for or commit to the solution.", "The service has a strong logo."]'::jsonb,null),
(41,'single','["$150", "$350", "$500", "$650", "Cannot be determined"]'::jsonb,null),
(42,'single','["Product replacement", "Onboarding experience", "Pricing increase", "Employee uniforms", "Brand colors"]'::jsonb,null),
(43,'single','["Complete everything free.", "Refuse all future changes.", "Document requested changes and evaluate impact on scope, price, and timeline.", "Ignore them.", "Cancel the project."]'::jsonb,null),
(44,'single','["Anonymous forum comment", "Influencer video", "Official government/regulatory publication", "Competitor advertisement", "Unsourced AI response"]'::jsonb,null),
(45,'single','["Buy software.", "Understand and improve the workflow.", "Hire more people.", "Automate every step immediately.", "Eliminate documentation."]'::jsonb,null),
(46,'single','["Divide resources equally.", "Prioritize the highest-value critical project while protecting essential commitments.", "Complete the smallest project first.", "Randomly assign resources.", "Delay all three."]'::jsonb,null),
(47,'single','["Guess quickly.", "Delay forever.", "Identify the minimum critical information needed before committing.", "Follow intuition exclusively.", "Copy a previous decision."]'::jsonb,null),
(48,'single','["Assume experienced people don''t make mistakes.", "Review only when a customer complains.", "Establish defined validation/checkpoints appropriate to the risk.", "Add more meetings.", "Make one person responsible for everything."]'::jsonb,null),
(49,'single','["Immediately delete it.", "Keep it forever.", "Examine usage, customer value, dependencies, and opportunity cost.", "Increase marketing for it automatically.", "Double development resources."]'::jsonb,null),
(50,'single','["Yes, because the department became faster.", "No, because local optimization harmed total-system performance.", "Yes, because speed is always the priority.", "Cannot ever be evaluated.", "Only if employees preferred it."]'::jsonb,null),
(51,'rating','["1", "2", "3", "4", "5"]'::jsonb,null),
(52,'rating','["1", "2", "3", "4", "5"]'::jsonb,null),
(53,'rating','["1", "2", "3", "4", "5"]'::jsonb,null),
(54,'rating','["1", "2", "3", "4", "5"]'::jsonb,null),
(55,'rating','["1", "2", "3", "4", "5"]'::jsonb,null),
(56,'rating','["1", "2", "3", "4", "5"]'::jsonb,null),
(57,'rating','["1", "2", "3", "4", "5"]'::jsonb,null),
(58,'rating','["1", "2", "3", "4", "5"]'::jsonb,null),
(59,'rating','["1", "2", "3", "4", "5"]'::jsonb,null),
(60,'rating','["1", "2", "3", "4", "5"]'::jsonb,null),
(61,'rating','["1", "2", "3", "4", "5"]'::jsonb,null),
(62,'rating','["1", "2", "3", "4", "5"]'::jsonb,null),
(63,'rating','["1", "2", "3", "4", "5"]'::jsonb,null),
(64,'rating','["1", "2", "3", "4", "5"]'::jsonb,null),
(65,'rating','["1", "2", "3", "4", "5"]'::jsonb,null),
(66,'challenge','[]'::jsonb,null),
(67,'challenge','[]'::jsonb,100),
(68,'challenge','[]'::jsonb,null),
(69,'challenge','[]'::jsonb,null),
(70,'challenge','[]'::jsonb,150);

create function etsa_private.valid_answer(q integer, v jsonb, t text)
returns boolean language plpgsql stable security definer set search_path = '' as $$
declare rule etsa_private.question_rules; n integer;
begin
  select * into rule from etsa_private.question_rules where question_id = q;
  if not found then return false; end if;
  if rule.kind in ('text','challenge') then
    return coalesce(length(btrim(t)) > 0 and length(t) <= 20000
      and (rule.max_words is null or cardinality(regexp_split_to_array(btrim(t), E'\\s+')) <= rule.max_words), false);
  elsif rule.kind = 'multi' then
    if jsonb_typeof(v) is distinct from 'array' then return false; end if;
    if jsonb_array_length(v) = 0 then return false; end if;
    return not exists (select 1 from jsonb_array_elements(v) e where jsonb_typeof(e) <> 'string' or not rule.options @> jsonb_build_array(e))
      and (select count(distinct e) from jsonb_array_elements(v) e) = jsonb_array_length(v);
  end if;
  if jsonb_typeof(v) is distinct from 'number' or v::text !~ '^[0-9]+$' then return false; end if;
  if length(v::text) > 3 then return false; end if;
  n := v::text::integer;
  return n >= 0 and n < jsonb_array_length(rule.options);
end;
$$;
revoke all on function etsa_private.valid_answer(integer,jsonb,text) from public;

create function etsa_private.guard_participant_session()
returns trigger language plpgsql security invoker set search_path = '' as $$
begin
  -- Only the Data API participant role is constrained here. Trusted reviewer
  -- finalization runs within the private transaction function as its owner.
  if current_user <> 'authenticated' then return new; end if;
  if new.user_id is distinct from auth.uid() then raise exception 'Assessment owner mismatch'; end if;
  if tg_op = 'INSERT' then
    -- Serialize concurrent starts, including attempts made directly through REST.
    perform 1 from public.etsa_profiles where user_id = auth.uid() for update;
    if not found then raise exception 'Participant profile required'; end if;
    if new.assessment_version <> 'ETSA-1.0' or new.status <> 'CREATED' or new.current_question <> 1
      or new.completed_at is not null or new.submitted_at is not null then raise exception 'Invalid initial assessment state'; end if;
    if not exists(select 1 from public.etsa_consent_records where user_id = auth.uid() and notice_version = 'ETSA-DATA-1.0' and assessment_version = 'ETSA-1.0') then raise exception 'Assessment consent required'; end if;
    if (select count(*) from public.etsa_assessment_sessions where user_id = auth.uid() and assessment_version = 'ETSA-1.0') >= 2 then raise exception 'Assessment attempt limit reached'; end if;
    if exists(select 1 from public.etsa_assessment_sessions where user_id = auth.uid() and assessment_version = 'ETSA-1.0' and status <> 'COMPLETE') then raise exception 'Finalize the current assessment first'; end if;
    new.started_at := now();
  else
    if row(new.id,new.user_id,new.assessment_version,new.started_at,new.completed_at) is distinct from row(old.id,old.user_id,old.assessment_version,old.started_at,old.completed_at) then raise exception 'Assessment identity and finalization fields are immutable'; end if;
    if old.status not in ('CREATED','IN_PROGRESS','PAUSED') or new.status not in ('CREATED','IN_PROGRESS','PAUSED','REVIEW_REQUIRED') then raise exception 'Assessment is locked for review'; end if;
    if new.status = 'REVIEW_REQUIRED' then
      if (select count(*) from public.etsa_responses r where r.assessment_id = new.id and r.user_id = auth.uid() and etsa_private.valid_answer(r.question_id,r.answer_value,r.answer_text)) <> 70 then raise exception 'All 70 valid answers are required'; end if;
      new.submitted_at := now();
      new.current_question := 70;
    else
      new.submitted_at := old.submitted_at;
    end if;
  end if;
  return new;
end;
$$;
revoke all on function etsa_private.guard_participant_session() from public;
grant execute on function etsa_private.valid_answer(integer,jsonb,text) to authenticated;
create trigger etsa_guard_participant_session before insert or update on public.etsa_assessment_sessions
for each row execute function etsa_private.guard_participant_session();

create function etsa_private.guard_response()
returns trigger language plpgsql security definer set search_path = '' as $$
declare s public.etsa_assessment_sessions;
begin
  select * into s from public.etsa_assessment_sessions where id = new.assessment_id for update;
  if not found or s.user_id <> new.user_id then raise exception 'Assessment owner mismatch'; end if;
  if s.status not in ('CREATED','IN_PROGRESS','PAUSED') then raise exception 'Submitted responses are immutable'; end if;
  if tg_op = 'UPDATE' and row(new.id,new.assessment_id,new.user_id,new.question_id) is distinct from row(old.id,old.assessment_id,old.user_id,old.question_id) then raise exception 'Response identity is immutable'; end if;
  if not etsa_private.valid_answer(new.question_id,new.answer_value,new.answer_text) then raise exception 'Invalid assessment answer'; end if;
  new.saved_at := coalesce(old.saved_at,now());
  new.last_modified_at := now();
  return new;
end;
$$;
revoke all on function etsa_private.guard_response() from public;
create trigger etsa_guard_response before insert or update on public.etsa_responses
for each row execute function etsa_private.guard_response();

create function etsa_private.guard_review_score()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  perform 1 from public.etsa_assessment_sessions where id = new.assessment_id and status = 'REVIEW_REQUIRED' for update;
  if not found then raise exception 'Only submitted assessments can be reviewed'; end if;
  return new;
end;
$$;
revoke all on function etsa_private.guard_review_score() from public;
create trigger etsa_guard_review_score before insert or update on public.etsa_review_scores
for each row execute function etsa_private.guard_review_score();

-- Database policies enforce the paid unlock even if a client skips Next.js.
drop policy "participants read own results" on public.etsa_results;
create policy "participants read own results" on public.etsa_results for select to authenticated using (
  (select auth.uid()) = user_id
  and exists (select 1 from public.etsa_assessment_sessions s where s.id = assessment_id and s.status = 'COMPLETE'
    and (not exists (select 1 from public.etsa_assessment_sessions earlier where earlier.user_id = s.user_id and earlier.assessment_version = s.assessment_version and (earlier.started_at,earlier.id) < (s.started_at,s.id))
      or exists (select 1 from public.etsa_reassessment_entitlements e where e.assessment_id = s.id and e.user_id = (select auth.uid()) and e.status = 'paid')))
);
drop policy "participants read own candidate reports" on public.etsa_candidate_reports;
create policy "participants read own candidate reports" on public.etsa_candidate_reports for select to authenticated using (
  (select auth.uid()) = user_id and exists (select 1 from public.etsa_results r where r.id = result_id)
);

-- Private privileged implementation. Every operation authenticates the existing
-- high-entropy founder session, including expiry/revocation; user metadata is
-- never used to authorize review. The public entrypoint is SECURITY INVOKER.
create function etsa_private.reviewer_operation(p_session_hash text, p_operation text, p_assessment_id uuid, p_payload jsonb)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare
  founder public.polar_founder_sessions;
  s public.etsa_assessment_sessions;
  responses jsonb; scores jsonb; participant jsonb; queue jsonb;
  q integer; score_value integer; result_id uuid; result jsonb;
begin
  select * into founder from public.polar_founder_sessions
    where session_hash = p_session_hash and revoked_at is null and expires_at > now();
  if not found then return jsonb_build_object('status',401,'error','Founder authorization required.'); end if;
  if p_operation = 'queue' then
    select coalesce(jsonb_agg(jsonb_build_object('id',s.id,'user_id',s.user_id,'status',s.status,'submitted_at',s.submitted_at,'assessment_version',s.assessment_version,
      'participant',case when p.user_id is null then null else jsonb_build_object('full_name',p.full_name,'preferred_name',p.preferred_name) end) order by s.submitted_at,s.id),'[]') into queue
      from public.etsa_assessment_sessions s left join public.etsa_profiles p on p.user_id=s.user_id where s.status='REVIEW_REQUIRED';
    return jsonb_build_object('status',200,'data',jsonb_build_object('queue',queue));
  end if;
  select * into s from public.etsa_assessment_sessions where id = p_assessment_id for update;
  if not found then return jsonb_build_object('status',404,'error','Assessment not found.'); end if;
  if p_operation = 'score' then
    if s.status <> 'REVIEW_REQUIRED' then return jsonb_build_object('status',409,'error','Only assessments awaiting review can be scored.'); end if;
    if jsonb_typeof(p_payload->'questionId') is distinct from 'number' or jsonb_typeof(p_payload->'score') is distinct from 'number'
      or coalesce(p_payload->>'questionId','') !~ '^(66|67|68|69|70)$' or coalesce(p_payload->>'score','') !~ '^[0-5]$'
      or length(coalesce(p_payload->>'notes','')) > 10000 then return jsonb_build_object('status',400,'error','Invalid review score.'); end if;
    q := (p_payload->>'questionId')::integer; score_value := (p_payload->>'score')::integer;
    insert into public.etsa_review_scores(assessment_id,question_id,reviewer_id,score,notes)
      values(s.id,q,founder.authority_profile,score_value,p_payload->>'notes')
      on conflict(assessment_id,question_id,reviewer_id) do update set score=excluded.score,notes=excluded.notes;
    return jsonb_build_object('status',200,'data',jsonb_build_object('ok',true));
  end if;
  select coalesce(jsonb_agg(jsonb_build_object('question_id',r.question_id,'answer_value',r.answer_value,'answer_text',r.answer_text) order by r.question_id),'[]') into responses from public.etsa_responses r where r.assessment_id=s.id;
  select coalesce(jsonb_agg(jsonb_build_object('question_id',r.question_id,'score',r.score,'notes',r.notes) order by r.question_id),'[]') into scores from public.etsa_review_scores r where r.assessment_id=s.id and r.reviewer_id=founder.authority_profile;
  if p_operation = 'detail' then
    select jsonb_build_object('full_name',p.full_name,'preferred_name',p.preferred_name) into participant from public.etsa_profiles p where p.user_id=s.user_id;
    return jsonb_build_object('status',200,'data',jsonb_build_object('session',to_jsonb(s),'participant',participant,'responses',responses,'scores',scores));
  end if;
  if p_operation <> 'finalize' then return jsonb_build_object('status',400,'error','Unsupported reviewer operation.'); end if;
  -- Retried requests return the original immutable record.
  if s.status = 'COMPLETE' then
    select r.id into result_id from public.etsa_results r where r.assessment_id=s.id;
    return jsonb_build_object('status',200,'data',jsonb_build_object('ok',true,'resultId',result_id,'alreadyFinalized',true));
  end if;
  if s.status <> 'REVIEW_REQUIRED' then return jsonb_build_object('status',409,'error','Only submitted assessments can be finalized.'); end if;
  if jsonb_array_length(responses) <> 70 or exists(select 1 from public.etsa_responses r where r.assessment_id=s.id and not etsa_private.valid_answer(r.question_id,r.answer_value,r.answer_text)) or jsonb_array_length(scores) <> 5 then
    return jsonb_build_object('status',400,'error','All 70 answers and five applied-challenge scores are required.');
  end if;
  if p_payload->'expected' is distinct from jsonb_build_object('responses',responses,'scores',scores) then
    return jsonb_build_object('status',409,'error','Review changed during finalization. Reload the review and retry.');
  end if;
  result := p_payload->'result';
  if jsonb_typeof(result->'candidateReport') is distinct from 'object' or jsonb_typeof(result->'internalReport') is distinct from 'object' or jsonb_typeof(result->'dimensionScores') is distinct from 'object' then
    return jsonb_build_object('status',400,'error','A scored result and both reports are required.');
  end if;
  insert into public.etsa_results(assessment_id,user_id,assessment_version,scoring_engine_version,dimension_scores,layer_scores,department_scores,evidence_confidence,readiness_level,primary_archetype,development_priority,internal_flags)
    values(s.id,s.user_id,s.assessment_version,'ETSA-1.0',result->'dimensionScores',result->'layerScores',result->'departmentScores',result->'evidenceConfidence',result->>'readiness',result->>'archetype',result->>'developmentPriority',result->'internalFlags')
    on conflict(assessment_id) do update set dimension_scores=excluded.dimension_scores,layer_scores=excluded.layer_scores,department_scores=excluded.department_scores,evidence_confidence=excluded.evidence_confidence,readiness_level=excluded.readiness_level,primary_archetype=excluded.primary_archetype,development_priority=excluded.development_priority,internal_flags=excluded.internal_flags
    returning id into result_id;
  -- All four writes commit together or roll back together. COMPLETE can never
  -- become visible before both reports exist.
  insert into public.etsa_candidate_reports(result_id,user_id,report) values(result_id,s.user_id,result->'candidateReport')
    on conflict(result_id) do update set report=excluded.report;
  insert into public.etsa_internal_reports(result_id,user_id,report,review_status) values(result_id,s.user_id,result->'internalReport','COMPLETE')
    on conflict(result_id) do update set report=excluded.report,review_status=excluded.review_status;
  update public.etsa_assessment_sessions set status='COMPLETE',completed_at=now(),current_question=70 where id=s.id;
  return jsonb_build_object('status',200,'data',jsonb_build_object('ok',true,'resultId',result_id));
end;
$$;
revoke all on function etsa_private.reviewer_operation(text,text,uuid,jsonb) from public;
grant execute on function etsa_private.reviewer_operation(text,text,uuid,jsonb) to anon, authenticated;
create function public.etsa_reviewer_operation(p_session_hash text,p_operation text,p_assessment_id uuid default null,p_payload jsonb default '{}'::jsonb)
returns jsonb language sql security invoker set search_path = '' as $$
  select etsa_private.reviewer_operation(p_session_hash,p_operation,p_assessment_id,p_payload);
$$;
revoke all on function public.etsa_reviewer_operation(text,text,uuid,jsonb) from public;
grant execute on function public.etsa_reviewer_operation(text,text,uuid,jsonb) to anon, authenticated;
notify pgrst, 'reload schema';
