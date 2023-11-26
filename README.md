# Gear Closet

## Included
* [Vue 3](https://v3.vuejs.org)
* [Vite](https://vitejs.dev)
* [Typescript](https://v3.vuejs.org/guide/typescript-support.html)
* [Vue Router](https://next.router.vuejs.org/guide/)
* [Preline](https://preline.co/index.html)
* [Pinia](https://pinia.vuejs.org)
* [Eslint](https://eslint.vuejs.org)

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Project Setup

```sh
yarn install
```

### Compile and Hot-Reload for Development

```sh
yarn dev
```

### Type-Check, Compile and Minify for Production

```sh
yarn build
```

### Unit Tests with [Vitest](https://vitest.dev/)

```sh
yarn test:unit
```

### End-to-End Tests with [Playwright](https://playwright.dev)

```sh
# Install browsers for the first run
npx playwright install

# When testing on CI, must build the project first
yarn build

# Runs the end-to-end tests
yarn test:e2e
# Runs the tests only on Chromium
yarn test:e2e -- --project=chromium
# Runs the tests of a specific file
yarn test:e2e -- tests/example.spec.ts
# Runs the tests in debug mode
yarn test:e2e -- --debug
```

### Lint with [ESLint](https://eslint.org/)

```sh
yarn lint
```

### Generate Types

```sh
yarn typgen
```

### Generate localhost certs

```sh
yarn cert
```

### Generate snaplet seeder

```sh
yarn snaplet
```

## Other Resources
* [Lucide Icons](https://lucide.dev/icons/)
* [Hero Patterns](https://heropatterns.com/)