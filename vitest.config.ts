import { defineVitestConfig } from '@nuxt/test-utils/config';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineVitestConfig({
  plugins: [tsconfigPaths()],
  test: {
    environment: 'nuxt',
    globals: true,
    include: ['tests/unit/*.spec.ts'],
  },
});