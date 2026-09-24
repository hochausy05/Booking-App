-- Supabase default privileges had granted broad table access to API roles.
-- Explicitly restore the demo-only permissions expected by this app.
revoke all privileges on table public.bookings from anon, authenticated;

grant select, insert on public.bookings to anon;
grant update (status) on public.bookings to anon;
