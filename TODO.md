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

Audits of fetch orchestration, write boundaries, and correctness (2026-08-12). Planning, Closet, Dashboard, Friends, Public packs, and Auth/billing/profile page passes are done.

---

### Public packs

`pages/p/packs/[slug].vue` → public pack + comments. **Done** (`fix/public-packs-perf`).

#### High

- [x] **Private-pack gate stuck / wrong** — `pages/p/packs/[slug].vue`  
  Clear store before fetch; set gate from `fetchedPack.private` / missing row; never flash warm Pinia pack.

#### Medium

- [x] **Public layout always hits `/api/profile`** — `PublicLayout.vue`  
  Skip profile fetch when anonymous.

- [x] **Public comments gated on auth** — `pages/p/packs/[slug].vue`  
  Comment list for guests; compose gated; “Commenting as” uses current user (pack page + reply form).

#### Low

- [x] Removed unused `PublicPackSummary.vue`; removed stub `pages/p/friends/[slug].vue` and dead `FriendItem` link

---

### Auth / billing / profile

**Done** (`fix/auth-billing-perf`).

#### High

- [x] **Password reset 404** — added `pages/reset-password.vue` (AuthLayout + `ResetPasswordForm`); excluded `/reset-password` from Supabase auth redirects.

- [x] **Billing dialogs are stubs** — `ManageSubscriptionDialog` → `PUT /api/stripe/subscription`; `UpdatePaymentMethodDialog` → Stripe `createPaymentMethod` + `PUT /api/stripe/payment-method`; toasts + subscription refresh.

#### Medium

- [x] **Avatar upload doesn’t refresh profile** — `updateAvatar` writes `profiles.image` from storage path and `fetchProfile()` after upload.

#### Low

- [x] Strip leftover `console.log`s in billing stubs

---

### Shared / shell

Cross-cutting store and layout issues used by multiple pages.

#### High

- [ ] **`fetchProfile` crashes on failure** — `stores/user.ts`  
  Sets `profile = null` then `this.profile!.notifications = []` → throw before toast. Return after null; don’t write through null.

- [ ] **Realtime notifications never INSERT** — `stores/user.ts`, `GcNavbar.vue`  
  `fetchNotification` does `notifications[findIndex]` — INSERT finds `-1` and never `push`. Push when missing; replace when found. Unsubscribe / dedupe channel on remount.

#### Low

- [ ] Unused `stores/auth.ts` — remove or start using for redirects

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

---

## Suggested PR order from here

1. **Shared High** — `fetchProfile` crash, notification INSERT
2. Visual QA leftovers + Stripe smoke
3. Zod 4 when `@vee-validate/zod` peers allow
4. Optional: Nuxt `app/` directory; revoke legacy JWT secret
5. Future features (e.g. mutual friends) when prioritized
