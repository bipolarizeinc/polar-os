-- A delayed duplicate checkout webhook must not re-enable a refunded,
-- disputed, or revoked report. A new checkout can purchase access again.
create function etsa_private.guard_entitlement_replay()
returns trigger language plpgsql security invoker set search_path = '' as $$
begin
  if old.checkout_session_id = new.checkout_session_id and old.status in ('refunded','disputed','revoked') and new.status='paid' then
    return old;
  end if;
  return new;
end;
$$;
revoke all on function etsa_private.guard_entitlement_replay() from public;
create trigger etsa_guard_entitlement_replay before update on public.etsa_reassessment_entitlements
for each row execute function etsa_private.guard_entitlement_replay();
