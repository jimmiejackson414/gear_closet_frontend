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

Audits of fetch orchestration, write boundaries, and correctness (2026-08-12). Planning, Closet, Dashboard, and Friends page passes are done.

---

### Public packs

`pages/p/packs/[slug].vue` → public pack + comments.

#### High

- [ ] **Private-pack gate stuck / wrong** — `pages/p/packs/[slug].vue`  
  `displayPrivatePackWarning` init from prior store (`?? true`) and never updates after fetch → public packs can stay blocked; private packs can flash content if store was warm. Set from `fetchedPack.private` after load; prefer RLS so private rows aren’t returned to anon.

#### Medium

- [ ] **Public layout always hits `/api/profile`** — `PublicLayout.vue`  
  Anon pack views await profile → 401 and block layout. Skip when no session.

- [ ] **Public comments gated on auth** — `pages/p/packs/[slug].vue`  
  Guests see Comments tab but empty panel. Show list; gate compose only. Fix “Commenting as” to current user (not pack owner / parent author).

#### Low

- [ ] Remove / wire unused `PublicPackSummary.vue`, stub `pages/p/friends/[slug].vue`

---

### Auth / billing / profile

#### High

- [ ] **Password reset 404** — `ForgotPasswordForm.vue` → `/reset-password`, `ResetPasswordForm.vue` unused  
  No `pages/reset-password.vue`. Add page (AuthLayout + form) or fix `redirectTo`.

- [ ] **Billing dialogs are stubs** — `ManageSubscriptionDialog.vue`, `UpdatePaymentMethodDialog.vue`  
  Confirm/Update only `console.log`; existing `PUT /api/stripe/subscription` and `payment-method` unused. Wire APIs + toasts + refresh.

#### Medium

- [ ] **Avatar upload doesn’t refresh profile** — `stores/user.ts` `updateAvatar`  
  DB updates image; client never `fetchProfile` / patch. Refresh after upload.

#### Low

- [ ] Strip leftover `console.log`s in billing stubs

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
2. **Auth / billing High** — reset-password page, billing stubs
3. **Public packs High** — privacy gate; then Medium comments/layout
4. Visual QA leftovers + Stripe smoke
5. Zod 4 when `@vee-validate/zod` peers allow
6. Optional: Nuxt `app/` directory; revoke legacy JWT secret
7. Future features (e.g. mutual friends) when prioritized
