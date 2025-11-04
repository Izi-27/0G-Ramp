0G-Ramp Monorepo

Quickstart
- Backend: `cd backend && npm run dev` (listens on `http://localhost:3001`).
- Contracts: `cd contracts && npm run compile` then `npx hardhat node` in one shell and `npm run deploy -- --network localhost` in another.
- Frontend: `cd frontend && npm run dev` (open the printed URL).

Docker Compose (optional)
- Requirements: Docker Desktop.
- Run: `docker compose up -d` from the repo root.
- Services:
  - `contracts-node`: Hardhat JSON-RPC on `http://localhost:8545`.
  - `contracts-deploy`: one-off deployment to the `docker` network (logs contract addresses).
  - `backend`: Express API on `http://localhost:3001`.

Environment
- Backend `.env` already includes `PORT=3001` and a SQLite `DATABASE_URL`.
- If you want the backend to reference on-chain data, add contract addresses printed by deployment.

Production Setup for Off-Ramp
To enable production off-ramp functionality, configure the following environment variables in your backend `.env`:

```bash
# Off-ramp provider configuration
OFFRAMP_PROVIDER=mock          # Options: mock, transak, lifi
OFFRAMP_API_KEY=your_api_key   # Provider API key
OFFRAMP_SECRET=your_secret     # Provider webhook secret for signature verification
OFFRAMP_BASE_URL=https://api.provider.com  # Provider API base URL
OFFRAMP_NETWORK=ethereum       # Blockchain network (ethereum, polygon, etc.)
OFFRAMP_CHAIN=1               # Chain ID
OFFRAMP_TOKEN=USDC            # Token symbol for off-ramp
```

Provider-specific configurations:
- **Transak**: Set `OFFRAMP_PROVIDER=transak`, obtain API key and secret from Transak dashboard
- **LI.FI**: Set `OFFRAMP_PROVIDER=lifi`, configure API key from LI.FI platform
- **Mock**: Set `OFFRAMP_PROVIDER=mock` for development/testing (default)

The system supports multi-currency payouts (USD, EUR, GBP) and multiple countries. Provider webhooks are handled at `/api/webhook/offramp` for status updates.

Transak Setup
- Sign up at `https://transak.com` and enable Off-Ramp (Sell Crypto).
- Create an API key and webhook secret in the Transak dashboard.
- Backend `.env`:
  - Set `OFFRAMP_PROVIDER=transak`
  - Set `OFFRAMP_API_KEY=<your_transak_api_key>`
  - Set `OFFRAMP_SECRET=<your_webhook_secret>`
  - Set `OFFRAMP_BASE_URL=https://api.transak.com` (or `https://api-staging.transak.com` for testing)
  - Optional hints: `OFFRAMP_NETWORK=ethereum`, `OFFRAMP_TOKEN=USDC`, `OFFRAMP_CHAIN=ethereum`
- Webhook URL: point Transak to `https://<your-backend-domain>/api/webhook/offramp`
  - The backend accepts the `X-Transak-Signature` header and verifies HMAC over the raw body.
- Client flow: request a payout from the OffRamp page; you will receive a Transak checkout URL which is displayed with a direct open link.

Hardhat Scripts
- `npm run deploy` deploys all contracts.
- `npm run deposit` approves and deposits MockUSDC into the vault.
- `npm run withdraw` withdraws MockUSDC to a recipient.
- `npm run receipt` registers a receipt CID in `ReceiptRegistry`.

Notes
- Contracts use Solidity `0.8.23` with optimizer.
- Hardhat is configured for both `localhost` and Docker (`docker`).