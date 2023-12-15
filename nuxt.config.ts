// https://nuxt.com/docs/api/configuration/nuxt-config
import fs from 'fs';

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

export default defineNuxtConfig({
  ...readPemFiles(),

  components: [
    {
      path: '~/components',
      pathPrefix: false,
    },
  ],

  devtools: { enabled: true },

  modules: [
    '@nuxtjs/supabase',
    '@nuxtjs/tialwindcss',
  ],

  optimizeDeps: {
    include: ['tailwind.config.ts'],
  },

  runtimeConfig: {
    public: {
      SUPABASE_URL: process.env.SUPABASE_URL,
      SUPABASE_KEY: process.env.SUPABASE_KEY,
    },
},

  typescript: {
    typeCheck: true,
  },
});
