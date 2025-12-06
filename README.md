# 0G Ramp

A full-stack fiat↔crypto ramp built on the 0G Network. This monorepo includes smart contracts (Hardhat), a backend API (Node/Express + Prisma), and a React frontend (Vite + Wagmi/RainbowKit).

## Overview
- On-ramp: start a payment session and mint/deposit USDC to vault.
- Off-ramp: request a payout from USDC to fiat via provider integrations.
- Contracts: `RampAdmin`, `RampVault`, `ReceiptRegistry` on 0G Mainnet.
- Frontend: wallet connect, contract info, on/off-ramp flows.
- Backend: REST API, webhook handling, on-chain operations via operator key.

## Repository Layout
- `contracts/` — Solidity contracts, Hardhat config and scripts
- `backend/` — Express server, Prisma schema, controllers/routes
- `frontend/` — React app (Vite), Wagmi/RainbowKit integration
- `netlify.toml` — Netlify build config for frontend
- `docker-compose.yml` — Optional local stack (contracts + backend)

## Tech Stack
- Smart contracts: Solidity 0.8.23, Hardhat
- Backend: Node 18, Express, Prisma
- Database: SQLite (dev), Postgres (prod)
- Frontend: React 19, Vite 7, Wagmi 2, RainbowKit 2, TailwindCSS

## Environments
- Chain: 0G Mainnet (chainId `16661`)
- RPC: `https://evmrpc.0g.ai`
- Contracts: see `contracts/deployments/ogMainnet.json` for deployed addresses

## Quickstart (Local)
1) Contracts (localhost)
- `cd contracts`
- `npm install`
- Run local node: `npx hardhat node`
- In a second shell, deploy: `npx hardhat run scripts/deploy.js --network localhost`

2) Backend (dev)
- `cd backend`
- `npm install`
- Create `.env` (see Environment Variables below)
- Start: `npm run dev` (listens on `http://localhost:3001`)

3) Frontend (dev)
- `cd frontend`
- `npm install`
- Create `.env` with `VITE_API_BASE=http://localhost:3001` and `VITE_RAMP_ADMIN_ADDRESS=<deployed_admin>`
- Start: `npm run dev` (open the printed URL)

### Docker Compose (optional)
- Requirements: Docker Desktop
- From repo root: `docker compose up -d`
- Services: Hardhat JSON-RPC (`http://localhost:8545`), backend API (`http://localhost:3001`)

## Environment Variables

Use `deployment-envs.txt` (repo root) as a copy/paste checklist. It is gitignored.

### Backend (.env)
- `DATABASE_URL` — Postgres connection string (prod). SQLite is fine in dev.
- `PORT` — optional; defaults to `3001`.
- `OG_RPC_URL` — e.g., `https://evmrpc.0g.ai`.
- `OPERATOR_PRIVATE_KEY` — operator wallet private key (secret). Used to sign on-chain ops.
- `USDC_ADDRESS` — USDC token address on 0G Mainnet.
- `USDC_DECIMALS` — token decimals (e.g., `18`).
- `RAMP_VAULT_ADDRESS` — deployed vault address.
- `OG_STORAGE_URL`, `OG_STORAGE_API_KEY` — optional 0G storage integration.
- `PAYMENT_SECRET` — HMAC secret for payment callbacks (secret).
- Off-ramp provider:
  - `OFFRAMP_PROVIDER` — `mock` | `transak` | `lifi`
  - `OFFRAMP_API_KEY`, `OFFRAMP_BASE_URL`, `OFFRAMP_SECRET` — provider credentials
  - `OFFRAMP_NETWORK`, `OFFRAMP_CHAIN`, `OFFRAMP_TOKEN` — optional hints
- `CORS_ORIGINS` — comma-separated origins (e.g., `https://<your-netlify>.netlify.app`)

### Frontend (.env)
- `VITE_API_BASE` — backend base URL (no trailing slash)
- `VITE_RAMP_ADMIN_ADDRESS` — `RampAdmin` contract address

## Contracts
- Located in `contracts/contracts/`:
  - `RampAdmin.sol` — admin settings (fees, roles)
  - `RampVault.sol` — token vault for on/off-ramp flows
  - `ReceiptRegistry.sol` — off-chain receipt anchoring (e.g., IPFS CIDs)
- Networks and addresses: `contracts/deployments/` contains JSON per network (e.g., `ogMainnet.json`).

### Useful Hardhat Scripts
- Deploy all: `npx hardhat run scripts/deploy.js --network <network>`
- Deposit: `node scripts/deposit.js --network <network>`
- Withdraw: `node scripts/withdraw.js --network <network>`
- Receipt: `node scripts/receipt.js --network <network>`

## Backend API
Base path: `/api`

- Health
  - `GET /health` — service health
- On-ramp
  - `POST /api/onramp/create-session` — start payment session
- Off-ramp
  - `POST /api/offramp/request` — request payout (USDC→fiat)
- Webhooks
  - `POST /api/webhook/payment` — payment provider callback (HMAC verified)
  - `POST /api/webhook/offramp` — off-ramp provider callback
- Transactions
  - `GET /api/transactions/by-wallet/:wallet` — list by EVM wallet address
- Developers
  - `GET /api/dev/apikey/:wallet` — fetch API key
  - `POST /api/dev/apikey` — generate API key
- KYC
  - `POST /api/kyc/submit` — submit KYC data

## Deployment

### Backend on Render (recommended)
- Create Web Service → Environment: Docker
- Dockerfile path: `backend/Dockerfile`
- Health check path: `/health`
- Attach Postgres; set `DATABASE_URL` in service environment
- Add all required env vars (see Backend .env above)
- CMD is defined in Dockerfile: `npx prisma db push && node server.js`
- Verify logs and hit `https://<service>.onrender.com/health`

Alternative (Native Node):
- Environment: Node; Root: `backend`
- Build: `npm ci && npx prisma generate`
- Start: `npx prisma migrate deploy && node server.js`

Prisma notes:
- Use SQLite locally; use Postgres in production
- Ensure committed migrations; startup runs `migrate deploy`

### Frontend on Netlify
- `netlify.toml` already pins build: base `frontend`, command `npm run build`, publish `dist`, Node `20`
- Set environment vars in Netlify:
  - `VITE_API_BASE=https://<your-render-backend>.onrender.com`
  - `VITE_RAMP_ADMIN_ADDRESS=<ramp_admin_address_on_0g_mainnet>`
- Deploy; verify app loads and connects wallet on 0G Mainnet

### CORS
- Backend whitelists localhost by default
- For production, set `CORS_ORIGINS` to include your Netlify domain

## Security
- Treat `OPERATOR_PRIVATE_KEY`, provider keys, and webhook secrets as sensitive
- Never commit secrets; use Render/Netlify environment settings
- Rotate any secret if it was exposed

## Troubleshooting
- Dockerfile not found in Render: set path to `backend/Dockerfile`
- Prisma errors: check `DATABASE_URL` and committed migrations
- CORS blocked: ensure `CORS_ORIGINS` contains exact frontend origin
- Frontend build issues: verify `VITE_*` env vars and run `npm run build` locally

## License
- See repository license. If none present, all rights reserved by the repository owner.