# Dependency Upgrade Plan

Revive the late-2024 / early-2025 Nuxt 3 stack toward current Nuxt 4. Do this in staged PRs — not one “update everything” change.

> **Context:** Nuxt 3 reached EOL on July 31, 2026. Current stable is Nuxt 4.5.x. Primary goal is a controlled path to Nuxt 4.

---

## Current baseline

| Layer | Ours | Latest | Risk |
|---|---|---|---|
| Node (`.nvmrc`) | 22 (verified **22.23.2**) | Nuxt 4.5 wants `^22.19 \|\| ^24.11 \|\| ≥26` | Low |
| Nuxt | **4.5.2** | 4.5.2 | Done (Phase 2) |
| Tailwind | **4.3.3** (`@tailwindcss/vite`) | 4.3 | Done (Phase 5) |
| UI | **`reka-ui` + `shadcn-nuxt` 2.8.2** | reka-ui + shadcn-nuxt 2.x | Done (Phase 4) |
| Supabase module | **2.0.10** | 2.0.10 | Done (Phase 3) |
| Pinia / `@pinia/nuxt` | **4.0.2 / 1.0.1** | 4.x / 1.x | Done (Phase 3) |
| VueUse | **14.4.0** | 14.x | Done (Phase 3) |
| ESLint | 8 + ts-eslint 6 | 9/10 + flat config | Medium |
| Stripe | stripe-js 5 / stripe 17 | 9 / 22 | Medium–high |
| Zod | 3.x | 4.x | Medium |
| Vitest / `@nuxt/test-utils` | 1.6 / 3.x | 4.x / 4.x | Medium (Phase 7) |

Also notable:

- `crypto-js` replaced in Phase 6 (`@noble/ciphers` / `@noble/hashes` in `utils/encryption.ts`)
- Stripe test key in `.env` is expired (known; CLI auth 401 on `pnpm dev`)
- Optional follow-up: enable JWT signing keys in Supabase dashboard and set `NUXT_PUBLIC_SUPABASE_KEY` (publishable) + `NUXT_SUPABASE_SECRET_KEY` (legacy anon key still works)

---

## Guiding principles

- Stabilize first, then climb the stack
- One major concern per PR when possible
- Do **not** combine Nuxt 4 + Tailwind 4 + Reka/shadcn in one go
- Leave Zod 4 / Stripe majors / Pinia majors out of the Nuxt 4 week
- Avoid blind `pnpm update --latest`
- Skip Nuxt 5 / Nitro 3 for now — Nuxt 4 is the revival target

---

## Phase 0 — Make the frozen app runnable

**Effort:** 1–2 days  
**Goal:** Confirm the current tree still works before upgrading anything.  
**Status:** Done on branch `phase-0_runnable-frozen-app` (2026-08-10)

- [x] Use Node matching `.nvmrc` (prefer **22.19+**) — verified on Node **22.23.2**
- [x] Clean install: `pnpm install`
- [x] Run `pnpm dev`, `pnpm typecheck`, `pnpm lint`
- [x] Run unit / e2e if available and green — unit tests **run** after adding `happy-dom@15`, but **49 failing / 18 passing** (pre-existing Pinia setup gaps); e2e not required for Phase 0 exit
- [x] Fix only blockers (env, build, auth redirect)
- [x] Tag or branch `revive/baseline` for comparison — using `phase-0_runnable-frozen-app`

**Exit criteria:** App boots, typecheck passes, core flows (login, closet, trip create) work.

### Phase 0 fixes applied

- Replaced `storeToRefs` with `toRef` in 3 files to unblock Pinia/`vue-tsc` typing errors
- Removed unused `components/ui/index.ts` root barrel (broke `shadcn-nuxt` scanner with ENOTDIR)
- Restored `pnpm lint` script; disabled crashing `@kalimahapps/tailwind/sort` rule
- Fixed indent errors in `utils/fetchCardType.ts`
- Added `happy-dom@^15` so Vitest can boot

### Known follow-ups (not Phase 0 blockers)

- Stripe test secret in `.env` is **expired** (`api_key_expired`) — refresh before billing/subscription work
- Unit tests need Pinia/`createTestingPinia` setup fixes (Phase 7 / later)
- ~4700 ESLint warnings remain (style/import order); 0 errors
- Browserslist/`caniuse-lite` data is ~20 months stale — safe to refresh in Phase 1

---

## Phase 1 — Stay on Nuxt 3, climb to latest 3.x

**Effort:** 1–3 days (with Phase 0)  
**Risk:** Low  
**Goal:** Close the 3.15 → last 3.x gap before Nuxt 4.  
**Status:** Done on branch `phase-1_update-nuxt` (2026-08-10)

