/* eslint-disable import/no-extraneous-dependencies */
// eslint-disable-next-line import/named
import { defineConfig } from 'cypress';
import { cypressEsbuildPreprocessor } from 'cypress-esbuild-preprocessor';
import path from 'path';

export default defineConfig({
  projectId: '59d484',
  env: {
    base_url: process.env.VITE_CYPRESS_BASE_URL,
    graphql_url: process.env.VITE_BACKEND_URL,
    username: process.env.VITE_CYPRESS_USERNAME,
    password: process.env.VITE_CYPRESS_PASSWORD,
  },
  component: {
    devServer: {
      framework: 'vue',
      bundler: 'vite',
    },
  },

  e2e: {
    setupNodeEvents (on, config) {
      // implement node event listeners here
      on(
        'file:preprocessor',
        cypressEsbuildPreprocessor({
          esbuildOptions: {
            // optional tsconfig for typescript support and path mapping (see https://github.com/evanw/esbuild for all options)
            tsconfig: path.resolve(__dirname, 'tsconfig.json'),
          },
        }),
      );
      return config;
    },
  },
});
