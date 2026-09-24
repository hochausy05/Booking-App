# Environment

## Required Software

Recommended development environment:

- Node.js LTS
- npm
- Git
- Expo CLI through `npx expo`
- Expo Go on a physical device, or an appropriate emulator
- VS Code or another TypeScript-capable editor

## Project Stack

- React Native
- Expo
- TypeScript
- React Navigation
- Zustand
- AsyncStorage
- Expo Notifications

Optional/recommended for real-time shared bookings:

- Supabase JS client

## Environment Variables

If Supabase is used, keep public client configuration in Expo-compatible environment variables.

Example names:

```env
EXPO_PUBLIC_SUPABASE_URL=
EXPO_PUBLIC_SUPABASE_ANON_KEY=
```

Copy `.env.example` to `.env` and provide the project URL and anon/publishable key. Restart Expo after changing environment values. The app safely reports missing configuration; never put a service-role or secret key in the mobile app.

Never commit private service-role credentials.

Provide a safe `.env.example` if environment variables are required.

## Installation

Expected basic flow:

```bash
npm install
npx expo start
```

Then open with:

- Expo Go on a physical device, or
- Emulator/simulator supported by the development machine

## Physical Device Requirement

Notification behavior should be tested on a physical device.

The final demo should also be verified on a physical device because the submission explicitly expects Expo/physical-device demonstration behavior.

## Validation Commands

Use the project's actual configured scripts.

Typical checks may include:

```bash
npx tsc --noEmit
npx expo start
```

If linting is configured:

```bash
npm run lint
```

Do not add a new validation tool only for documentation unless it is needed.

## Dependency Rule

Add dependencies only when they serve a required feature.

Before adding one:

1. Confirm the existing stack cannot reasonably handle the need.
2. Prefer Expo-compatible packages.
3. Confirm compatibility with the active Expo SDK.

## Secrets

Never commit:

- `.env`
- Private API keys
- Service-role keys
- Personal credentials

Only safe public/mobile client configuration may be exposed where the platform requires it.