```bash
npx nuxt@latest upgrade --dedupe --channel=v3
```

### Bump (compat-safe)

- [x] `@supabase/supabase-js` → 2.112.2, `supabase` CLI → 2.113.0
- [x] `@playwright/test` → 1.62.1, `dayjs` → 1.11.21, filepond patches, `tsx` → 4.23.12, `papaparse` → 5.5.4
- [x] Removed Vite `6.0.6` pin (Nuxt 3.21 pulls Vite **7.3.6**)
- [x] Pin `@nuxt/devtools` → `^3.4.1` (was `"latest"`)

### Also done

- [x] `nuxt` **3.15.0 → 3.21.11**
- [x] `@vitejs/plugin-vue` → 6.0.8, `vue-tsc` → 2.2.12, `@types/node` → 22.x (Vite 7 peers)
- [x] Bumped `compatibilityDate` to `2025-07-15`
- [x] Refreshed `caniuse-lite` / browserslist
- [x] Fixed ~50 typecheck breakages from Nuxt 3.21 + supabase-js typing (removed `.returns<T>()`, explicit callback types, vitest Vite plugin conflict)
- [x] Simplified `watch` usage: root cause was Nuxt auto-imported `watch` losing overloads — fixed with explicit `import { watch } from 'vue'` (cookie watches use `() => cookie.value`). Revisit after Nuxt 4 (see Phase 2 step 7).
- [x] Fixed Volar “Cannot find name `ref`/`useXStore`” / `@/` path errors: Vue Official **3.3.9** always uses `ts-plugin` (`hybridMode` is gone). Need `@vue/typescript-plugin@3.3.9` in generated tsconfig + restore `baseUrl: '.'` (do **not** override Nuxt `paths`). Also avoid broken `~/modules` types refs; keep vitest globals in `vitest-globals.d.ts`.

### Skip for now

- Tailwind 4
- ESLint 9+
- Pinia 3/4
- Zod 4
- Stripe majors
- `radix-vue` → `reka-ui`

**Exit criteria:** Still Nuxt 3, green CI, no intentional product changes. ✅ (`pnpm typecheck` / `pnpm lint` 0 errors; `/login` 200 on Nuxt 3.21.11)

---

## Phase 2 — Nuxt 4 migration

**Effort:** 2–5 days  
**Risk:** High / highest priority  
**Goal:** Land on supported Nuxt 4.x.  
**Status:** Done on branch `phase-2_nuxt-4-migration` (2026-08-11)

### Steps

1. [x] On latest Nuxt 3, enable compatibility mode:
   ```ts
   future: { compatibilityVersion: 4 }
   ```
2. [x] Fix breakages (data fetching defaults, shared types, directory/layout expectations)
   - [x] Opt out of Nuxt 4 `noUncheckedIndexedAccess` for now (~90+ app errors); re-enable + fix later
   - [x] Keep v3 directory layout: `srcDir: '.'` + `dir.app: 'app'`
   - [x] Smoke-test under Nuxt 4.5.2: `/login` 200; auth pages redirect 302; `vue-tsc` 0 in-dev
   - [x] Reviewed shared `useFetch('/api/profile')` across layouts — same URL/default key is intentional (shared profile cache)
3. [x] Upgrade to **Nuxt 4.5.2** (`vue-router@5.2.0`, `vue-tsc@3.3.9`, `typescript@5.9.3`)
4. [x] Update `compatibilityDate` → `2026-08-11`
5. [x] Confirm Node engine — **22.23.2** satisfies Nuxt 4.5 (`^22.19 \|\| ^24.11 \|\| ≥26`)
6. [x] Reviewed `build.transpile` (`vue-datepicker`, `echarts`, `zrender`, `tslib`) — keep for now
7. [x] **Simplified `watch` imports:** Nuxt 4 auto-imported `watch` infers again — removed explicit `import { watch } from 'vue'` workarounds. Kept `watch(() => cookie.value, …)` for `useCookie` reactivity.

### Also done

- [x] `pnpm.overrides.h3: 1.15.11` + clean `node_modules` so `#supabase/server` and Nitro share one `H3Event` type
- [x] Coerced `GcInlineEdit` `$event` to `string | null` in hike/trip detail widgets
- [x] `pnpm typecheck` / `pnpm lint` 0 errors on Nuxt 4.5.2

### Module watchlist (carry to Phase 3)

- `@nuxtjs/supabase` — plan v2 in Phase 3 (v1 still in use; h3 override is a stopgap)
- `@vueuse/nuxt` 10 — peer wants `nuxt@^3` (bump in Phase 3)
- `@pinia/nuxt` 0.5 / `pinia` 2.3 — `vue-router@5` peer wants Pinia 3/4
- `shadcn-nuxt` 0.11 — careful bump later; don’t force UI rewrite here

