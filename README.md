# M1 Capital Algorithmic Trading

This is a standalone project scaffold for an algorithmic trading application that will integrate with the Charles Schwab API. It has its own folder, its own git history, and no dependency on `PRYCD-MVP`.

## Stack

- Next.js
- TypeScript
- React
- Zod

## Getting started

1. Copy `.env.example` to `.env.local`
2. Fill in your Charles Schwab API credentials and `APP_SESSION_SECRET`
3. Install dependencies with `npm install`
4. Run the app with `npm run dev`

## Initial project structure

- `app/` for the UI and API routes
- `app/api/health/route.ts` for a simple health endpoint
- `lib/env.ts` for Schwab-related environment validation

## Notes

- Keep all Schwab auth, token refresh, order submission, and risk controls separated into explicit modules before enabling any live trading behavior.
- Do not commit `.env.local` or real Schwab credentials.
- For a Vercel deployment, register your exact HTTPS callback URL, such as `https://trading.example.com/api/schwab/auth/callback`, and keep the same value in `SCHWAB_REDIRECT_URI`.
- Set the same Schwab env vars, `APP_SESSION_SECRET`, and `APP_ACCESS_PASSWORD` in Vercel Project Settings -> Environment Variables before testing OAuth in preview or production.
- Optional: set `APP_TOTP_SECRET_BASE32` to a base32 TOTP secret if you want the login page to require a six-digit authenticator code in addition to the password.
- The current implementation supports OAuth login, encrypted cookie-based session persistence, market-data quote reads, and a local in-memory paper order endpoint at `app/api/paper/orders/route.ts`.
- Live order submission is intentionally not wired yet. Paper execution should remain separate until you have account-linking, order validation, and risk controls in place.
