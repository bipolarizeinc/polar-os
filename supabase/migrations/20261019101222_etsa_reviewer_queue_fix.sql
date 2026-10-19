create or replace function etsa_private.reviewer_operation(p_session_hash text, p_operation text, p_assessment_id uuid, p_payload jsonb)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare
  founder public.polar_founder_sessions;
  s public.etsa_assessment_sessions;
  responses jsonb; scores jsonb; participant jsonb; queue jsonb;
  q integer; score_value integer; v_result_id uuid; result jsonb;
begin
  select * into founder from public.polar_founder_sessions
    where session_hash = p_session_hash and revoked_at is null and expires_at > now();
  if not found then return jsonb_build_object('status',401,'error','Founder authorization required.'); end if;
  if p_operation = 'queue' then
    select coalesce(jsonb_agg(jsonb_build_object('id',queued.id,'user_id',queued.user_id,'status',queued.status,'submitted_at',queued.submitted_at,'assessment_version',queued.assessment_version,
      'participant',case when p.user_id is null then null else jsonb_build_object('full_name',p.full_name,'preferred_name',p.preferred_name) end) order by queued.submitted_at,queued.id),'[]') into queue
      from public.etsa_assessment_sessions queued left join public.etsa_profiles p on p.user_id=queued.user_id where queued.status='REVIEW_REQUIRED';
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
    select r.id into v_result_id from public.etsa_results r where r.assessment_id=s.id;
    return jsonb_build_object('status',200,'data',jsonb_build_object('ok',true,'resultId',v_result_id,'alreadyFinalized',true));
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
    returning id into v_result_id;
  -- All four writes commit together or roll back together. COMPLETE can never
  -- become visible before both reports exist.
  insert into public.etsa_candidate_reports(result_id,user_id,report) values(v_result_id,s.user_id,result->'candidateReport')
    on conflict(result_id) do update set report=excluded.report;
  insert into public.etsa_internal_reports(result_id,user_id,report,review_status) values(v_result_id,s.user_id,result->'internalReport','COMPLETE')
    on conflict(result_id) do update set report=excluded.report,review_status=excluded.review_status;
  update public.etsa_assessment_sessions set status='COMPLETE',completed_at=now(),current_question=70 where id=s.id;
  return jsonb_build_object('status',200,'data',jsonb_build_object('ok',true,'resultId',v_result_id));
end;
$$;
