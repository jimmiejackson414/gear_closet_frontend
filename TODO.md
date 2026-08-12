# Gear Closet Frontend — TODO

Nuxt 4 revival (Phases 0–10) is **complete**. This file tracks remaining product, quality, and dependency work.

> **Stack snapshot:** Nuxt **4.5.2** · Vue **3.5.41** · Tailwind **4.3** · reka-ui / shadcn-nuxt **2.8** · Pinia **4** · Vitest **4** · `stripe` **22.5** / `@stripe/stripe-js` **9.13** · `convert` **7** · `dinero.js` **2** · `echarts` **6** / `vue-echarts` **8**


---

## Guiding principles

- One major concern per PR when possible
- Do **not** combine unrelated majors in one PR
- Avoid blind `pnpm update --latest`
- Skip Nuxt 5 / Nitro 3 for now

---

## Next up — Planning page quality & performance

Audit of `pages/planning.vue` → `PlanningContainer` → store → widgets/dialogs (2026-08-12). Architecture (one RPC → Pinia → widgets) is fine; fetch orchestration and write boundaries need work.

### High

- [ ] **Single-flight page load** — `PlanningContainer.vue`  
  Cookie watcher (`immediate`) + `onMounted` both call `fetchPlanningPage` → double RPC / race. One source of truth for trip id (query > cookie > first trip); cancel or ignore stale in-flight requests.

- [ ] **Trip select must always refetch** — `PlanningSettings.vue` + container  
  Select only updates cookie/`selectedTripId`. Cookie watcher skips fetch when `?trip=` is present → widgets can show the previous trip’s data. On select: set cookie (optionally sync/clear query), then `await fetchPlanningPage(id)`.

- [ ] **After create trip, load that trip** — `CreateTripDialog.vue`  
  Sets `selectedTripId` but never refetches; widgets keep prior pack/todos/poll. Always push trip (or refetch), set cookie + id, call `fetchPlanningPage(newId)`. Remove the `if ($store.selectedTripId)` gate.

- [ ] **Fix batch “select all” complete** — `TodosWidget.vue`, `ShoppingListWidget.vue`  
  Header checkbox upserts rows without toggling `completed`. Wire Group todos header too.

- [ ] **Stop poll dialog mutating live store** — `ModifyPollDialog.vue`, `PollWidget.vue`  
  Shallow copy still shares nested `question`/`answers`; `blankModalForm` is a module-level mutable singleton. Deep-clone on open; reset on close; write poll only after successful RPC.

- [ ] **Harden `fetchPlanningPage`** — `stores/planning.ts`  
  Surface RPC `error`; normalize null → `[]` / `undefined`; guard empty trips; type `tripId`; avoid non-null assert on `findSelectedTrip`.

### Medium

- [ ] **Move mutations into store actions** (or `usePlanningMutations`)  
  Trip/hike details, todos, shopping, poll, pack change each own Supabase + `$store.data` splices. Centralize for consistent optimistic updates / rollback (`Object.assign` vs splice).

- [ ] **Narrow trip-switch loading UX**  
  Full-grid `pageLoading` remounts all seven widgets and tears down ECharts. Prefer keep-previous-data + light overlay (or skeleton only changed panes).

- [ ] **Stabilize Pack chart options** — `PackWidget.vue`  
  Precompute series data; update theme via `setOption` (closet pattern) instead of rebuilding the whole options tree; collapse double `nextTick` + 100ms delays.

- [ ] **Finish or hide incomplete features**  
  Implement or remove `leaveTrip`; render friends list aligned with RPC shape (or fix RPC); remove `"Display friends"` placeholder; add missing `finally` on `ChangePackDialog.updateTripPack` (`submitting` can stick).

- [ ] **Deduplicate Trip/Hike detail and Todos/Shopping** into shared parameterized components.

- [ ] **Invite search** — `InviteFriendsDialog.vue`  
  Escape/parameterize `ilike` terms; debounce `@search`; fix profile id matching (`f.id` vs nested profile).

- [ ] **Error handling consistency** — check Supabase `error` in `PollChart` vote/answer paths; store RPC path; dialog `finally` blocks.

### Low

- [ ] Remove `console.log` in `TripDetailsWidget`
- [ ] Tippy copy: “trips” not “packs” for trip limit
- [ ] Empty-state disabled logic is effectively dead — clean up
- [ ] Modify Detail dialog title should reflect trip vs hike
- [ ] `PollChart`: stable `:key="answer.id"`; set loading on vote; simplify `totalVotes`
- [ ] Align emit names (`close` / `update:open`) when touching those files

---

## Post-upgrade QA leftovers (in progress / follow-up)

Work found while smoking the app after Phases 0–10 (branch `post-update-improvements`).

### Done on this pass

