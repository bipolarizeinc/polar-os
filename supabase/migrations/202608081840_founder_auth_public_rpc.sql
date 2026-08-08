-- P.O.L.A.R. Founder Auth public-RPC hotfix
-- Keeps tables default-deny while exposing only narrow SECURITY DEFINER functions
-- to Supabase's anon role for bootstrap exchange, session validation, and logout.

create or replace function public.polar_validate_founder_session(
  p_session_hash text
)
returns table(
  id uuid,
  authority_profile text,
  expires_at timestamptz,
  last_seen_at timestamptz
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id uuid;
begin
  select s.id into v_id
  from public.polar_founder_sessions s
  where s.session_hash = p_session_hash
    and s.revoked_at is null
    and s.expires_at > now()
  limit 1;

  if v_id is null then
    return;
  end if;

  update public.polar_founder_sessions
  set last_seen_at = now()
  where polar_founder_sessions.id = v_id;

  return query
  select s.id, s.authority_profile, s.expires_at, s.last_seen_at
  from public.polar_founder_sessions s
  where s.id = v_id;
end;
$$;

create or replace function public.polar_revoke_founder_session(
  p_session_hash text
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.polar_founder_sessions
  set revoked_at = now()
  where session_hash = p_session_hash
    and revoked_at is null;
  return found;
end;
$$;

-- The exchange function already performs all credential validity checks and consumes
-- the one-time credential transactionally. Expose only these three RPCs to anon.
revoke all on function public.polar_exchange_founder_bootstrap(text,text,text) from public;
revoke all on function public.polar_validate_founder_session(text) from public;
revoke all on function public.polar_revoke_founder_session(text) from public;

grant execute on function public.polar_exchange_founder_bootstrap(text,text,text) to anon;
grant execute on function public.polar_validate_founder_session(text) to anon;
grant execute on function public.polar_revoke_founder_session(text) to anon;
