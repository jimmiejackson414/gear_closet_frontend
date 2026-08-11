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
| ESLint | **10.8.1** (`@nuxt/eslint` flat) | 10.x | Done (Phase 7) |
| Vitest / `@nuxt/test-utils` | **4.1.10 / 4.1.0** | 4.x / 4.x | Done (Phase 7) |
| Stripe | stripe-js 5 / stripe 17 (`@fixers/nuxt-stripe` **4.1.1**) | 9 / 22 | Deferred (needs fresh key) |
| Zod | 3.x | 4.x | Deferred (vee-validate peers zod 3) |

Also notable:

- `crypto-js` replaced in Phase 6 (`@noble/ciphers` / `@noble/hashes` in `utils/encryption.ts`)
- Stripe test key in `.env` is expired (known; CLI auth 401 on `pnpm dev`) — refresh before billing work
- Optional: enable JWT signing keys in Supabase dashboard and set `NUXT_PUBLIC_SUPABASE_KEY` (publishable) + `NUXT_SUPABASE_SECRET_KEY`

---

## Guiding principles

- Stabilize first, then climb the stack
- One major concern per PR when possible
- Do **not** combine unrelated majors in one PR
- Avoid blind `pnpm update --latest`
- Skip Nuxt 5 / Nitro 3 for now — Nuxt 4 is the revival target

---

## Phase 0 — Make the frozen app runnable

**Status:** Done on branch `phase-0_runnable-frozen-app` (2026-08-10) ✅

- [x] Node / install / `pnpm dev` / typecheck / lint
- [x] Unit tests runnable (many pre-existing failures)
- [x] Boot blockers only

### Known follow-ups (carried forward)

- [ ] Stripe test secret in `.env` — refresh before billing (ops)
- [ ] Unit tests need Pinia/`createTestingPinia` setup fixes → **dedicated PR**
- [x] Browserslist / `caniuse-lite` refreshed in Phase 1

---

## Phase 1 — Stay on Nuxt 3, climb to latest 3.x

**Status:** Done on branch `phase-1_update-nuxt` (2026-08-10) ✅

- [x] Nuxt **3.15 → 3.21.11** + safe minors (`supabase-js`, Playwright, dayjs, etc.)

---

## Phase 2 — Nuxt 4 migration

**Status:** Done on branch `phase-2_nuxt-4-migration` (2026-08-11) ✅

- [x] Nuxt **4.5.2**, `vue-router@5`, `vue-tsc@3.3.9`, `typescript@5.9.3`
- [x] `srcDir: '.'` + `dir.app: 'app'` (v3 layout retained)
- [x] Opt out of `noUncheckedIndexedAccess` for now → **dedicated PR** to re-enable

---

## Phase 3 — Core Nuxt modules

**Status:** Done on branch `phase-3_core-nuxt-modules-upgrade` (2026-08-11) ✅

- [x] `@nuxtjs/supabase` **2.0.10** (`user.id` → `user.sub`, `saveRedirectToCookie`)
- [x] VueUse **14**, Pinia **4**, color-mode **4**, lucide-icons **2**
- [x] `@nuxt/test-utils` deferred to Phase 7 (done)

---

## Phase 4 — UI stack

**Status:** Done on branch `phase-4_ui-stack-upgrade` (2026-08-11) ✅

- [x] `radix-vue` → **`reka-ui` 2.10.3**, `shadcn-nuxt` **2.8.2**
- [x] Mechanical migration + `lib/utils.ts` `cn()`

---

## Phase 5 — Tailwind 4

**Status:** Done on branch `phase-5_taildwind-4-upgrade` (2026-08-11) ✅

- [x] `tailwindcss@4` + `@tailwindcss/vite` + `tw-animate-css`
- [x] Theme still bridged via `@config` + `tailwind.config.ts`

### Follow-up

- [ ] Full CSS `@theme` migration (drop JS `@config` bridge) → **dedicated PR**
- [ ] Manual visual regression on closet / planning / auth dialogs

---

