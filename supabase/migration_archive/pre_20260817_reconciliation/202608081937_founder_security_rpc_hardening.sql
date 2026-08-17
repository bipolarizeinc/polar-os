-- Restrict founder auth/security RPCs to the narrow anon/publishable-key path.
revoke execute on function public.polar_exchange_founder_bootstrap(text,text,text) from authenticated;
revoke execute on function public.polar_validate_founder_session(text) from authenticated;
revoke execute on function public.polar_revoke_founder_session(text) from authenticated;
revoke execute on function public.polar_founder_security_status(text) from authenticated;
revoke execute on function public.polar_founder_revoke_passkey(text,uuid) from authenticated;
revoke execute on function public.polar_founder_rename_passkey(text,uuid,text) from authenticated;
revoke execute on function public.polar_founder_revoke_all_sessions(text) from authenticated;
