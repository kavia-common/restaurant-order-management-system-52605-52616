# Supabase Integration (orders_frontend)

This Angular app uses Supabase for authentication (magic link / OTP) via `@supabase/supabase-js`.

## Required environment variables

Set these in the container `.env` (do not commit secrets):

- `NG_APP_SUPABASE_URL` — Supabase project URL
- `NG_APP_SUPABASE_ANON_KEY` — Supabase anon key
- `NG_APP_SITE_URL` — the deployed site URL (used for redirect after email link)
- `NG_APP_API_BASE_URL` — FastAPI backend base URL (optional; app falls back to relative URLs)

## Auth flow

- Sign-in page: `/sign-in`
- Auth callback page: `/auth/callback`

The app starts a magic-link sign-in using:

- `AuthService.signInWithOtp(email)` with `emailRedirectTo = ${NG_APP_SITE_URL}/auth/callback`

## Roles / admin access

The app expects admin role stored on the Supabase user object:

- `user.app_metadata.role = "admin"`

If not present, role defaults to `customer`.

The admin route `/admin` is protected by an Angular route guard (`adminGuard`) that checks:
- user is signed in
- role is `admin`

## Notes

If Supabase env vars are not configured, the app runs in a demo mode (auth disabled, backend calls fall back to mock data).
