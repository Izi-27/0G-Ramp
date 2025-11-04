# Backend Setup Guide

This guide walks through configuring, running, and deploying the 0G Ramp backend (Node/Express + Prisma) with a Postgres database. It covers environment variables, database setup, local development, Docker, Render deployment, CORS, webhooks, and troubleshooting.

## Prerequisites
- `Node.js` 18+ and `npm`
- A PostgreSQL database (Render PostgreSQL or equivalent)
- Access to 0G RPC (`OG_RPC_URL`) and an operator wallet private key (`OPERATOR_PRIVATE_KEY`)
- Provider credentials for off-ramp (Transak, LI.FI, or mock)
- Optional: Docker Desktop

## Repo Structure (backend)
- `backend/server.js` — Express app
- `backend/routes/*` — API route modules
- `backend/controllers/*` — business logic
- `backend/prisma/schema.prisma` — Prisma schema (provider: `postgresql`)
- `backend/prisma/migrations/*` — Prisma migrations (currently SQLite-based; see notes)
- `backend/Dockerfile` — container build (uses `prisma db push`)
- `backend/.env.example` — env reference

## Step 1 — Environment Variables
Create `backend/.env` (the file is gitignored). Do not commit secrets.

Required variables:
- `PORT` — backend port (defaults to `3001`)
- `DATABASE_URL` — Postgres connection string
  - Example: `postgresql://<user>:<password>@<host>/<database>`
  - If Render requires TLS, append: `?sslmode=require`
- Chain / on-chain:
  - `OG_RPC_URL` — e.g., `https://evmrpc.0g.ai`
  - `OPERATOR_PRIVATE_KEY` — EVM private key used for on-chain ops
  - `USDC_ADDRESS` — USDC address on 0G Mainnet
  - `USDC_DECIMALS` — typically `18`
  - `RAMP_VAULT_ADDRESS` — deployed vault contract address
- Storage (optional):
  - `OG_STORAGE_URL`, `OG_STORAGE_API_KEY`
- Payments & webhooks:
  - `PAYMENT_SECRET` — HMAC secret for `/api/webhook/payment`
- Off-ramp provider:
  - `OFFRAMP_PROVIDER` — `mock` | `transak` | `lifi`
  - `OFFRAMP_API_KEY`, `OFFRAMP_BASE_URL`, `OFFRAMP_SECRET`
  - Optional hints: `OFFRAMP_NETWORK`, `OFFRAMP_CHAIN`, `OFFRAMP_TOKEN`
- CORS:
  - Currently, localhost is allowed by default. For production, add your domain in `server.js` or implement a `CORS_ORIGINS` env read (see CORS section).

Reference (`backend/.env.example`) already shows keys and Postgres format for `DATABASE_URL`.

## Step 2 — Database & Prisma
- Prisma is configured for `postgresql` in `schema.prisma`.
- For a fresh Postgres database, use `db push` to create tables:
  - `cd backend`
  - `npm install`
  - `npx prisma generate`
  - `npx prisma db push`

Notes on migrations:
- Existing migrations under `backend/prisma/migrations` were generated for SQLite (e.g., `AUTOINCREMENT`). They are not compatible with Postgres.
- Production startup (Docker) runs `prisma db push` to apply the schema directly on Postgres.
- If you want to adopt Postgres-native migrations:
  1. Ensure `provider = "postgresql"` (already done).
  2. Point local `DATABASE_URL` to Postgres.
  3. Run `npx prisma migrate dev --name init` to generate Postgres migrations.
  4. Commit new migrations and switch production startup to `npx prisma migrate deploy`.

## Step 3 — Local Development
1. Install dependencies:
   - `cd backend && npm install`
2. Generate Prisma client:
   - `npx prisma generate`
3. Ensure your `.env` is set (Postgres or SQLite in dev):
   - Postgres: `DATABASE_URL=postgresql://...`
   - SQLite (dev-only): `DATABASE_URL=file:./prisma/dev.db`
4. Start the server:
   - `npm run dev`
5. Verify health:
   - `curl http://localhost:3001/health` → `{"ok":true}`

