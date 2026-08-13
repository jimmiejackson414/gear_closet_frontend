# Gear Closet Frontend — TODO

Tracks remaining product, quality, and dependency work.

> **Stack snapshot:** Nuxt **4.5.2** · Vue **3.5.41** · Tailwind **4.3** · reka-ui / shadcn-nuxt **2.8** · Pinia **4** · Vitest **4** · `stripe` **22.5** / `@stripe/stripe-js` **9.13** · `convert` **7** · `dinero.js` **2** · `echarts` **6** / `vue-echarts` **8**

---

## Guiding principles

- One major concern per PR when possible
- Do **not** combine unrelated majors in one PR
- Avoid blind `pnpm update --latest`
- Skip Nuxt 5 / Nitro 3 for now

---

## Page quality & performance

Audits of fetch orchestration, write boundaries, and correctness (2026-08-12). Planning, Closet, Dashboard, Friends, Public packs, Auth/billing/profile, and Shared/shell passes are done.

---

## Test suite

Prefer Pinia store unit tests for race/optimistic correctness over dialog open/close clones.

#### Phase 1 (**Done** — `test/store-correctness`)

- [x] `test:unit:run` script; Playwright limited to real e2e specs; remove TodoMVC/example noise
- [x] Store specs: `user` / `closet` / `planning` (`fetchGeneration`, notifications INSERT, optimistic writes)

#### Phase 2 (follow-up)

- [x] Helpers: `calculatePackWeights` / `calculatePackPrices`
- [x] Friends accept/decline + search pending; ForumsWidget; public pack smoke
- [x] Planning `batchUpdateTodos` / `batchUpdateShoppingItems`

#### Phase 3 (**Done** — `test/suite-phase-3`)

- [x] Auth form smoke; Stripe webhook unit tests; thin closet/planning e2e

---

## Post-upgrade QA leftovers

- [ ] Manual visual regression pass on **closet / planning / auth** dialogs (Phase 5 follow-up)
- [ ] Manual chart smoke after echarts 6 (closet pack bar, planning pie, public pack summary)
- [ ] Manual Stripe billing smoke with refreshed test keys (subscribe / update PM / webhook)

---

## Remaining dependency / platform work

Do these as **separate PRs**.

### Library majors

| PR | Ours → target | Risk / notes |
|---|---|---|
| [ ] `chore: zod 4` | 3 → 4 | **Still blocked** — `@vee-validate/zod@4.15.1` peers `zod: ^3.24` only |

### Optional polish

| PR | Scope | Notes |
|---|---|---|
| [ ] `chore: migrate to Nuxt app/ directory` | Drop `srcDir: '.'` layout | Large move; deferred (own PR) |

### Explicitly out of scope

- Nuxt 5 / Nitro 3
- Blind `pnpm update --latest`
- Re-adding unused packages (`vue-gtag`, `vue-sonner`, `@tanstack/vue-table`) unless product needs them
- Optional later: revoke legacy JWT secret after fully off `anon` / `service_role`

---

## Future features

Product ideas / enhancements not required for current correctness work.

- [ ] **Mutual friends** — Friends request/search UI (`FriendRequestItem`, `FriendSearchItem`)  
  Show real mutual-friend counts (and optionally names) instead of hiding the line. Needs a query/RPC over shared `friends` edges for the current user vs the other profile.

- [x] **Free downgrade soft-lock** — Issue #9 (`fix/free-downgrade-soft-lock`)  
  Excess packs/trips retained and locked when downgrading to Free; user picks 1 pack + 1 trip.

---

## Suggested PR order from here

1. Visual QA leftovers + Stripe smoke
2. Zod 4 when `@vee-validate/zod` peers allow
3. Optional: Nuxt `app/` directory; revoke legacy JWT secret
4. Future features (e.g. mutual friends) when prioritized
