-- Migration history reconciliation: founder_security_panel
-- Source: verified production schema history plus preserved repository prerequisites.
-- Reconciled 2026-08-17; no production SQL was executed by this commit.

-- P.O.L.A.R. Founder Security & Login panel
-- Narrow SECURITY DEFINER controls authenticated by the current opaque founder session hash.

create or replace function public.polar_founder_security_status(p_session_hash text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_session_id uuid;
  v_expires_at timestamptz;
  v_passkeys jsonb;
  v_active_sessions integer;
  v_recovery integer;
begin
  select s.id, s.expires_at
    into v_session_id, v_expires_at
  from public.polar_founder_sessions s
  where s.session_hash = p_session_hash
    and s.revoked_at is null
    and s.expires_at > now()
  limit 1;

  if v_session_id is null then
    return null;
  end if;

  select count(*)::integer into v_active_sessions
  from public.polar_founder_sessions s
  where s.revoked_at is null and s.expires_at > now();

  select count(*)::integer into v_recovery
  from public.polar_founder_access_credentials c
  where c.used_at is null and c.revoked_at is null and c.expires_at > now();

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', p.id,
    'label', coalesce(p.device_label, 'Founder passkey'),
    'transports', p.transports,
    'lastUsedAt', p.last_used_at,
    'createdAt', p.created_at,
    'backupEligible', p.backup_eligible,
    'backupState', p.backup_state
  ) order by p.created_at desc), '[]'::jsonb)
  into v_passkeys
  from public.polar_founder_passkeys p
  where p.revoked_at is null;

  return jsonb_build_object(
    'activeSessions', v_active_sessions,
    'recoveryCredentials', v_recovery,
    'currentSessionExpiresAt', v_expires_at,
    'passkeys', v_passkeys
  );
end;
$$;

create or replace function public.polar_founder_revoke_passkey(
  p_session_hash text,
  p_passkey_id uuid
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  if not exists (
    select 1 from public.polar_founder_sessions s
    where s.session_hash = p_session_hash
      and s.revoked_at is null
      and s.expires_at > now()
  ) then
    return false;
  end if;

  update public.polar_founder_passkeys
  set revoked_at = now()
  where id = p_passkey_id and revoked_at is null;
  return found;
end;
$$;

create or replace function public.polar_founder_rename_passkey(
  p_session_hash text,
  p_passkey_id uuid,
  p_label text
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_label text := left(trim(coalesce(p_label, '')), 80);
begin
  if v_label = '' then return false; end if;
  if not exists (
    select 1 from public.polar_founder_sessions s
    where s.session_hash = p_session_hash
      and s.revoked_at is null
      and s.expires_at > now()
  ) then
    return false;
  end if;

  update public.polar_founder_passkeys
  set device_label = v_label
  where id = p_passkey_id and revoked_at is null;
  return found;
end;
$$;

create or replace function public.polar_founder_revoke_all_sessions(p_session_hash text)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  v_count integer;
begin
  if not exists (
    select 1 from public.polar_founder_sessions s
    where s.session_hash = p_session_hash
      and s.revoked_at is null
      and s.expires_at > now()
  ) then
    return 0;
  end if;

  update public.polar_founder_sessions
  set revoked_at = now()
  where revoked_at is null and expires_at > now();
  get diagnostics v_count = row_count;
  return v_count;
end;
$$;

revoke all on function public.polar_founder_security_status(text) from public;
revoke all on function public.polar_founder_revoke_passkey(text,uuid) from public;
revoke all on function public.polar_founder_rename_passkey(text,uuid,text) from public;
revoke all on function public.polar_founder_revoke_all_sessions(text) from public;

grant execute on function public.polar_founder_security_status(text) to anon;
grant execute on function public.polar_founder_revoke_passkey(text,uuid) to anon;
grant execute on function public.polar_founder_rename_passkey(text,uuid,text) to anon;
grant execute on function public.polar_founder_revoke_all_sessions(text) to anon;
