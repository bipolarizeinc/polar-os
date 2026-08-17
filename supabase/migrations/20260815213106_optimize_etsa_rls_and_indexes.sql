-- Migration history reconciliation: optimize_etsa_rls_and_indexes
-- Source: verified production schema history plus preserved repository prerequisites.
-- Reconciled 2026-08-17; no production SQL was executed by this commit.

create index if not exists etsa_candidate_reports_user_id_idx on public.etsa_candidate_reports(user_id);
create index if not exists etsa_internal_reports_user_id_idx on public.etsa_internal_reports(user_id);
create index if not exists etsa_responses_user_id_idx on public.etsa_responses(user_id);
create index if not exists etsa_results_user_id_idx on public.etsa_results(user_id);
create index if not exists polar_memory_audit_log_record_id_idx on public.polar_memory_audit_log(record_id);
create index if not exists polar_memory_records_v2_supersedes_id_idx on public.polar_memory_records_v2(supersedes_id);
create index if not exists polar_memory_security_events_namespace_id_idx on public.polar_memory_security_events(namespace_id);
create index if not exists polar_oauth_states_founder_session_id_idx on public.polar_oauth_states(founder_session_id);
create index if not exists polar_webauthn_challenges_founder_session_id_idx on public.polar_webauthn_challenges(founder_session_id);

alter policy "participants create own sessions" on public.etsa_assessment_sessions with check ((select auth.uid()) = user_id);
alter policy "participants read own sessions" on public.etsa_assessment_sessions using ((select auth.uid()) = user_id);
alter policy "participants update own sessions" on public.etsa_assessment_sessions using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
alter policy "participants read own candidate reports" on public.etsa_candidate_reports using ((select auth.uid()) = user_id);
alter policy "participants create own consent" on public.etsa_consent_records with check ((select auth.uid()) = user_id);
alter policy "participants read own consent" on public.etsa_consent_records using ((select auth.uid()) = user_id);
alter policy "participants insert own profile" on public.etsa_profiles with check ((select auth.uid()) = user_id);
alter policy "participants read own profile" on public.etsa_profiles using ((select auth.uid()) = user_id);
alter policy "participants update own profile" on public.etsa_profiles using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
alter policy "participants read own responses" on public.etsa_responses using ((select auth.uid()) = user_id);
alter policy "participants save own responses" on public.etsa_responses with check ((select auth.uid()) = user_id);
alter policy "participants update own responses" on public.etsa_responses using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
alter policy "participants read own results" on public.etsa_results using ((select auth.uid()) = user_id);

alter function public.polar_memory_protect_founder_approved() set search_path = public, pg_temp;
