create table public.site_visitors (
  visitor_hash text primary key check (visitor_hash ~ '^[a-f0-9]{64}$'),
  first_seen_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now()
);

create index site_visitors_last_seen_idx on public.site_visitors(last_seen_at);

alter table public.site_visitors enable row level security;

create or replace function public.register_site_visitor(p_visitor_hash text)
returns bigint
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  if p_visitor_hash is null or p_visitor_hash !~ '^[a-f0-9]{64}$' then
    raise exception 'invalid_visitor';
  end if;

  insert into public.site_visitors (visitor_hash)
  values (p_visitor_hash)
  on conflict (visitor_hash) do update set last_seen_at = now();

  return (select count(*)::bigint from public.site_visitors);
end;
$$;

revoke all on table public.site_visitors from public, anon, authenticated;
revoke all on function public.register_site_visitor(text) from public, anon, authenticated;
grant execute on function public.register_site_visitor(text) to service_role;
