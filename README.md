# Gear Closet

## Included
* [Nuxt 4](https://nuxt.com/)
* [Vite](https://vitejs.dev)
* [TypeScript](https://www.typescriptlang.org/)
* [Vue Router](https://router.vuejs.org/)
* [Reka UI](https://reka-ui.com/) / [shadcn-vue](https://www.shadcn-vue.com/)
* [Tailwind CSS 4](https://tailwindcss.com/)
* [Pinia](https://pinia.vuejs.org)
* [ESLint](https://eslint.org/) (flat config via `@nuxt/eslint`)

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) / [Cursor](https://cursor.com/) + [Vue - Official](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (disable Vetur).

## Project Setup

```sh
pnpm install
```

Use Node matching `.nvmrc` (22.19+).

### Compile and Hot-Reload for Development

```sh
pnpm dev
```

### Type-Check, Compile and Minify for Production

```sh
pnpm typecheck
pnpm build
```

### Unit Tests with [Vitest](https://vitest.dev/)

```sh
pnpm test:unit
```

### End-to-End Tests with [Playwright](https://playwright.dev)

```sh
# Install browsers for the first run
npx playwright install

# When testing on CI, must build the project first
pnpm build

# Runs the end-to-end tests
pnpm test:e2e
# Runs the tests only on Chromium
pnpm test:e2e -- --project=chromium
# Runs the tests of a specific file
pnpm test:e2e -- tests/example.spec.ts
# Runs the tests in debug mode
pnpm test:e2e -- --debug
```

### Lint with [ESLint](https://eslint.org/)

```sh
pnpm lint
```

### Generate Types

```sh
pnpm typegen
```

### Generate localhost certs

```sh
pnpm cert
```

## Other Resources
* [Lucide Icons](https://lucide.dev/icons/)
* [Hero Patterns](https://heropatterns.com/)
