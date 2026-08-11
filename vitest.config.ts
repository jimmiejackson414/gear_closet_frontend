// @ts-ignore @nuxt/test-utils exports ./config as .mjs without a types condition (IDE/moduleResolution)
import { defineVitestConfig } from '@nuxt/test-utils/config';

export default defineVitestConfig({
  test: {
    globals: true,
    environment: 'nuxt',
    include: ['tests/unit/*.spec.ts'],
  },
});
