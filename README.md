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
4. Run the app with `npm run dev:https`
5. Open `https://127.0.0.1:3443`

## Initial project structure

- `app/` for the UI and API routes
- `app/api/health/route.ts` for a simple health endpoint
- `lib/env.ts` for Schwab-related environment validation

## Notes

- Keep all Schwab auth, token refresh, order submission, and risk controls separated into explicit modules before enabling any live trading behavior.
- Do not commit `.env.local` or real Schwab credentials.
- Optional: set `APP_TOTP_SECRET_BASE32` to a base32 TOTP secret if you want the login page to require a six-digit authenticator code in addition to the password.
- The current implementation supports OAuth login, encrypted cookie-based session persistence, market-data quote reads, and a local in-memory paper order endpoint at `app/api/paper/orders/route.ts`.
- Live order submission is intentionally not wired yet. Paper execution should remain separate until you have account-linking, order validation, and risk controls in place.

## Local Schwab OAuth

- Register `https://127.0.0.1:3443/api/schwab/auth/callback` as the Schwab callback URL and keep the same exact value in `SCHWAB_REDIRECT_URI`.
- Start the app with `npm run dev:https` so Next serves local HTTPS on `127.0.0.1:3443`.
- Open the app at `https://127.0.0.1:3443` and keep the entire login flow on that exact origin.
- Do not mix `localhost` and `127.0.0.1` during OAuth. The app stores state and broker session data in origin-bound cookies, so the host, scheme, and port must stay consistent.
- `next dev --experimental-https` uses a self-signed certificate. If your browser trust warnings get in the way, replace it with a trusted local certificate via `mkcert` and pass the cert/key paths to Next's HTTPS flags.

## Trusted Local HTTPS With mkcert

1. Install `mkcert`.
2. Run `mkcert -install` once to add the local CA to your Windows trust store.
3. From the repo root, create the cert files:
   `mkcert -key-file certs/127.0.0.1-key.pem -cert-file certs/127.0.0.1.pem 127.0.0.1 localhost`
4. Start the app with `npm run dev:https:trusted`.
5. Open `https://127.0.0.1:3443`.

- The trusted cert script expects `certs/127.0.0.1.pem` and `certs/127.0.0.1-key.pem`.
- Keep using `127.0.0.1` for the app URL and Schwab callback URL even though the cert also includes `localhost`.
- The generated cert files stay local. This repo ignores `*.pem` so they should not be committed.
