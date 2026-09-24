# Technical Report Outline (2–4 Pages)

Suggested length: three pages plus references if required by the course. Keep screenshots cropped to the app and avoid including credentials or personal data.

## Page 1 — Problem, Scope, and User Experience

- **Project:** Real-time Study Room Booking App; target users are VKU students and study groups.
- **Problem:** students need to find a suitable room and know whether a slot is already taken.
- **Scope:** room discovery, search/filter, availability, fixed two-hour bookings, cancellation, QR pass, persistence, and local reminders. State that authentication and production multi-user identity are out of scope.
- **Evidence:** add `screenshots/rooms.png` and `screenshots/room-detail.png` with short captions.

## Page 2 — Architecture and Conflict Safety

- **Client:** React Native + Expo + TypeScript; React Navigation; Zustand with an AsyncStorage allowlist for demo-user/filter state.
- **Data:** local room catalog; Supabase PostgreSQL is authoritative for bookings; Supabase Realtime refreshes affected room/date availability.
- **Conflict guard:** describe availability revalidation plus the partial unique index on `(room_id, booking_date, start_time, end_time)` for active rows. Explain that cancellation frees the slot while preserving booking history.
- **Access control:** summarize RLS and narrow client grants. Explain that `demo-student` is a fixed demo identity, not production authentication.
- **Evidence:** add a small booking-flow diagram or schema excerpt and `screenshots/my-bookings-qr.png`.

## Page 3 — Verification, Results, and Limitations

- **Automated checks:** list the actual final TypeScript, Expo config/doctor, Android bundle, database conflict/rebooking, RLS/index, and Realtime results. Include only checks actually executed.
- **Security:** report the Supabase Security Advisor result after revoking public execute on the unused `rls_auto_enable()` RPC; note that its database event trigger remains enabled. Include the production dependency audit result and any open moderate advisory accurately.
- **Manual QA:** list the physical-device checks completed and the ones still open, especially notification delivery, app-restart persistence, safe-area/layout, and complete UI navigation if untested.
- **Limitations and next steps:** fixed demo identity, device verification, screenshots/video URL, and course-specific deployment/submission details.

## References to Include

- Expo and React Native documentation.
- Supabase Row Level Security and Realtime documentation.
- Course assignment brief and project repository URL.
- Any project assets or room data source, if externally sourced.
