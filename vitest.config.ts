import { defineVitestConfig } from '@nuxt/test-utils/config';

export default defineVitestConfig({
  test: {
    globals: true,
    environment: 'nuxt',
    include: ['tests/unit/*.spec.ts'],
    // Nuxt environment setup can exceed Vitest's 10s default on a loaded CI runner.
    hookTimeout: 60_000,
  },
});
