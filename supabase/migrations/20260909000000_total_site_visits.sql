create table public.site_visit_counter (
  singleton boolean primary key default true check (singleton),
  total_visits bigint not null default 0 check (total_visits >= 0),
  updated_at timestamptz not null default now()
);

insert into public.site_visit_counter (singleton, total_visits)
select true, count(*)::bigint from public.site_visitors
on conflict (singleton) do nothing;

alter table public.site_visit_counter enable row level security;

create or replace function public.register_site_visit()
returns bigint
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  current_total bigint;
begin
  insert into public.site_visit_counter (singleton, total_visits)
  values (true, 1)
  on conflict (singleton) do update
    set total_visits = site_visit_counter.total_visits + 1,
        updated_at = now()
  returning total_visits into current_total;

  return current_total;
end;
$$;

revoke all on table public.site_visit_counter from public, anon, authenticated;
revoke all on function public.register_site_visit() from public, anon, authenticated;
grant execute on function public.register_site_visit() to service_role;
