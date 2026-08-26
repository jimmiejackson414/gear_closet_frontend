import { defineVitestConfig } from '@nuxt/test-utils/config';

export default defineVitestConfig({
  test: {
    environment: 'nuxt',
    globals: true,
    // Nuxt environment setup can exceed Vitest's 10s default on a loaded CI runner.
    hookTimeout: 60_000,
    include: ['tests/unit/*.spec.ts'],
  },
});
