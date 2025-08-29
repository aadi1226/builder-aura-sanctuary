# NoteStack – Full‑Stack Notes App (React + TS + Express)

A mobile‑first note‑taking app with email + OTP and Google sign‑in, JWT auth, and notes CRUD. Frontend is React + Vite + Tailwind; backend is Express (TypeScript). Defaults to in‑memory storage, ready to connect to Postgres (Neon) or another DB.

## Tech

- Frontend: React 18, TypeScript, Vite, TailwindCSS
- UX: Responsive layout, accessible forms, toast notifications, error boundary
- Auth: Email + OTP (dev echo), Google sign‑in (@react-oauth/google), JWT via HttpOnly cookie
- Backend: Express 5 (TypeScript). Routes: /api/auth/\*, /api/notes

## Quick start

```bash
pnpm install
pnpm dev
```

App runs on http://localhost:8080. In dev, OTP is shown on screen. In production, integrate an email provider.

### Environment variables

Create an environment variable for Google sign‑in (optional):

- VITE_GOOGLE_CLIENT_ID=your_google_oauth_client_id
- JWT_SECRET=strong_secret_value

You can set these with the Dev Server controls in Builder or a local .env file.

## Scripts

- pnpm dev – Run SPA + API in one port with HMR
- pnpm build – Build SPA and server
- pnpm start – Run built server
- pnpm typecheck – TypeScript check
- pnpm test – Vitest

## API summary

- POST /api/auth/request-otp { email }
- POST /api/auth/verify-otp { email, otp, name? }
- POST /api/auth/google { credential }
- GET /api/auth/me
- POST /api/auth/logout
- GET /api/notes
- POST /api/notes { title, content }
- DELETE /api/notes/:id

JWT is set as an HttpOnly cookie. All notes endpoints require a valid session.

## Database (production)

The app ships with an in‑memory store for easy evaluation. For persistence:

1. Connect to Neon for Postgres: Open MCP popover in Builder and connect Neon.
2. Replace the in‑memory store with a Postgres adapter (Prisma recommended). The route handlers are isolated to make this simple.

## Deploy

Use Netlify or Vercel via MCP in Builder:

- Netlify: Connect Netlify MCP, then deploy. Build command: pnpm build; Publish dir: dist/spa
- Vercel: Connect Vercel MCP and deploy.
  Alternatively share the Open Preview (not production‑grade).

## Notes

- Google login renders only if VITE_GOOGLE_CLIENT_ID is configured.
- OTP delivery is mocked in dev; plug an email service for production.
- Use meaningful commits per feature as you iterate.