- [x] `GcAlert` severity classes → current theme tokens (`destructive` / `accent` / etc.)
- [x] Legacy Tailwind remaps: `danger` / `positive` / `dark-grey` / `shadow-light` / `ease-snap` / `q-mb-*` / `text-grey` / `ease-expo`
- [x] `clas=` → `class=` on login/register; orphaned `_toast.css` removed
- [x] Button `cursor: pointer` restored (Tailwind 4 Preflight)
- [x] Pack table headers: `opacity-1` → `opacity-100` (v4 treats `opacity-1` as 1%)

### Still open from visual QA / ops

- [ ] Manual visual regression pass on **closet / planning / auth** dialogs (Phase 5 follow-up)
- [ ] Manual chart smoke after echarts 6 (closet pack bar, planning pie, public pack summary)
- [ ] Manual Stripe billing smoke with refreshed test keys (subscribe / update PM / webhook)
- [x] Asymmetric JWT signing keys — already Active (ECC P-256) on hosted project

---

## Remaining dependency / platform work

Do these as **separate PRs**.

### Ops / env

- [x] Supabase publishable + secret API keys — local `.env` wired to `sb_publishable_*` / `sb_secret_*` (`NUXT_PUBLIC_SUPABASE_KEY`, `NUXT_SUPABASE_SECRET_KEY`); `.env.example` documents hosted dashboard steps
- [x] **Asymmetric JWT signing keys** — hosted project already on Signing Keys with an **Active ECC (P-256)** key (no separate “enable” toggle). Optional later: create standby → rotate; revoke legacy JWT secret only after publishable/secret API keys are in use everywhere
- [x] `@stripe/stripe-js` 5→**9.13** — removed `@fixers/nuxt-stripe`; thin `composables/useStripe.ts` + `server/utils/stripeWebhookHandler.ts` replacements


### Library majors

| PR | Ours → target | Risk / notes |
|---|---|---|
| [ ] `chore: zod 4` | 3 → 4 | **Still blocked** — `@vee-validate/zod@4.15.1` peers `zod: ^3.24` only |
| [x] `chore: dinero.js 2` | 1 → **2.0.2** | Done on `chore/library-majors-convert-dinero-echarts` — functional API + `toDecimal` / `USD` currency objects; dropped `@types/dinero.js` |
| [x] `chore: convert 7` | 4 → **7.0.2** | Done on same branch — API compatible (ES2017+ requirement only) |
| [x] `chore: echarts 6 + vue-echarts 8` | 5/6 → **6.1 / 8.1** | Done on same branch — existing tree-shake `use([...])` imports still valid; **manual chart visual smoke** recommended |

### Optional polish

| PR | Scope | Notes |
|---|---|---|
| [ ] `chore: tailwind @theme migration` | Drop JS `@config` bridge | Visual risk; keep `utils/tailwind.ts` for non-CSS callers |
| [ ] `chore: enable noUncheckedIndexedAccess` | Fix ~90+ indexed access errors | Opted out in Phase 2 |
| [ ] `chore: migrate to Nuxt app/ directory` | Drop `srcDir: '.'` layout | Large move; optional |
| [ ] `chore: eslint stylistic warn cleanup` | Reduce warn noise / selective `--fix` | Not a blocker (0 errors today) |
| [ ] Safe patch/minors | e.g. `tailwind-merge` 3 | Anytime |

### Explicitly out of scope

- Nuxt 5 / Nitro 3
- Blind `pnpm update --latest`
- Re-adding unused packages (`vue-gtag`, `vue-sonner`, `@tanstack/vue-table`) unless product needs them

---

## Completed — Nuxt 4 revival (Phases 0–10)

| Phase | What landed | Status |
|---|---|---|
| 0–1 | Runnable app + Nuxt 3.15 → 3.21 | ✅ |
| 2 | Nuxt **4.5.2**, vue-router 5, vue-tsc 3 | ✅ |
| 3 | Supabase v2 (`user.sub`), Pinia 4, VueUse 14 | ✅ |
| 4 | radix-vue → reka-ui / shadcn-nuxt 2.8 | ✅ |
| 5 | Tailwind 4 + `@tailwindcss/vite` | ✅ |
| 6 | crypto-js → noble; datepicker 14 | ✅ |
| 7 | ESLint flat 10; Vitest 4; pnpm 9.15 | ✅ |
| 8 | Wrapup bugs, dead deps, docs | ✅ |
| 9 | Vue pin 3.5.41; uuid 14; vue-filepond 8 | ✅ |
| 10 | Unit tests **67/67**; Stripe Node **22.5** (Basil period fields) | ✅ |

---

## Suggested PR order from here

1. **Planning fetch + correctness** (High items 1–6) — biggest functional/perf win  
2. **Planning mutations / loading / chart** (Medium)  
3. Closet/auth/chart visual QA leftovers + Stripe smoke  
4. Zod 4 when `@vee-validate/zod` peers allow  
5. Optional polish (`@theme`, `noUncheckedIndexedAccess`, ESLint warns)  
6. Optional: revoke legacy JWT secret after fully off `anon` / `service_role`