**Exit criteria:** Nuxt 4.x, app builds, auth + main pages work. ✅

---

## Phase 3 — Core Nuxt modules

**Effort:** 1–3 days  
**Risk:** Medium  
**Goal:** Align ecosystem modules with Nuxt 4, one package at a time.  
**Status:** Done on branch `phase-3_core-nuxt-modules-upgrade` (2026-08-11)

| Package | Move | Notes | Done |
|---|---|---|---|
| `@nuxtjs/supabase` | 1 → **2.0.10** | `useSupabaseUser` / `serverSupabaseUser` → JWT claims (`sub` not `id`); `cookieRedirect` → `saveRedirectToCookie`; `types: '~/types/index.ts'` | [x] |
| `@vueuse/nuxt` / `@vueuse/core` | 10 → **14.4.0** | Peer now accepts Nuxt 4 | [x] |
| `@pinia/nuxt` + `pinia` (+ `@pinia/testing`) | → **1.0.1 / 4.0.2 / 2.0.1** | Satisfies vue-router 5 peer | [x] |
| `@nuxtjs/color-mode` | 3 → **4.0.1** | | [x] |
| `@nuxt/test-utils` | 3 → 4 | Deferred — pair with Vitest bump in Phase 7 | [ ] deferred |
| `nuxt-lucide-icons` | 1 → **2.1.0** (`@lucide/vue`) | `Icon*` prefix still works via `lucide.namePrefix` | [x] |

### Also done

- [x] Migrated all supabase user id reads: `user.id` → `user.sub` (client + server)
- [x] `stores/auth.ts` `currentUser` typed as `JwtPayload | null`
- [x] Removed Phase 2 `pnpm.overrides.h3` stopgap (single `h3@1.15.11` after supabase v2)
- [x] Updated `.env.example` notes for publishable / secret keys
- [x] `pnpm typecheck` / `pnpm lint` 0 errors

**Regression focus:** auth middleware, `/callback`, login redirect cookie (`saveRedirectToCookie`), and any code that assumed full `User` fields (`identities`, `last_sign_in_at`, etc. — none found in app code).

**Exit criteria:** Modules aligned with Nuxt 4 peers; supabase auth flows work. ✅ (manual smoke of login/callback recommended before merge)

---

## Phase 4 — UI stack (largest blast radius)

**Effort:** 3–7 days  
**Risk:** Very high  
**Defer until:** Nuxt 4 is solid  
**Status:** Done on branch `phase-4_ui-stack-upgrade` (2026-08-11)

~113 files previously imported `radix-vue` under `components/ui`.

### Target end state

