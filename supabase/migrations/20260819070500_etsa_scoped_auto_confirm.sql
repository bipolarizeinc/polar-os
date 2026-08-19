create or replace function public.auto_confirm_etsa_auth_user()
returns trigger
language plpgsql
security definer
set search_path = auth, public
as $$
begin
  if coalesce(new.raw_user_meta_data ->> 'bpei_auth_scope', '') = 'etsa_public' then
    new.email_confirmed_at := coalesce(new.email_confirmed_at, now());
    new.confirmed_at := coalesce(new.confirmed_at, now());
    new.raw_user_meta_data := jsonb_set(
      coalesce(new.raw_user_meta_data, '{}'::jsonb),
      '{email_verified}',
      'true'::jsonb,
      true
    );
  end if;
  return new;
end;
$$;

drop trigger if exists trg_auto_confirm_etsa_auth_user on auth.users;
create trigger trg_auto_confirm_etsa_auth_user
before insert or update of raw_user_meta_data on auth.users
for each row
execute function public.auto_confirm_etsa_auth_user();

revoke all on function public.auto_confirm_etsa_auth_user() from public, anon, authenticated;
grant execute on function public.auto_confirm_etsa_auth_user() to supabase_auth_admin;
