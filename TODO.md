# Dependency Upgrade Plan

Revive the late-2024 / early-2025 Nuxt 3 stack toward current Nuxt 4. Do this in staged PRs — not one “update everything” change.

> **Context:** Nuxt 3 reached EOL on July 31, 2026. Current stable is Nuxt 4.5.x. Primary goal is a controlled path to Nuxt 4.

---

## Current baseline

| Layer | Ours | Latest | Risk |
|---|---|---|---|
| Node (`.nvmrc`) | 22 | Nuxt 4.5 wants `^22.19 \|\| ^24.11 \|\| ≥26` | Low if patch bumped |
| Nuxt | 3.15.0 | **4.5.2** (3.x still ~3.17–3.21) | **High / urgent** |
| Tailwind | 3.4 | 4.3 | High (defer) |
| UI | `radix-vue` + `shadcn-nuxt` 0.11 | `reka-ui` + `shadcn-nuxt` 2.x | **Very high** (~113 files) |
| Supabase module | 1.4.5 | 2.0.10 | Medium |
| Pinia / `@pinia/nuxt` | 2.3 / 0.5 | 4.x / 1.x | Medium |
| ESLint | 8 + ts-eslint 6 | 9/10 + flat config | Medium |
| Stripe | stripe-js 5 / stripe 17 | 9 / 22 | Medium–high |
| Zod | 3.x | 4.x | Medium |
| Vitest | 1.6 | 4.x | Medium |

Also notable:

- `crypto-js` is **deprecated** (used in `utils/encryption.ts`)
- Vite is hard-pinned via `resolutions: { "vite": "6.0.6" }`

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

### Steps

1. [ ] On latest Nuxt 3, enable compatibility mode:
   ```ts
   future: { compatibilityVersion: 4 }
   ```
2. [ ] Fix breakages (data fetching defaults, shared types, directory/layout expectations)
3. [ ] Upgrade:
   ```bash
   npx nuxt upgrade --dedupe
   ```
4. [ ] Update `compatibilityDate`
5. [ ] Confirm Node engine matches Nuxt 4.5 requirements
6. [ ] Drop obsolete `build.transpile` entries if no longer needed
7. [ ] **Simplify `watch` imports:** Nuxt 3.21 auto-imported `watch` loses overload inference (callback params become implicit `any`). We work around this with explicit `import { watch } from 'vue'` in affected SFCs (and `watch(() => cookie.value, …)` for `useCookie`). After Nuxt 4, re-check whether auto-imported `watch` infers again; if yes, remove those explicit imports.

### Module watchlist

- `@nuxtjs/supabase` — plan v2 in Phase 3 (v1 may still install briefly)
- `@nuxtjs/tailwindcss` 6.x — fine on Tailwind 3
- `@pinia/nuxt` 0.5 — may need bump with Nuxt 4
- `shadcn-nuxt` 0.11 — careful bump later; don’t force UI rewrite here

**Exit criteria:** Nuxt 4.x, app builds, auth + main pages work.

---

## Phase 3 — Core Nuxt modules

**Effort:** 1–3 days  
**Risk:** Medium  
**Goal:** Align ecosystem modules with Nuxt 4, one package at a time.

| Package | Move | Notes | Done |
|---|---|---|---|
| `@nuxtjs/supabase` | 1 → **2** | `useSupabaseUser` becomes JWT **claims**, not full User; env keys toward publishable/secret | [ ] |
| `@vueuse/nuxt` / `@vueuse/core` | 10 → 14 | Usually smooth; retest composables | [ ] |
| `@pinia/nuxt` + `pinia` | → current majors | Align with Nuxt 4 peers | [ ] |
| `@nuxtjs/color-mode` | 3 → 4 | Small surface | [ ] |
| `@nuxt/test-utils` | 3 → 4 | Pair with Vitest bump in Phase 7 | [ ] |
| `nuxt-lucide-icons` | 1 → 2 | Check `Icon*` naming | [ ] |

**Regression focus:** `stores/auth.ts`, middleware, callback / redirect flows for Supabase v2.

---

## Phase 4 — UI stack (largest blast radius)

**Effort:** 3–7 days  
**Risk:** Very high  
**Defer until:** Nuxt 4 is solid

~113 files import `radix-vue` under `components/ui`.

### Target end state

- [ ] `radix-vue` → **`reka-ui`** ([migration guide](https://reka-ui.com/docs/guides/migration))
- [ ] `shadcn-nuxt` 0.11 → **2.x**
- [ ] Prefer regenerating components with `npx shadcn-vue@latest add …` over hand-editing every file

### Expect

- Import renames (`radix-vue` → `reka-ui`)
- `--radix-*` / `data-radix-*` → `--reka-*` / `data-reka-*`
- Some form API changes (`v-model:checked` → `v-model`)
- Regenerating toast may drop the `shallowRef` workaround in `use-toast.ts` (needed today because radix-vue `ToastProps` is too deep for Vue `Ref` unwrap / TS2589)
- Drop `fixShadcnComponentDirs` in `nuxt.config.ts` and `components.ignore: ['ui/**']` once shadcn-nuxt no longer double-scans `components/ui`

**Do not** combine this with Tailwind 4 in the same PR.

---

## Phase 5 — Tailwind 4 (optional / later)

**Effort:** 2–4 days  
**Risk:** High  
**Defer until:** UI + Nuxt 4 are stable

Keep **Tailwind 3.4** for now.

### Why defer

- Official `@nuxtjs/tailwindcss` Tailwind 4 path has been rocky
- Recommended Nuxt approach is `@tailwindcss/vite` + CSS-first config
- Current shadcn setup still uses `tailwind.config.ts` + `assets/css/tailwind.css`

### When doing it

- [ ] Dedicated PR only
- [ ] Visual regression pass on closet / planning / auth dialogs

---

## Phase 6 — Domain & library majors

**Effort:** 2–5 days (spread across PRs)  
**Risk:** Medium–high depending on package

### Do soon (security / maintenance)

- [ ] Replace **`crypto-js`** (deprecated) — Web Crypto or maintained AES helper; verify existing encrypted cookies still decrypt or migrate values
- [ ] Stripe: bump server `stripe` and client `@stripe/stripe-js` in a dedicated PR; retest checkout / webhook / payment method dialogs
- [ ] `@vuepic/vue-datepicker` 8 → 14 (few call sites — good candidate)

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