## Phase 6 — Domain & library majors

**Status:** Done on branch `phase-6_domain-and-library-majors` (2026-08-11) ✅  
(Stripe majors deferred — see Remaining work)

### Done

- [x] Replace **`crypto-js`** with `@noble/ciphers` AES-GCM + `@noble/hashes` (`gc1.` payloads)
- [x] `@vuepic/vue-datepicker` 8 → **14.0.0**

### Deferred from Phase 6 → Remaining work

- [ ] Stripe majors (blocked on fresh test key + module peer pins)
- [ ] Zod 4, dinero 2, convert 7, uuid 14, echarts 6 + vue-echarts 8, vue-filepond 8
- [ ] Safe patch/minors (ongoing)

---

## Phase 7 — Tooling last

**Status:** Done on branch `phase-7_tooling-updates` (2026-08-11) ✅

- [x] ESLint **10** + `@nuxt/eslint` flat config; retired `.eslintrc.cjs`
- [x] Vitest **4** + `@nuxt/test-utils` **4** + `happy-dom` **20**
- [x] `packageManager` → **`pnpm@9.15.0`**
- [x] TypeScript stays on **5.x**

---

## Phase 8 — Post-upgrade wrapup

**Effort:** ~0.5–1 day  
**Risk:** Low  
**Status:** Done on branch `phase-8_update-wrapup` (2026-08-11)

### Bugs / config

