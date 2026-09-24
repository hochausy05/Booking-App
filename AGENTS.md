# AGENTS.md

## Project

**Real-time Study Room Booking App**

React Native + Expo mini project for booking campus study rooms.

## Primary Objective

Complete the assignment requirements with a stable, demo-ready implementation.

Prefer correctness, simplicity, and testability over extra features.

## Read Order

For most tasks, read only the files needed:

1. `AGENTS.md`
2. `TASKS.md`
3. The specific implementation files related to the current task

Read other documents only when needed:

- Product behavior: `docs/PRD.md`
- Architecture decisions: `docs/ARCHITECTURE.md`
- Environment/setup: `docs/ENVIRONMENT.md`
- Workflow rules: `RULES.md`
- Overall sequencing: `PLAN.md`

Avoid reading every Markdown file before every task.

## Required Stack

- React Native
- Expo
- TypeScript
- React Navigation
- Zustand
- AsyncStorage
- Expo Notifications

Preferred for actual multi-device real-time booking:

- Supabase PostgreSQL
- Supabase Realtime

## Core Functional Requirements

- High-performance room list using `FlatList`
- Memoized room cards
- Search
- Building filter: A / B / C / V
- Capacity filter: 2–20 students
- Equipment filters:
  - Projector
  - Whiteboard
  - High-spec PC
  - AC
- Current room status:
  - Available Now
  - Occupied
- 7-day date selector
- Fixed 2-hour booking slots
- Booked slots disabled
- Booking conflict prevention
- Booking QR pass
- Zustand global booking state
- AsyncStorage persistence
- Local notification 15 minutes before booking
- Booking cancellation

## Fixed Time Slots

Default slots:

- 07:30–09:30
- 09:30–11:30
- 13:00–15:00
- 15:00–17:00

Do not introduce arbitrary time selection unless explicitly requested.

## Data Rules

AsyncStorage is not the authoritative booking database.

If real-time synchronization is implemented, the remote database is the source of truth for room bookings.

Conflict protection must not rely only on disabled UI state. Revalidate availability when creating a booking.

## Scope Guard

Do not introduce:

- Complex auth
- Admin panel
- Payments
- Campus map
- QR scanner
- Chat
- AI
- Unnecessary backend frameworks

## Completion Rule

A task is complete only when:

- The feature works.
- The relevant error/edge cases are checked.
- The app does not crash.
- Existing completed flows still work.
- `TASKS.md` is updated.
- `CHANGELOG.md` is appended in Vietnamese.
