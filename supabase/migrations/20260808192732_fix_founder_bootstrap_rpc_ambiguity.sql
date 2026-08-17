-- Migration history reconciliation: fix_founder_bootstrap_rpc_ambiguity
-- Source: verified production schema history plus preserved repository prerequisites.
-- Reconciled 2026-08-17; no production SQL was executed by this commit.

create or replace function public.polar_exchange_founder_bootstrap(
  p_credential_hash text,
  p_session_hash text,
  p_user_agent_hash text default null
)
returns table(session_id uuid, expires_at timestamptz)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_credential_id uuid;
  v_session_id uuid;
  v_expires_at timestamptz := now() + interval '8 hours';
begin
  select c.id
  into v_credential_id
  from public.polar_founder_access_credentials as c
  where c.credential_hash = p_credential_hash
    and c.used_at is null
    and c.revoked_at is null
    and c.expires_at > now()
  for update;

  if v_credential_id is null then
    return;
  end if;

  update public.polar_founder_access_credentials as c
  set used_at = now()
  where c.id = v_credential_id;

  insert into public.polar_founder_sessions(session_hash, user_agent_hash, expires_at)
  values (p_session_hash, p_user_agent_hash, v_expires_at)
  returning id into v_session_id;

  return query select v_session_id, v_expires_at;
end;
$$;

revoke all on function public.polar_exchange_founder_bootstrap(text,text,text) from public;
grant execute on function public.polar_exchange_founder_bootstrap(text,text,text) to anon;
