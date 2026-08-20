# Gear Closet

Nuxt frontend for [Gear Closet](https://app.gearcloset.io/): pack lists, trip planning, and sharing gear with friends.

## Stack

- [Nuxt 4](https://nuxt.com/) + [Vite](https://vitejs.dev) + [TypeScript](https://www.typescriptlang.org/)
- [Vue Router](https://router.vuejs.org/) + [Pinia](https://pinia.vuejs.org)
- [Tailwind CSS 4](https://tailwindcss.com/) + [Reka UI](https://reka-ui.com/) / [shadcn-vue](https://www.shadcn-vue.com/)
- [Supabase](https://supabase.com/) (Auth, Postgres, Storage)
- [Stripe](https://stripe.com/) (billing)
- [Resend](https://resend.com/) (transactional email; auth confirm/reset stays on Supabase)
- [Sentry](https://sentry.io/) (error tracking; off in local unless opted in)
- [Vitest](https://vitest.dev/) + [Playwright](https://playwright.dev)
- [ESLint](https://eslint.org/) (flat config via `@nuxt/eslint`)

## Prerequisites

- Node matching `.nvmrc` (22)
- [pnpm](https://pnpm.io/) `9.15.0` (`packageManager` in `package.json`)
- Optional CLIs, depending on what you are working on:
  - [Supabase CLI](https://supabase.com/docs/guides/local-development/cli/getting-started) (local DB / Auth)
  - [Stripe CLI](https://stripe.com/docs/stripe-cli) (webhooks)
  - [mkcert](https://github.com/FiloSottile/mkcert) (trusted localhost TLS)

IDE: [VS Code](https://code.visualstudio.com/) or [Cursor](https://cursor.com/) with [Vue - Official](https://marketplace.visualstudio.com/items?itemName=Vue.volar). Disable Vetur.

## Getting started

```sh
pnpm install
cp .env.example .env
```

Fill `.env` from `.env.example`. For a local Supabase stack:

```sh
supabase start
supabase status -o env
```

Copy `API_URL`, `PUBLISHABLE_KEY`, and `SECRET_KEY` into `NUXT_PUBLIC_SUPABASE_URL`, `NUXT_PUBLIC_SUPABASE_KEY`, and `NUXT_SUPABASE_SECRET_KEY` (and the `VITE_*` / legacy aliases if you use them). Then:

```sh
pnpm dev
```

The app listens on **http://localhost:8000**.

## Environment

Secrets live in `.env` (gitignored). `.env.example` is the checklist.

| Area | Notes |
| --- | --- |
| Supabase | Prefer publishable + secret keys. Legacy anon / `service_role` still work until deactivated. |
| Stripe | Publishable key is public; secret and webhook signing secret are server-only. |
| Resend | `NUXT_RESEND_API_KEY` and `NUXT_MAIL_FROM` are server-only. Do not prefix them with `NUXT_PUBLIC_`. |
| Sentry | See [Error tracking](#error-tracking-sentry). |
| Playwright | `NUXT_PLAYWRIGHT_BASE_URL` (defaults to `http://localhost:8000`) plus a test user. |

## Commands

| Command | What it does |
| --- | --- |
| `pnpm dev` | Dev server with HMR (port 8000) |
| `pnpm build` | Production build |
| `pnpm preview` | Serve the production build locally |
| `pnpm typecheck` | `nuxi typecheck` |
| `pnpm lint` | ESLint |
| `pnpm test:unit` | Vitest watch |
| `pnpm test:unit:run` | Vitest once |
| `pnpm test:e2e` | Playwright (`tests/e2e`) |
| `pnpm typegen` | Regenerate `types/index.ts` from local Supabase + enums |
| `pnpm stripe:webhook` | Forward Stripe events to `/api/stripe/webhook` |
| `pnpm mail:smoke you@example.com` | Send a Resend smoke email |
| `pnpm cert` | Write `localhost.pem` / `localhost-key.pem` via mkcert |
| `pnpm barrel` | Check shadcn UI subdirectory barrels |

## Local services

### Supabase

Schema and RLS live under `supabase/`. After adding or applying a migration:

```sh
pnpm typegen
```

Studio is at http://127.0.0.1:54323. Local Auth emails are captured by Inbucket at http://127.0.0.1:54324 (they are not sent through Resend).

### Stripe

Keep `pnpm stripe:webhook` running while testing checkout or subscription changes. It forwards to `http://localhost:8000/api/stripe/webhook`. Put the CLI signing secret in `NUXT_STRIPE_WEBHOOK_SECRET`.

### Email (Resend)

App-generated mail (for example trip invites) goes through Resend. Signup confirmation and password reset stay on **Supabase Auth templates**.

- Verify the from-domain in the Resend dashboard before staging/prod.
- `NUXT_MAIL_ALLOWLIST` is a comma-separated allowlist. When set, `sendMail` only delivers to those addresses (use it in staging).
- `pnpm mail:smoke you@example.com` confirms keys and delivery.

### Error tracking (Sentry)

Sentry is **off in `nuxt dev`** unless both a DSN and `NUXT_PUBLIC_SENTRY_ENABLED=true` are set. Preview/prod send when a DSN is set, unless `NUXT_PUBLIC_SENTRY_ENABLED=false`.

`NUXT_PUBLIC_SENTRY_DSN` is the browser DSN. `NUXT_SENTRY_DSN` is server-only and falls back to the public DSN. The server SDK does **not** initialize in `nuxt dev`; use a production build:

```sh
pnpm build
pnpm preview
```

Optional probe (throws only when the key matches `NUXT_SENTRY_PROBE_KEY`):

```sh
curl "http://localhost:8000/api/sentry-example?key=$NUXT_SENTRY_PROBE_KEY"
```

Source maps upload at build time if `SENTRY_ORG`, `SENTRY_PROJECT`, and `SENTRY_AUTH_TOKEN` are set.

Happy-path Stripe webhooks are not logged. Signature failures and handler throws are sent to Sentry (`stripe.webhook=signature` or `stripe.event=<type>`). Forum and profile 500s report the underlying cause; the client still gets a generic message.

## Tests

Unit tests:

```sh
pnpm test:unit:run
```

End-to-end (Playwright). Install browsers once, then run against a running app (or build first on CI):

```sh
npx playwright install
pnpm test:e2e
pnpm test:e2e -- --project=chromium
pnpm test:e2e -- tests/e2e/planning.spec.ts
pnpm test:e2e -- --debug
```

## Other resources

- [Lucide Icons](https://lucide.dev/icons/) (prefixed `Icon` in this app)
- [Hero Patterns](https://heropatterns.com/)