- [x] `PublicPackComment.vue`: remaining `user.id` → `user.sub` (own-comment highlight/delete)
- [x] `lib/cloudinary.ts`: `CLOUDINARY_CLOUD_NAME` → `cloudinaryCloudName`
- [x] Align `@fixers/nuxt-stripe` `publishableKey` with `NUXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (+ `.env.example` note)

### Cleanup

- [x] Remove unused deps: `vue-gtag`, `vue-sonner` (+ `components/ui/sonner`), `@tanstack/vue-table`, `v-onboarding`, dead `walkthroughSteps.ts`, unused `autoprefixer` / `postcss`, stale `@types/echarts`
- [x] Finish TW4 class renames (`shadow-sm` → `shadow-xs` leftovers)
- [x] Bump `@fixers/nuxt-stripe` **4.0 → 4.1.1**, `vue-tippy` **6.6 → 6.7.1**
- [x] README → Nuxt 4 / current stack; remove obsolete snaplet script mention

**Exit criteria:** Post-upgrade bugs fixed, dead weight removed, docs accurate. ✅

---

## Remaining work (dedicated PRs)

Do these as **separate PRs** — not one mega upgrade.

### Ops / env (no code PR required)

- [ ] Refresh Stripe **test secret** in `.env` (current key expired — blocks billing smoke + Stripe majors)
- [ ] Optional: Supabase JWT signing keys + `NUXT_SUPABASE_SECRET_KEY`

### High priority product / quality

| PR | Scope | Notes |
|---|---|---|
| [ ] `fix: unit tests / Pinia setup` | Vitest specs + `@pinia/testing` | ~45 failing / 22 passing after Vitest 4; use `createTestingPinia` |
| [ ] `chore: stripe majors` | `stripe` 17→22, `@stripe/stripe-js` 5→9 | Needs fresh key; `@fixers/nuxt-stripe` still peers stripe ^17 / stripe-js ^5 — may need module override/fork |

### Library majors (isolate)

| PR | Ours → target | Risk |
|---|---|---|
| [ ] `chore: zod 4` | 3 → 4 | Med–High — wait until `@vee-validate/zod` supports zod 4 |
| [ ] `chore: dinero.js 2` | 1 → 2 | Med — API rewrite (`utils/helpers.ts`, `utils/tiers.ts`) |
| [ ] `chore: convert 7` | 4 → 7 | Med — weight math call sites |
| [x] `chore: uuid 14` | 9 → **14.0.1** | Done on `phase-9_stability-and-safe-bumps` |
| [ ] `chore: echarts 6 + vue-echarts 8` | 5/6 → 6/8 | Med — chart visual regression |
| [x] `chore: vue-filepond 8` | 7 → **8.0.0** | Done on `phase-9_stability-and-safe-bumps` (Vite 8 default-export interop) |

### Optional polish

| PR | Scope | Notes |
|---|---|---|
| [ ] `chore: tailwind @theme migration` | Drop JS `@config` bridge | Visual risk; keep `utils/tailwind.ts` for non-CSS callers |
| [ ] `chore: enable noUncheckedIndexedAccess` | Fix ~90+ indexed access errors | Opted out in Phase 2 |
| [ ] `chore: migrate to Nuxt app/ directory` | Drop `srcDir: '.'` layout | Large move; optional |
| [ ] `chore: eslint stylistic warn cleanup` | Reduce warn noise / selective `--fix` | Not a blocker (0 errors today) |
| [~] Safe patch/minors anytime | **Phase 9:** `dotenv` 17, `sortablejs` 1.15.7; tippy already current | Remaining: `tailwind-merge` 3, etc. |

---

## Phase 9 — Stability + safe bumps

**Status:** In progress on branch `phase-9_stability-and-safe-bumps` (2026-08-11)

- [x] Pin `vue@3.5.41` (+ `pnpm.overrides`) to fix SSR `currentRenderingInstance.ce` white screen (duplicate Vue)
- [x] Transpile `reka-ui`
- [x] `UpgradeCard` required `tier` prop (vue-tsc)
- [x] `uuid` **14.0.1** (dropped `@types/uuid`; package ships types)
- [x] `vue-filepond` **8.0.0** + Vite 8 default-export interop in `GcAvatarUpload.vue`
- [x] Safe minors: `dotenv` **17.4.2**, `sortablejs` **1.15.7**

### Explicitly out of scope for now

- Nuxt 5 / Nitro 3
- Blind `pnpm update --latest`
- Re-adding unused packages (`vue-gtag`, `vue-sonner`, `@tanstack/vue-table`) unless product needs them

---

## Completed PR sequence (Phases 0–8)

1. [x] Baseline revive
2. [x] Nuxt 3.15 → latest 3.x + safe minors
3. [x] Nuxt 4 compatibility → Nuxt 4.5
4. [x] `@nuxtjs/supabase` v2 + Pinia / VueUse / color-mode
5. [x] `radix-vue` → reka-ui / shadcn-nuxt 2
6. [x] Tailwind 4
7. [x] Domain: crypto-js → noble, datepicker 14
8. [x] ESLint flat + Vitest 4
9. [x] Phase 8 wrapup (bugs, dead deps, docs)
10. [~] Phase 9 stability + uuid/filepond/safe minors (this branch)

---

## Effort summary

| Phase | Rough effort | Status |
|---|---|---|
| 0–1 Baseline + Nuxt 3 latest | 1–3 days | ✅ |
| 2 Nuxt 4 | 2–5 days | ✅ |
| 3 Modules (esp. Supabase) | 1–3 days | ✅ |
| 4 UI / Reka / shadcn | 3–7 days | ✅ |
| 5 Tailwind 4 | 2–4 days | ✅ |
| 6 Domain libraries | 1–2 days (+ Stripe later) | ✅ / Stripe deferred |
| 7 Tooling | 1–2 days | ✅ |
| 8 Wrapup | ~0.5–1 day | ✅ |
| 9 Stability + safe bumps | ~0.5 day | In progress |
| Remaining dedicated PRs | 2–5+ days spread | Open |

---

## Bottom line

The **Nuxt 4 revival is complete** through tooling and wrapup. Next work is opportunistic or dedicated:

1. Land Phase 9 (Vue pin / reka SSR fix + uuid 14 + filepond 8 + safe minors)
2. Refresh Stripe test key → Stripe majors PR  
3. Fix unit test Pinia setup  
4. Isolated library majors (convert / dinero / echarts / Zod when ready)  
5. Optional polish (`@theme`, `noUncheckedIndexedAccess`, ESLint warn debt)
