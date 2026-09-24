# Task Checklist

## Status Legend

- `[ ]` Not started
- `[-]` In progress / partial
- `[x]` Complete

## Mini Project 2

### [x] MP2-01 — Project Foundation

- [x] Initialize Expo + TypeScript project
- [x] Install required dependencies
- [x] Create project folder structure
- [x] Add environment conventions
- [x] Verify app starts
- [ ] Verify physical-device / Expo Go run (cần kiểm tra thủ công)

### [x] MP2-02 — Navigation & UI Foundation

- [x] Configure navigation
- [x] Create Rooms screen
- [x] Create Room Detail screen
- [x] Create My Bookings screen
- [x] Add shared design tokens
- [x] Verify navigation actions

### [x] MP2-03 — Room Data Foundation

- [x] Define Room types
- [x] Prepare 12–20 room records
- [x] Include building/floor/capacity/equipment/image
- [x] Keep availability derived later; no permanent status boolean in Room
- [x] Validate data shape

### [ ] MP2-04 — Room Discovery

- [ ] Implement `FlatList`
- [ ] Implement RoomCard
- [ ] Show room image
- [ ] Show building/floor
- [ ] Show capacity
- [ ] Show equipment
- [ ] Show Available Now / Occupied
- [ ] Memoize room card
- [ ] Verify smooth list interaction

### [ ] MP2-05 — Search & Multi-Filter

- [ ] Search by room name
- [ ] Building filter A/B/C/V
- [ ] Capacity filter 2–20
- [ ] Projector filter
- [ ] Whiteboard filter
- [ ] High-spec PC filter
- [ ] AC filter
- [ ] Support combined filters
- [ ] Handle empty results

### [ ] MP2-06 — Room Detail & Time Selector

- [ ] Show room details
- [ ] Implement 7-day date selector
- [ ] Implement fixed 2-hour slots
- [ ] Show available state
- [ ] Show selected state
- [ ] Show booked/disabled state
- [ ] Prevent selection of booked slots

### [ ] MP2-07 — Booking & Conflict Prevention

- [ ] Create booking flow
- [ ] Revalidate availability before creation
- [ ] Prevent duplicate room/date/slot booking
- [ ] Show conflict feedback
- [ ] Refresh availability after booking
- [ ] Add realtime synchronization if using Supabase
- [ ] Test two-device / competing-booking scenario if realtime is enabled

### [ ] MP2-08 — Zustand & Persistence

- [ ] Create `useBookingStore`
- [ ] Store demo user/session
- [ ] Store active filters
- [ ] Manage active reservations
- [ ] Implement cancellation action
- [ ] Persist appropriate state with AsyncStorage
- [ ] Verify restart behavior

### [ ] MP2-09 — Booking Pass, QR & Notifications

- [ ] Implement My Bookings
- [ ] Implement booking cancellation
- [ ] Implement QR modal
- [ ] Encode booking identity in QR
- [ ] Schedule notification 15 minutes before booking
- [ ] Cancel scheduled notification after booking cancellation
- [ ] Test notification behavior on physical device

### [ ] MP2-10 — Final QA & Submission

- [ ] Test complete required flow
- [ ] Test filters
- [ ] Test booked slot disabled state
- [ ] Test conflict prevention
- [ ] Test app restart persistence
- [ ] Test cancellation
- [ ] Test QR
- [ ] Test local notification
- [ ] Remove dead buttons/placeholders
- [ ] Check TypeScript/build/runtime errors
- [ ] Finalize README
- [ ] Prepare 2–3 minute demo
- [ ] Prepare 2–4 page PDF report
- [ ] Final GitHub cleanup
