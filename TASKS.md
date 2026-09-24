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

### [-] MP2-04 — Room Discovery

- [x] Implement `FlatList`
- [x] Implement RoomCard
- [x] Show room image / safe placeholder
- [x] Show building/floor
- [x] Show capacity
- [x] Show equipment
- [x] Show Available Now / Occupied
- [x] Memoize room card
- [ ] Verify room taps and Back navigation on a running app

### [x] MP2-05 — Search & Multi-Filter

- [x] Search by room name
- [x] Building filter A/B/C/V
- [x] Capacity filter 2–20
- [x] Projector filter
- [x] Whiteboard filter
- [x] High-spec PC filter
- [x] AC filter
- [x] Support combined filters
- [x] Handle empty results and clear all filters
- [ ] Verify search, filter chip interaction, empty state, and Room Detail navigation on a running app / physical device (cần kiểm tra thủ công)

### [x] MP2-06 — Room Detail & Time Selector

- [x] Show room details, equipment and availability with invalid-room fallback
- [x] Implement 7-day date selector with stable YYYY-MM-DD keys
- [x] Reuse centralized fixed 2-hour slots
- [x] Show available, selected, booked and past states
- [x] Prevent selection of booked and past slots
- [x] Reset selected slot when changing date
- [ ] Verify date/slot interaction, invalid-room fallback and Room Detail/Back navigation on a running app / physical device (cần kiểm tra thủ công)

### [x] MP2-07 — Booking & Conflict Prevention

- [x] Add typed booking contract and Supabase client/service
- [x] Add local migration for bookings, RLS policies, active-slot unique index and Realtime publication
- [x] Load active room/date bookings and remove temporary booked-slot simulation
- [x] Add booking action, loading/success/conflict/error states and availability revalidation
- [x] Apply migration to Booking-App (`cbudliffmptczqucldsd`)
- [x] Verify schema, status/time checks, RLS policies and anon access
- [x] Verify the partial unique index rejects duplicate active slots
- [x] Verify cancellation allows rebooking and unrelated room/date/slot insert succeeds
- [x] Verify Realtime publication, filtered INSERT delivery and subscription cleanup
- [x] Verify booking service persistence, conflict mapping, TypeScript, Expo config and Android bundle
- [x] Localize UI copy to Vietnamese and compact the discovery/detail layouts
- [ ] Test competing bookings and Realtime updates across two physical devices (cần kiểm tra thủ công)
- [ ] Verify Vietnamese copy, safe-area spacing, date row scrolling and bottom padding on iOS/Android (cần kiểm tra thủ công)

### [ ] MP2-08 — Zustand & Persistence

- [x] Create `useBookingStore`
- [x] Centralize and store demo user/session
- [x] Move room filters to shared store
- [x] Keep booking references in runtime-only cache
- [x] Prepare remote-first cancellation store action
- [x] Persist only demo user/session and filters with AsyncStorage
- [x] Verify store hydration, filter restore/reset, persistence allowlist and cancellation cache behavior with mocked storage
- [ ] Verify filter persistence after an actual app restart on device/emulator (cần kiểm tra thủ công)

### [ ] MP2-09 — Booking Pass, QR & Notifications

- [x] Load current demo user's bookings from Supabase; show loading, error, empty and status states; refresh on focus/pull
- [x] Cancel bookings remotely by changing status to `cancelled` with confirmation
- [x] Update Zustand booking cache after remote create, fetch and cancellation
- [x] Add QR pass modal with safe booking-only payload
- [x] Request notification permission without blocking successful bookings
- [x] Schedule valid local reminders 15 minutes before booking start and track IDs at runtime
- [x] Attempt pending reminder cancellation after remote booking cancellation
- [x] Verify service history/cancellation/rebooking, status-only RLS update, Realtime UPDATE delivery and cleanup
- [x] Verify QR payload allowlist and notification scheduling/denial/past-time paths with automated checks
- [ ] Verify My Bookings/QR/confirmation interactions and notification delivery/permission denial on iOS/Android device or emulator (cần kiểm tra thủ công)

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