- [x] `radix-vue` → **`reka-ui` 2.10.3** ([migration guide](https://reka-ui.com/docs/guides/migration))
- [x] `shadcn-nuxt` 0.11 → **2.8.2**
- [x] Mechanical migration (not full CLI regenerate) — preserves `*Root` barrels, Input/Textarea customizations, toast variants, Multiselect

### Also done

- [x] CSS `--radix-*` → `--reka-*` (tailwind accordion/collapsible, toast, select, multiselect, combobox)
- [x] `v-model:checked` → `v-model` on delete-confirm dialogs
- [x] Combobox: Multiselect search on `ComboboxInput`; Command `ignore-filter` + search emit on input
- [x] Dropped `fixShadcnComponentDirs` (no same-name duplicates under shadcn-nuxt 2); kept `components.ignore: ['ui/**']` for barrel registration
- [x] Added real [`lib/utils.ts`](lib/utils.ts) `cn()` helper (shadcn-nuxt 2 no longer aliases `@/lib/utils` to `.nuxt`)
- [x] Select handlers accept Reka `AcceptableValue`
- [x] Kept toast `shallowRef` workaround (still needed)
- [x] `pnpm typecheck` / `pnpm lint` 0 errors; `/login` smoke

**Do not** combine this with Tailwind 4 in the same PR.

**Exit criteria:** reka-ui + shadcn-nuxt 2, app builds, core UI (dialogs/select/toast) works. ✅

---

## Phase 5 — Tailwind 4

**Effort:** 2–4 days  
**Risk:** High  
**Status:** Done on branch `phase-5_taildwind-4-upgrade` (2026-08-11)

### Done

- [x] Dedicated PR / branch only (no Zod/Stripe/etc.)
- [x] Removed `@nuxtjs/tailwindcss` + PostCSS Tailwind plugins
- [x] Installed `tailwindcss@4.3.3` + `@tailwindcss/vite` + `tw-animate-css`
- [x] Wired Nuxt via `css: ['~/assets/css/tailwind.css']` and `vite.plugins: [tailwindcss()]`
- [x] Ran `@tailwindcss/upgrade` for template renames (`shadow-sm`→`shadow-xs`, `outline-none`→`outline-hidden`, etc.)
- [x] Kept JS theme bridge via `@config '../../tailwind.config.ts'` (complex `hsl(var(--*))` + SVG backgrounds)
- [x] Replaced `tailwindcss-animate` with `@import 'tw-animate-css'`
- [x] Class dark mode: `@custom-variant dark` + `.dark { … }` tokens
- [x] Replaced removed `resolveConfig` helper in [`utils/tailwind.ts`](utils/tailwind.ts)
- [x] `pnpm typecheck` / `pnpm lint` 0 errors
- [x] Smoke: `/login` 200; `/_nuxt/assets/css/tailwind.css` serves TW4 utilities (`bg-primary`, `outline-hidden`, `shadow-xs`, `tw-animate`)

### Follow-up (optional)

- [ ] Full CSS `@theme` migration (drop JS `@config` bridge)
- [ ] Visual regression pass on closet / planning / auth dialogs (manual)

**Exit criteria:** Tailwind 4 via Vite plugin, app builds and styles load. ✅

---

## Phase 6 — Domain & library majors

**Effort:** 2–5 days (spread across PRs)  
**Risk:** Medium–high depending on package  
**Status:** In progress on branch `phase-6_domain-and-library-majors` (2026-08-11)

### Do soon (security / maintenance)

- [x] Replace **`crypto-js`** (deprecated) with `@noble/ciphers` AES-GCM + `@noble/hashes` — new `gc1.` payloads; legacy CryptoJS cookies/query values no longer decrypt (users reselect pack/trip)
- [ ] Stripe: bump server `stripe` and client `@stripe/stripe-js` in a dedicated PR; retest checkout / webhook / payment method dialogs — **deferred** until a fresh Stripe test key is available
- [x] `@vuepic/vue-datepicker` 8 → **14.0.0** (named import, `formats` / `ui` / `input-attrs` / `time-config`, dash CSS classes)

### Defer or isolate

- [ ] **Zod 4** — touches forms + `@vee-validate/zod`; wait until forms are green on Nuxt 4
- [ ] **dinero.js 2** — money API rewrite; small surface (~2 files), different model
- [ ] **convert 7**, **uuid 14**, **echarts 6** + **vue-echarts 8** — chart/weight UI regressions
- [ ] **`@tanstack/vue-table` 9** — table API changes (`PackItemsTable`)
- [ ] **vue-sonner / vue-gtag / vue-filepond** majors — small, separate commits

### Safe patch/minor anytime

- [ ] dayjs, filepond plugins, papaparse, tippy, onboarding, etc.

---

## Phase 7 — Tooling last

**Effort:** included in 2–5 days with Phase 6  
**Risk:** Medium

- [ ] ESLint 8 → 9+ (flat config); retire `.eslintrc.cjs`; bump `@typescript-eslint/*`, `eslint-plugin-vue`, perfectionist
- [ ] Vitest 1 → 4 with `@nuxt/test-utils` 4
- [ ] Keep TypeScript on **5.x** for now (7 is too bleeding-edge for this stack)
- [ ] Bump `packageManager` pnpm field from 9.1 toward current 9/10 deliberately

---

## Suggested PR sequence

1. [ ] `chore: baseline revive` — Node, install, fix boot
2. [ ] `chore: nuxt 3.15 → latest 3.x` + safe minors
3. [ ] `chore: enable Nuxt 4 compatibility mode`
4. [ ] `chore: upgrade to Nuxt 4`
5. [ ] `chore: @nuxtjs/supabase v2` + auth fixes
6. [ ] `chore: pinia/vueuse/color-mode`
7. [ ] `chore: radix-vue → reka-ui / shadcn-nuxt 2`
8. [ ] `chore: stripe majors`
9. [ ] `chore: eslint flat + vitest 4`
10. [ ] Optional: Tailwind 4, Zod 4, dinero 2, echarts 6

---

## Effort summary

| Phase | Rough effort |
|---|---|
| 0–1 Baseline + Nuxt 3 latest | 1–3 days |
| 2 Nuxt 4 | 2–5 days |
| 3 Modules (esp. Supabase) | 1–3 days |
| 4 UI / Reka / shadcn | 3–7 days |
| 5 Tailwind 4 | 2–4 days (later) |
| 6–7 Domain + tooling | 2–5 days |

---

## Bottom line

Treat this as a **Nuxt 4 revival** with staged module upgrades:

1. Latest Nuxt 3
2. Compatibility mode
3. Nuxt 4
4. Supabase / Pinia
5. UI migration (Reka / shadcn)
6. Leave Tailwind 4 and Zod/Stripe majors for after the app is healthy on Nuxt 4
