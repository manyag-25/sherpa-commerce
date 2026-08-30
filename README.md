# Agentic Commerce — LifeHacks Hackathon Prototype

Turn any merchant into an AI-native seller through one conversation. This
prototype demonstrates an end-to-end flow: merchant onboarding → generated
merchant agent → sealed offer exchange → payment instruction → passkey +
Visa acceptance (sandbox or simulated).

This repository is organised as a single Next.js app that contains several
internal packages (`packages/*`) for the domain logic: validator, scoring,
agents, TAP signing and payment controls. The demo is laptop-focused but the
patterns are generic.

## Quick links
- Live UI (local): http://localhost:3000
- Merchant onboarding: `/merchant/onboard`
- Storefront demo: `/storefront/tan-computers`
- Customer exchange: `/customer`

## Why this is hackathon-ready
- Fully working demo end-to-end with **no secrets** (`DEMO_MODE=true` by default).
- Deterministic fallbacks if any integration is missing (OpenAI, Supabase,
  Shopify, Visa) so judges can quickly exercise the UX.
- Tests: 142 unit + integration tests, plus a smoke script for core flows.

## Quick start (5 minutes)
1. Clone and install:
```bash
git clone https://github.com/<your-repo>/sherpa-commerce.git
cd sherpa-commerce
pnpm install
```
2. Copy env example and (optionally) provide credentials:
```bash
cp .env.example .env
# Edit .env to add any credentials you want to enable (see Environment below)
```
3. Run the dev server:
```bash
pnpm dev
# Open http://localhost:3000
```

## Common commands
```bash
pnpm build          # production build
pnpm typecheck      # tsc --noEmit
pnpm lint           # eslint
pnpm test           # vitest (unit + integration)
pnpm smoke          # end-to-end smoke script (in-process)
pnpm seed           # load demo seed data (requires Supabase or in-memory fallback)
pnpm tap:generate-keys  # generate Ed25519 keypair (optional)
```

If you want the demo to persist state across restarts, configure Supabase
as described below and run the migrations.

## Architecture (very short)
- `app/` — Next.js routes and UI (app router). Server components access domain
  packages.
- `packages/core` — schemas, env helper, DB adapters, canonicalization, policy
  validator, seed data.
- `packages/agents` — merchant & customer agents, onboarding, rule extraction.
- `packages/commerce` — commerce adapters (Shopify, demo mirror).
- `packages/visa` — TAP signing, Payment Instruction model, Visa adapters.

## Key routes
- `/merchant/onboard` — onboarding conversation + workspace (deterministic
  detector, catalogue import, rule extraction, Visa connect)
- `/storefront/[merchantId]` — merchant-scoped storefront chat
- `/customer` — customer agent and sealed offer exchange UI

## Environment
1. Copy `.env.example` → `.env` or `.env.local`.
2. The demo runs with *no credentials*. Set credentials to enable live
   integrations:

  - `OPENAI_API_KEY` enables LLM features (intent extraction, onboarding
    conversation). If missing a deterministic fallback is used.
  - `NEXT_PUBLIC_SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` enable Postgres
    persistence. Both required; otherwise the app uses an in-memory seeded
    store.
  - `SHOPIFY_ADMIN_ACCESS_TOKEN` + `SHOPIFY_DEMO_STORE_DOMAIN` enable the
    Shopify Admin adapter for catalogue sync / orderCreate.
  - `VISA_ACCEPTANCE_MODE=sandbox` with merchant id/key/secret enables real
    sandbox calls; otherwise a simulated Visa adapter is used.

## Supabase: migrations & seed
Option A — CLI (recommended):
```bash
npm install -g supabase
supabase login            # interactive (or use SUPABASE_ACCESS_TOKEN)
supabase link --project-ref <your-project-ref>
supabase db push
pnpm seed
```

Option B — Dashboard SQL (no CLI):
1. Open Supabase Console → SQL Editor → New query.
2. Paste the SQL in `supabase/migrations/20260801000000_init.sql` and Run.
3. Back locally, run `pnpm seed`.

## Troubleshooting (common issues)
- "fetch failed" when seeding: check `NEXT_PUBLIC_SUPABASE_URL` for typos
  (DNS failures are common). Make sure the project URL is exact.
- If the CLI hangs on `Initialising login role...`: complete the browser
  login or set `SUPABASE_ACCESS_TOKEN` and retry.
- WebAuthn on localhost: if your machine has no platform authenticator the
  flow may pause up to 8s — set `ENABLE_WEBAUTHN=false` to skip to the
  simulated confirmation.

## Testing
```bash
pnpm test    # run all tests
pnpm smoke   # quick end-to-end checks
```

## Contributing
- Keep changes small and focused.
- Add tests for any domain change (policy, scoring, validator).
- For new migrations, add a SQL file under `supabase/migrations/` and update
  the README migration steps.

## License & contact
- MIT — feel free to adapt for hackathon presentations. Open issues if you
  need help reproducing flows.

Enjoy the demo — tell me which page to walk through and I'll help exercise
the flow for judges.
