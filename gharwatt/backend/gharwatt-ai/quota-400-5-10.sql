-- GharWatt AI only: 400/day total, 5/day per anonymous browser,
-- and max 10 accepted requests in ANY rolling 60-second period site-wide.
create table if not exists public.gharwatt_ai_recent_requests (
  request_id bigint generated always as identity primary key,
  requested_at timestamptz not null default clock_timestamp()
);
create index if not exists gharwatt_ai_recent_requests_time_idx
  on public.gharwatt_ai_recent_requests (requested_at);
alter table public.gharwatt_ai_recent_requests enable row level security;
revoke all on public.gharwatt_ai_recent_requests from public, anon, authenticated;
grant select, insert, delete on public.gharwatt_ai_recent_requests to service_role;
grant usage, select on sequence public.gharwatt_ai_recent_requests_request_id_seq to service_role;
comment on table public.gharwatt_ai_recent_requests is
  'Transient GharWatt AI request timestamps, automatically cleared after 2 minutes; no visitor or message data.';

create or replace function public.gharwatt_ai_reserve_request(
  p_visitor_hash text,
  p_per_visitor integer default 5,
  p_global integer default 400
) returns jsonb
language plpgsql
security invoker
set search_path = public, pg_temp
as $quota$
declare
  tick timestamptz;
  d date;
  visitor_count integer := 0;
  global_count integer := 0;
  recent_count integer := 0;
  oldest_tick timestamptz;
  retry_secs integer := 60;
begin
  if p_visitor_hash is null or p_visitor_hash !~ '^[a-f0-9]{64}$'
     or p_per_visitor not between 1 and 5
     or p_global not between 1 and 400 then
    return jsonb_build_object('ok',false,'code','INVALID_QUOTA_ARGS');
  end if;
  -- One global transaction-scoped lock serializes all GharWatt reservations,
  -- including concurrent requests that span midnight UTC.
  perform pg_advisory_xact_lock(hashtext('gharwatt_ai_shared_rate_v2'));
  tick := clock_timestamp();
  d := (tick at time zone 'UTC')::date;
  select request_count into global_count
    from public.gharwatt_ai_request_quota
    where utc_day=d and visitor_hash='__global__';
  if coalesce(global_count,0) >= p_global then
    return jsonb_build_object('ok',false,'code','GLOBAL_LIMIT');
  end if;
  select request_count into visitor_count
    from public.gharwatt_ai_request_quota
    where utc_day=d and visitor_hash=p_visitor_hash;
  if coalesce(visitor_count,0) >= p_per_visitor then
    return jsonb_build_object('ok',false,'code','VISITOR_LIMIT');
  end if;
  delete from public.gharwatt_ai_recent_requests
    where requested_at < tick - interval '120 seconds';
  select count(*)::integer, min(requested_at)
    into recent_count, oldest_tick
    from public.gharwatt_ai_recent_requests
    where requested_at > tick - interval '60 seconds';
  if recent_count >= 10 then
    retry_secs := greatest(1,least(60,
      ceil(extract(epoch from (oldest_tick + interval '60 seconds' - tick)))::integer));
    return jsonb_build_object('ok',false,'code','MINUTE_LIMIT',
      'retry_after_seconds',retry_secs);
  end if;
  insert into public.gharwatt_ai_request_quota (utc_day,visitor_hash,request_count)
    values (d,'__global__',1)
    on conflict (utc_day,visitor_hash) do update
      set request_count=public.gharwatt_ai_request_quota.request_count+1;
  insert into public.gharwatt_ai_request_quota (utc_day,visitor_hash,request_count)
    values (d,p_visitor_hash,1)
    on conflict (utc_day,visitor_hash) do update
      set request_count=public.gharwatt_ai_request_quota.request_count+1;
  insert into public.gharwatt_ai_recent_requests(requested_at) values (tick);
  return jsonb_build_object('ok',true,
    'remaining',p_per_visitor-coalesce(visitor_count,0)-1);
end;
$quota$;
revoke all on function public.gharwatt_ai_reserve_request(text,integer,integer)
  from public, anon, authenticated;
grant execute on function public.gharwatt_ai_reserve_request(text,integer,integer)
  to service_role;
comment on function public.gharwatt_ai_reserve_request(text,integer,integer) is
  'Atomically enforce GharWatt AI browser/day, site/day, and rolling site-minute caps. Requires service_role; never invoke directly from public clients.';
