# Product Requirements Document

## 1. Product

**Real-time Study Room Booking App**

A mobile application for VKU students and study groups to discover and reserve campus computer labs and study rooms without manually checking doors or creating booking collisions.

## 2. Primary User Goal

A student should be able to quickly answer:

- Which rooms match my needs?
- Is the room available?
- Which slot can I book?
- Has someone else already taken that slot?
- Where can I view or cancel my booking?

## 3. Required Features

### 3.1 Room Discovery

The application must display rooms using a high-performance `FlatList`.

Each visible room should provide useful metadata:

- Photo
- Room name
- Building
- Floor
- Capacity
- Equipment
- Current status:
  - Available Now
  - Occupied

Room cards should be memoized where appropriate.

### 3.2 Search & Filters

Users must be able to search/filter rooms by:

#### Building

- A
- B
- C
- V

#### Capacity

Supported range:

- 2–20 students

The UI may group capacity into useful ranges as long as the underlying room capacities remain compatible with the assignment.

#### Equipment

- Projector
- Whiteboard
- High-spec PC
- AC

Multiple filters must work together.

### 3.3 Date Selection

Users can select dates within a 7-day booking window.

### 3.4 Time Slots

Use discrete 2-hour slots.

Default:

- 07:30–09:30
- 09:30–11:30
- 13:00–15:00
- 15:00–17:00

Already-booked slots must be visibly disabled.

### 3.5 Conflict Prevention

The app must prevent a second booking for the same:

- Room
- Date
- Time slot

The creation process must verify slot availability again at booking time.

For a real-time remote implementation, other clients should receive booking changes and refresh affected slots.

### 3.6 Booking Pass

After successful booking, users must be able to view a booking pass.

The pass includes:

- Booking ID
- Room
- Date
- Time
- QR code

The QR code may encode booking data or a booking identifier.

A QR scanner is not required.

### 3.7 Global State

Use Zustand for shared application state.

The store should manage at minimum the relevant parts of:

- User/session
- Active filters
- Active reservations
- Booking cancellation actions

### 3.8 Local Persistence

Use:

`@react-native-async-storage/async-storage`

Persist only appropriate local state.

Do not use AsyncStorage as a shared multi-user booking database.

### 3.9 Notifications

Use:

`expo-notifications`

Schedule a local check-in reminder:

- 15 minutes before the booked slot begins

If the booking is cancelled, cancel its pending notification where possible.

## 4. Error States

Required flows should handle:

- No rooms found
- Loading data
- Failed data request if remote data is used
- Slot already booked
- Booking creation failure
- Notification permission denied
- Empty My Bookings list

## 5. Non-Goals

Unless explicitly requested, do not implement:

- Full authentication system
- Admin dashboard
- Payments
- Campus navigation/map
- QR scanner
- Chat
- AI
- Custom backend API server

## 6. Submission Acceptance

The final app must support a stable demo of:

Room list → search/filter → room detail → date → slot → booking → booking pass/QR → My Bookings → cancellation.

Local reminder behavior must also be demonstrable or verifiably tested.
