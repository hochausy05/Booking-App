# Real-time Study Room Booking App

A React Native and Expo app for VKU students to find study rooms, check availability, book fixed two-hour slots, and manage booking passes.

## Overview

This Mini Project 2 submission demonstrates room discovery and a remote-first booking flow backed by Supabase PostgreSQL. Room details and equipment come from the local catalog; Supabase is the source of truth for bookings and conflicts.

The mobile UI is in Vietnamese. This is an assignment demo with a fixed demo user and no sign-in flow. It is not ready for production use with real student accounts.

## Features

- Search by room name and combine building, capacity, and equipment filters.
- View room details, current status, and availability for the next seven days.
- Select from the four fixed two-hour slots: 07:30–09:30, 09:30–11:30, 13:00–15:00, and 15:00–17:00.
- Revalidate availability when booking and reject active slot conflicts in PostgreSQL.
- Receive booking changes through Supabase Realtime.
- View upcoming and past bookings, cancel active bookings, and open a QR booking pass.
- Schedule a local reminder 15 minutes before the slot when notification permission is available.
- Persist the demo user and room filters with Zustand and AsyncStorage.

## Tech Stack

- React Native, Expo, and TypeScript
- React Navigation
- Zustand and AsyncStorage
- Supabase PostgreSQL, Row Level Security, and Realtime
- Expo Notifications and `react-native-qrcode-svg`

## Architecture

- `src/screens/` contains the Rooms, Room Detail, and My Bookings screens.
- `src/components/` contains reusable room, filter, slot, and booking-pass UI.
- `src/services/` handles Supabase booking operations and local notifications.
- `src/store/` holds persisted demo-user/filter state and runtime booking cache.
- `src/constants/` contains the local room catalog, fixed slots, equipment labels, and theme.
- `src/utils/` contains filtering, dates, availability, and slot rules.
- `supabase/migrations/` records database schema, access policies, and function grants.

The database partial unique index is the final conflict guard. A client-only disabled slot is not treated as authoritative. AsyncStorage is only local state; it is not a booking database.

## Setup

Requirements: Node.js LTS, npm, Git, and either Expo Go on a phone or an Android/iOS emulator.

```powershell
npm install
Copy-Item .env.example .env
npm run typecheck
npx expo start
```

Scan the Expo QR code with Expo Go, or press `a`/`i` to launch an available emulator. Native notification behavior requires a supported device/emulator and notification permission. Check the platform-specific Expo requirements before building a standalone app.

## Environment

Set these client-side variables in `.env`:

```env
EXPO_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=YOUR_PUBLIC_ANON_OR_PUBLISHABLE_KEY
```

The app uses the public anon/publishable key and database policies. Never put a Supabase service-role or secret key in this app or commit `.env`. `.env.example` contains empty placeholders.

The demo currently uses the fixed user ID `demo-student`; there is no authentication. The database policies are scoped for this educational demo and must be replaced with authenticated per-user policies before production.

## Main User Flow

1. Search and filter the Rooms list.
2. Open a room, choose a date within the next seven days, and select an available fixed slot.
3. Book the slot and view the confirmation. If allowed by the device, the app schedules a reminder for 15 minutes before start.
4. Open **Lịch đặt phòng** to view bookings, show the QR pass, or cancel an active booking.

See [the 2–3 minute demo script](docs/DEMO_SCRIPT.md) for a presentation sequence.

## Screenshots

Add captured phone screenshots at these paths before submission:

- `screenshots/rooms.png` — search and combined filters.
- `screenshots/room-detail.png` — availability and fixed time slots.
- `screenshots/my-bookings-qr.png` — booking list and QR pass.

These are placeholders; no screenshots are included yet.

## Demo URL

Not published yet. Add the public 2–3 minute demo video URL here after recording: **[Demo video URL]**.

## Submission Notes

- Public GitHub repository URL: add after publishing the repository.
- Technical report: use [the concise 2–4 page outline](docs/TECHNICAL_REPORT_OUTLINE.md).
- Validation commands: `npm run typecheck`, `npx expo config --json`, `npx expo-doctor`, `git diff --check`, and `npx expo export --platform android --output-dir .expo-android-check`.
