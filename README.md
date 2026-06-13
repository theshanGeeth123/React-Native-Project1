# BlueStudy Planner

A professional Expo + Clerk study planner app with local-only data storage.

## Features

- Custom Clerk sign in and sign up
- Email verification flow
- Protected tab navigation
- Local-only study planner data using `expo-secure-store`
- Add, edit, complete, reopen, progress, and delete study tasks
- Add and delete subjects/modules
- Log focus minutes locally
- Dynamic dashboard, planner, progress, and settings screens
- Blue professional mobile UI
- No profile photo asset dependency; profile avatar is generated from initials

## Setup

```bash
npm install
```

Create `.env` from `.env.example`:

```env
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
```

Start with cache reset:

```bash
npx expo start -c
```

## Clerk Dashboard requirements

Enable:

- Email address sign up/sign in
- Password authentication
- Email verification code

## Local storage note

This app intentionally does not use Firebase, Supabase, or any external database. Planner data is stored on the device only and is separated per Clerk user id.
