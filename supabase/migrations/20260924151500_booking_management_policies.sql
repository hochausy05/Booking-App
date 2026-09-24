-- Demo-only booking history and cancellation access for the existing demo user.
-- Keep the bookings schema and active-slot conflict index unchanged.
grant update (status) on public.bookings to anon;

create policy "Demo student can read own booking history"
  on public.bookings
  for select
  to anon
  using (user_id = 'demo-student');

create policy "Demo student can cancel own active bookings"
  on public.bookings
  for update
  to anon
  using (user_id = 'demo-student' and status = 'active')
  with check (user_id = 'demo-student' and status = 'cancelled');