## Step 4 — API Endpoints
- Base path: `/api`
- Health: `GET /health`
- On-ramp: `POST /api/onramp/create-session`
- Off-ramp: `POST /api/offramp/request`
- Webhooks: `POST /api/webhook/payment`, `POST /api/webhook/offramp`
- Transactions: `GET /api/transactions/by-wallet/:wallet`
- Developers: `GET /api/dev/apikey/:wallet`, `POST /api/dev/apikey`
- KYC: `POST /api/kyc/submit`

## Step 5 — Docker (optional)
Build and run locally:
- `docker build -t 0g-ramp-backend ./backend`
- `docker run -p 3001:3001 -e DATABASE_URL="postgresql://..." 0g-ramp-backend`

Dockerfile behavior:
- Generates Prisma client at build time.
- At container start, runs: `npx prisma db push && node server.js`.
- Ensure the container has `DATABASE_URL` set to your Postgres instance.

## Step 6 — Deploy on Render (recommended)
1. Connect your GitHub repo to Render.
2. Create a Web Service:
   - Environment: Docker
   - Dockerfile path: `backend/Dockerfile`
   - Health check path: `/health`
3. Configure environment variables (Render → Settings → Environment):
   - Set `DATABASE_URL` to your Render Postgres connection string.
   - If you see TLS errors, use: `postgresql://.../db?sslmode=require`
   - Add all other required envs (chain, provider, secrets).
4. Deploy. Verify logs show successful startup and Prisma schema application.
5. Test: `curl https://<service>.onrender.com/health` → `{"ok":true}`.

## CORS Configuration
- Current `server.js` allows: `http://localhost:5173` and `http://localhost:5174`.
- For production, add your frontend domain to the allowed origins. Option A (quick):
  - Edit `server.js` and include your domain in the `origin` array for `cors`.
- Option B (recommended): make CORS origins configurable via env:
  - Example pattern:
    ```js
    const corsOrigins = (process.env.CORS_ORIGINS || '').split(',').filter(Boolean)
    const defaults = ['http://localhost:5173', 'http://localhost:5174']
    app.use(cors({ origin: [...defaults, ...corsOrigins], credentials: true }))
    ```
  - Then set `CORS_ORIGINS="https://<your-netlify-domain>"` in production.

## Webhooks
- Raw body is captured for HMAC verification in `server.js`.
- Payment callbacks: `POST /api/webhook/payment` using `PAYMENT_SECRET`.
- Off-ramp callbacks: `POST /api/webhook/offramp` using provider `OFFRAMP_SECRET`.
- Configure your provider’s dashboard to point to these URLs.

## Security Notes
- Treat `OPERATOR_PRIVATE_KEY`, `PAYMENT_SECRET`, `OFFRAMP_SECRET`, and provider API keys as sensitive.
- Never commit secrets to version control; use Render environment settings.
- Rotate any secret if exposed.

## Troubleshooting
- Prisma connection errors:
  - Verify `DATABASE_URL` syntax; add `?sslmode=require` if needed.
  - Ensure the database user has permissions to create tables.
- Docker build failing on Prisma:
  - Make sure `@prisma/client` and `prisma` versions are compatible.
  - Ensure `DATABASE_URL` is set at runtime (not build time).
- “Migration SQL incompatible” errors:
  - Use `prisma db push` instead of `migrate deploy` until you generate Postgres-native migrations.
- CORS blocked:
  - Add your frontend origin to `server.js` or via `CORS_ORIGINS` env as shown.
- Webhook signature invalid:
  - Confirm secrets match the provider dashboard and that the raw body is used in verification.

## Verification Checklist
- Health endpoint returns `{"ok":true}` locally and on Render.
- Prisma creates tables on Postgres (`prisma db push` succeeds).
- Environment variables are set (Render) and no secrets are committed.
- Frontend calls to `/api/...` succeed from your deployed domain (CORS ok).

---
For any issues, review backend logs and confirm environment variables, database connectivity, and provider settings. If you want me to convert the project to Postgres-native migrations, I can generate and commit them and switch startup to `prisma migrate deploy`.