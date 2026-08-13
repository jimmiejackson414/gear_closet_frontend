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

## Page quality & performance

Audits of fetch orchestration, write boundaries, and correctness (2026-08-12). Architecture pattern (RPC → Pinia → widgets) is generally fine; issues below are per page by priority.

---

### Planning

`pages/planning.vue` → `PlanningContainer` → store → widgets/dialogs.

#### High

- [x] **Single-flight page load** — `PlanningContainer.vue`  
  Cookie watcher (`immediate`) + `onMounted` both call `fetchPlanningPage` → double RPC / race. One source of truth for trip id (query > cookie > first trip); cancel or ignore stale in-flight requests.

- [x] **Trip select must always refetch** — `PlanningSettings.vue` + container  
  Select only updates cookie/`selectedTripId`. Cookie watcher skips fetch when `?trip=` is present → widgets can show the previous trip’s data. On select: set cookie (optionally sync/clear query), then `await fetchPlanningPage(id)`.

- [x] **After create trip, load that trip** — `CreateTripDialog.vue`  
  Sets `selectedTripId` but never refetches; widgets keep prior pack/todos/poll. Always push trip (or refetch), set cookie + id, call `fetchPlanningPage(newId)`. Remove the `if ($store.selectedTripId)` gate.

- [x] **Fix batch “select all” complete** — `TodosWidget.vue`, `ShoppingListWidget.vue`  
  Header checkbox upserts rows without toggling `completed`. Wire Group todos header too.

- [x] **Stop poll dialog mutating live store** — `ModifyPollDialog.vue`, `PollWidget.vue`  
  Shallow copy still shares nested `question`/`answers`; `blankModalForm` is a module-level mutable singleton. Deep-clone on open; reset on close; write poll only after successful RPC.

- [x] **Harden `fetchPlanningPage`** — `stores/planning.ts`  
  Surface RPC `error`; normalize null → `[]` / `undefined`; guard empty trips; type `tripId`; avoid non-null assert on `findSelectedTrip`.

> High + Medium + Low done on branch `fix/planning-high-priority-perf`.

#### Medium

- [x] **Move mutations into store actions** (or `usePlanningMutations`)  
  Trip/hike details, todos, shopping centralized on `stores/planning.ts` (`updateTrip`, trip detail CRUD, todos, shopping). Poll/pack dialogs still local (not in scope of listed actions).

- [x] **Narrow trip-switch loading UX**  
  `pageLoading` (initial) vs `isRefreshing` (keep previous data + light overlay on `PlanningContent`).

- [x] **Stabilize Pack chart options** — `PackWidget.vue`  
  Stable options ref + `setOption` for series/legend/theme; single short delay for CSS vars.

- [x] **Finish or hide incomplete features**  
  Hid Leave Trip (settings menu removed — only unused action); friends list + profile fetch; `ChangePackDialog.updateTripPack` `finally`.

- [x] **Deduplicate Trip/Hike detail lists** — shared `DetailsList.vue`  
  Todos/Shopping left separate (quantity column / different tables); full merge deferred if needed later.

- [x] **Invite search** — `InviteFriendsDialog.vue`  
  Escape `ilike` wildcards; debounce `@search` (~300ms); search `value` is profile id.

- [x] **Error handling consistency** — check Supabase `error` in `PollChart` vote/answer paths; store RPC path; dialog `finally` blocks.

#### Low

- [x] Remove `console.log` in `TripDetailsWidget`
- [x] Tippy copy: “trips” not “packs” for trip limit
- [x] Empty-state disabled logic is effectively dead — clean up
- [x] Modify Detail dialog title should reflect trip vs hike
- [x] `PollChart`: stable `:key="answer.id"`; set loading on vote; simplify `totalVotes`
- [x] Align emit names on touched planning dialogs (`onClose` consistent)

---

### Closet

`pages/closet.vue` → `ClosetContainer` → store → table/chart/dialogs.

#### High

- [ ] **Single-flight pack load** — `ClosetContainer.vue`, `stores/closet.ts`  
  `await fetchClosetPage` then cookie watcher `{ immediate: true }` fetches again; no generation token → race / wrong pack flash. Mirror PlanningContainer pattern (query → cookie → `0`; ignore stale).

- [ ] **Category name/unit update uses wrong id** — `ClosetPackCategories.vue`  
  `@handle-update-category` sets `activeCategoryId = $event` (payload object) then `updateCategory($event)`. `.eq('id', activeCategoryId)` is wrong. Use `$event.id`.

- [ ] **Cross-category drag not persisted when indexes match** — `PackItemsTable.vue`  
  `calculateUpdatedPositions` returns `[]` when `oldIndex === newIndex` even if `from`/`to` categories differ (A[0] → B[0]). UI moves; refresh undoes. Guard on same category + same index.

