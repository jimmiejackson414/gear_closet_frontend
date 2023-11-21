import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { fileURLToPath, URL } from 'node:url';
import fs from 'fs';
import AutoImport from 'unplugin-auto-import/vite';
import { unheadVueComposablesImports } from '@unhead/vue';

const readPemFiles = (): any => {
  if (process.env.NODE_ENV === 'production') return undefined;
  return {
    server: {
      port: 8000,
      https: {
        key: fs.readFileSync('./localhost-key.pem'),
        cert: fs.readFileSync('./localhost.pem'),
      },
    },
  };
};

// https://vitejs.dev/config/
export default defineConfig({
  ...readPemFiles(),
  plugins: [
    vue(),
    AutoImport({
      include: [
        /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
        /\.vue$/,
        /\.vue\?vue/, // .vue
      ],
      imports: [
        'vue',
        'vue-router',
        '@vueuse/core',
        'pinia',
        unheadVueComposablesImports,
      ],
      eslintrc: {
        enabled: true,
        filepath: './.eslintrc-auto-import.json',
      },
      dts: './auto-imports.d.ts',
      vueTemplate: true,
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      'tailwind.config': fileURLToPath(new URL('./tailwind.config.ts', import.meta.url)),
    },
  },
  optimizeDeps: {
    include: [
      'tailwind.config.ts',
    ],
  },
});
