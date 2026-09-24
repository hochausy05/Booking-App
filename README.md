# Real-time Study Room Booking App

Mini Project 2 for Cross-Platform Development.

## Goal

Build a stable React Native + Expo application that allows VKU students and study groups to:

- Discover campus study rooms.
- Search and filter rooms by building, capacity, and equipment.
- View current availability.
- Select a date within the next 7 days.
- Reserve fixed 2-hour time slots.
- Prevent booking conflicts.
- View active bookings and cancel them.
- Open a booking pass with a QR code.
- Receive a local reminder 15 minutes before a booked slot.

The project intentionally avoids unnecessary features. The priority is to satisfy the assignment requirements completely and keep the demo reliable.

## Required Technology

- React Native
- Expo
- TypeScript
- React Navigation
- Zustand
- `@react-native-async-storage/async-storage`
- `expo-notifications`

A lightweight remote data source may be used for real-time booking synchronization. Supabase is the preferred option if real-time multi-device behavior is implemented.

## Main Screens

1. Rooms
2. Room Detail
3. Booking Confirmation / Success
4. My Bookings
5. Booking QR modal

## Development Documents

- `PLAN.md` — implementation plan and task order
- `TASKS.md` — task checklist
- `RULES.md` — rules for AI-assisted development
- `AGENTS.md` — fast context for coding agents
- `AI_USAGE.md` — how AI should be used in this project
- `CHANGELOG.md` — append-only Vietnamese development log
- `docs/PRD.md` — product requirements
- `docs/ARCHITECTURE.md` — technical architecture
- `docs/ENVIRONMENT.md` — environment and setup contract

## Submission Requirements

The final submission must contain:

1. Live demo URL or a 2–3 minute physical-device demo video.
2. Public GitHub repository with clean setup instructions.
3. A concise 2–4 page technical report in PDF format.

## Scope Principle

Do not add features unless they directly support the assignment requirements or improve reliability.

Out of scope by default:

- Complex authentication
- Admin dashboard
- Payment
- Campus map
- QR scanner
- Chat
- AI features
- Custom backend server