- [ ] **Empty categories cannot receive drops** — `PackItemsTable.vue`  
  `v-draggable` only when `category_items.length`; empty bodies are not drop targets. Always render a draggable list (empty OK).

#### Medium

- [ ] **Delete-pack “Remove items?” checkbox is a no-op** — `DeletePackDialog.vue`  
  Bound UI never read in submit. Implement cleanup or remove checkbox.

- [ ] **Chart lbs label vs category units** — `ClosetPackChart.vue`, `helpers.calculateCategoryWeight`  
  Series use each category’s unit; axis/tooltip always say `lbs`. Convert to one unit (match pack stats).

- [ ] **Deep chart rebuild on every nested edit** — `ClosetPackChart.vue`  
  Deep `categories` watch + double legend color init. Watch derived series; theme-only for colors.

- [ ] **Optimistic `createItem` id `0` collisions** — `stores/closet.ts`  
  Rapid “New Item” shares `id: 0` / rollback wipes all pending. Unique temp ids.

- [ ] **Item updates non-optimistic / race-prone** — `updateItem`, drag upserts  
  Last response wins; drag UI has no rollback on failure. Optimistic + stale ignore / rollback.

- [ ] **New pack create doesn’t set cookie** — `ManagePackSettingsDialog.vue`  
  Store selects pack but cookie unchanged → refresh reloads previous pack. Set cookie; notify/close only on success.

#### Low

- [ ] Dead leftovers: commented category DnD; unused URL state in `ClosetPackCategories`; unused `submitting` in `SharePackDialog`; CSV parse status unused

---

### Dashboard

`pages/index.vue` → dashboard widgets.

#### Medium

- [ ] **Forum double-fetch** — `pages/index.vue`  
  `useAsyncData('forumPosts')` then `fetchForumPosts()` again (result discarded). Use one path.

- [ ] **Invitations widget unfinished** — `InvitationsWidget.vue`  
  Placeholder `<!-- TODO --> Invite: {{ invite.id }}`. Render details/actions or hide.

- [ ] **Friends widget “+N more” inside `v-for`** — `FriendsWidget.vue`  
  More-link repeats per avatar. Move outside loop.

#### Low

- [ ] Strip leftover `console.log` in `pages/index.vue`

---

### Friends

`pages/friends.vue` → friend request/search UI.

#### High

- [ ] **Accept friend can fail / wrong row** — `FriendRequestItem.vue`  
  Post-insert `.eq('friend_id', sender.id).single()` without `profile_id` → `.single()` errors under open RLS. Scope to current user or use insert `.select()`.

#### Medium

- [ ] **Decline doesn’t shrink list** — `pages/friends.vue`  
  `filter` without assign; accept may leave request in list. Assign/splice; fix error toasts (`notifyPositive` → `notifyNegative`).

- [ ] **Friend search stale pending flags** — `pages/friends.vue`  
  Empty invitations don’t clear `pendingRequestIds`; no request generation. Clear + ignore stale.

#### Low

- [ ] Hardcoded “2 mutual friends” TODOs on friends UI

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
| [x] `chore: tailwind @theme migration` | Drop JS `@config` bridge | Done on `chore/optional-polish` — theme in `assets/css/tailwind.css` (`@theme inline` + `@utility container`); deleted `tailwind.config.ts`; keep `utils/tailwind.ts` for non-CSS callers |
| [x] `chore: enable noUncheckedIndexedAccess` | Fix ~130 indexed access errors | Done on `chore/optional-polish` — enabled in `nuxt.config.ts`; guards/`?? []` across stores, components, server, tests |
| [ ] `chore: migrate to Nuxt app/ directory` | Drop `srcDir: '.'` layout | Large move; **deferred** (own PR) |
| [x] `chore: eslint stylistic warn cleanup` | Reduce warn noise / selective `--fix` | Done on `chore/optional-polish` — `--fix` on auto-fixable style; ignore `supabase/.temp/**` (0 errors; remaining warns are intentional soft rules) |
| [x] Safe patch/minors | e.g. `tailwind-merge` 3 | `tailwind-merge` **3.6.0** on `chore/optional-polish` |

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

1. ~~**Planning High + Medium + Low**~~ — branch `fix/planning-high-priority-perf`
2. **Shared High** — `fetchProfile` crash, notification INSERT
3. **Auth / billing High** — reset-password page, billing stubs
4. **Closet High** — single-flight load, category id, drag persist / empty drops
5. **Public packs High** — privacy gate; then Medium comments/layout
6. **Friends High + Medium**
7. Closet/Dashboard Medium; visual QA leftovers + Stripe smoke
8. Zod 4 when `@vee-validate/zod` peers allow
9. Optional: Nuxt `app/` directory; revoke legacy JWT secret after fully off `anon` / `service_role`
