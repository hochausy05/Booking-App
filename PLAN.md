# Implementation Plan

## Strategy

Implement the minimum complete product required by the assignment.

Order work so that each stage is testable before moving to the next one.

## Task Sequence

### MP2-01 — Project Foundation

Set up:

- Expo
- React Native
- TypeScript
- Dependencies
- Source folders
- Environment conventions

Exit criteria:

- App starts successfully.
- Physical device / Expo Go can open the project.
- TypeScript has no blocking errors.

---

### MP2-02 — Navigation & UI Foundation

Implement:

- Root navigation
- Rooms screen
- Room Detail screen
- My Bookings screen
- Shared design tokens
- Basic reusable UI components

Exit criteria:

- All required screens can be navigated without dead buttons.
- UI base is consistent.

---

### MP2-03 — Room Data Foundation

Implement:

- `Room` data type
- Room dataset or remote `rooms` table
- Building, floor, capacity, equipment, image, status fields
- Seed enough rooms for useful filtering

Recommended seed size:

- 12–20 rooms

Exit criteria:

- Room data is valid and reusable across the app.

---

### MP2-04 — Room Discovery

Implement:

- `FlatList`
- Room cards
- Room photos
- Building/floor
- Capacity badge
- Equipment summary
- Available Now / Occupied state
- `React.memo` for room cards

Exit criteria:

- Room list scrolls smoothly.
- Cards render correctly.
- Selecting a room opens Room Detail.

---

### MP2-05 — Search & Multi-Filter

Implement instant filters:

- Search by room name
- Building: A / B / C / V
- Capacity: 2–20
- Equipment:
  - Projector
  - Whiteboard
  - High-spec PC
  - AC

Exit criteria:

- Filters can be combined.
- Result list updates immediately.
- Empty results are handled clearly.

---

### MP2-06 — Room Detail & Time Selector

Implement:

- Full room details
- 7-day date selector
- Fixed 2-hour slots
- Selected / available / booked slot states
- Disable already-booked slots

Exit criteria:

- User can select one valid date and one available slot.
- Booked slots cannot be selected.

---

### MP2-07 — Booking & Conflict Prevention

Implement:

- Booking creation
- Final availability validation
- Conflict handling
- Real-time booking refresh if remote realtime is used
- Clear booking success/error states

Exit criteria:

- Same room/date/slot cannot be booked twice.
- UI updates correctly after a booking.
- Conflict does not create duplicate reservations.

---

### MP2-08 — Zustand & Persistence

Implement `useBookingStore` for:

- User session/demo user
- Active filters
- Selected room/date/slot where appropriate
- Active reservations
- Cancellation actions

Persist suitable state with AsyncStorage.

Exit criteria:

- Required state survives app restart.
- Booking state remains consistent with the authoritative data source.

---

### MP2-09 — Booking Pass, QR & Notifications

Implement:

- My Bookings
- Cancel booking
- QR booking pass modal
- Local notification scheduled 15 minutes before booking
- Cancel notification when booking is cancelled

Exit criteria:

- QR reflects the selected booking.
- Notification is scheduled correctly.
- Cancel flow works and frees the slot.

---

### MP2-10 — Final QA & Submission

Perform:

- Functional regression test
- Physical-device test
- UI cleanup
- README cleanup
- Demo preparation
- Technical report preparation

Exit criteria:

- No known blocking defects.
- No dead buttons.
- No crash in required demo flow.
- All assignment requirements are demonstrable.
- GitHub setup instructions are complete.
- Demo/video and PDF report are ready.
