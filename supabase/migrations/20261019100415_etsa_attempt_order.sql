-- Stable attempt identity independent of timestamp ties or ordering changes.
alter table public.etsa_assessment_sessions add column attempt_number integer;
with numbered as (
  select id,row_number() over(partition by user_id,assessment_version order by started_at,id) as n from public.etsa_assessment_sessions
) update public.etsa_assessment_sessions s set attempt_number=n.n from numbered n where n.id=s.id;
alter table public.etsa_assessment_sessions alter column attempt_number set not null;
create unique index etsa_attempt_number_unique on public.etsa_assessment_sessions(user_id,assessment_version,attempt_number);
create or replace function etsa_private.guard_participant_session()
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
    select count(*)+1 into new.attempt_number from public.etsa_assessment_sessions where user_id=auth.uid() and assessment_version='ETSA-1.0';
    new.started_at := clock_timestamp();
  else
    if row(new.id,new.user_id,new.assessment_version,new.started_at,new.completed_at,new.attempt_number) is distinct from row(old.id,old.user_id,old.assessment_version,old.started_at,old.completed_at,old.attempt_number) then raise exception 'Assessment identity and finalization fields are immutable'; end if;
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

drop policy "participants read own results" on public.etsa_results;
create policy "participants read own results" on public.etsa_results for select to authenticated using (
  (select auth.uid()) = user_id
  and exists (select 1 from public.etsa_assessment_sessions s where s.id = assessment_id and s.status = 'COMPLETE'
    and (s.attempt_number=1 or exists (select 1 from public.etsa_reassessment_entitlements e where e.assessment_id=s.id and e.user_id=(select auth.uid()) and e.status='paid')))
);
notify pgrst, 'reload schema';
