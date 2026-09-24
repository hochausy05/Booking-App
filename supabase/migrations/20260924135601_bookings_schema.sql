-- Demo-only anon access for the single demo user. Add real authentication and ownership policies before production.
create table public.bookings (
  id uuid primary key default gen_random_uuid(),
  room_id text not null check (room_id <> ''),
  user_id text not null check (user_id <> ''),
  booking_date date not null,
  start_time time not null,
  end_time time not null,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  constraint bookings_status_check check (status in ('active', 'cancelled', 'completed')),
  constraint bookings_time_order_check check (end_time > start_time)
);

create unique index bookings_active_room_date_slot_uidx
  on public.bookings (room_id, booking_date, start_time, end_time)
  where status = 'active';

alter table public.bookings enable row level security;

grant select, insert on public.bookings to anon;

create policy "Demo users can read active bookings"
  on public.bookings
  for select
  to anon
  using (status = 'active');

create policy "Demo student can create active bookings"
  on public.bookings
  for insert
  to anon
  with check (status = 'active' and user_id = 'demo-student');

do $$
begin
  if exists (select 1 from pg_publication where pubname = 'supabase_realtime')
     and not exists (
       select 1 from pg_publication_tables
       where pubname = 'supabase_realtime'
         and schemaname = 'public'
         and tablename = 'bookings'
     ) then
    alter publication supabase_realtime add table public.bookings;
  end if;
end
$$;
