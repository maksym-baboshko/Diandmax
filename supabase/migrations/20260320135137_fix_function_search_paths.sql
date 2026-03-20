-- Fix Supabase Security Advisor warnings by pinning search_path
-- on existing application functions and trigger helpers.

do $$
declare
  v_identity_arguments text;
begin
  select pg_get_function_identity_arguments(p.oid)
    into v_identity_arguments
  from pg_proc p
  inner join pg_namespace n
    on n.oid = p.pronamespace
  where n.nspname = 'public'
    and p.proname = 'consume_rate_limit_window';

  if v_identity_arguments is null then
    raise exception 'function public.consume_rate_limit_window not found';
  end if;

  execute format(
    'alter function public.consume_rate_limit_window(%s) set search_path = public',
    v_identity_arguments
  );
end
$$;

do $$
declare
  v_identity_arguments text;
begin
  select pg_get_function_identity_arguments(p.oid)
    into v_identity_arguments
  from pg_proc p
  inner join pg_namespace n
    on n.oid = p.pronamespace
  where n.nspname = 'public'
    and p.proname = 'start_wheel_round_atomic';

  if v_identity_arguments is null then
    raise exception 'function public.start_wheel_round_atomic not found';
  end if;

  execute format(
    'alter function public.start_wheel_round_atomic(%s) set search_path = public, extensions',
    v_identity_arguments
  );
end
$$;

do $$
declare
  v_identity_arguments text;
begin
  select pg_get_function_identity_arguments(p.oid)
    into v_identity_arguments
  from pg_proc p
  inner join pg_namespace n
    on n.oid = p.pronamespace
  where n.nspname = 'public'
    and p.proname = 'resolve_wheel_round_atomic';

  if v_identity_arguments is null then
    raise exception 'function public.resolve_wheel_round_atomic not found';
  end if;

  execute format(
    'alter function public.resolve_wheel_round_atomic(%s) set search_path = public',
    v_identity_arguments
  );
end
$$;

alter function public.set_updated_at()
  set search_path = public;
