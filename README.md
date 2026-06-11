# M1 Capital Algorithmic Trading

This is a standalone project scaffold for an algorithmic trading application that will integrate with the Charles Schwab API. It has its own folder, its own git history, and no dependency on `PRYCD-MVP`.

## Stack

- Next.js
- TypeScript
- React
- Zod

## Getting started

1. Copy `.env.example` to `.env.local`
2. Fill in your Charles Schwab API credentials
3. Install dependencies with `npm install`
4. Run the app with `npm run dev`

## Initial project structure

- `app/` for the UI and API routes
- `app/api/health/route.ts` for a simple health endpoint
- `lib/env.ts` for Schwab-related environment validation

## Notes

- Keep all Schwab auth, token refresh, order submission, and risk controls separated into explicit modules before enabling any live trading behavior.
- Do not commit `.env.local` or real Schwab credentials.
