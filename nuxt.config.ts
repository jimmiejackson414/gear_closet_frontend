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

  app: {
    layoutTransition: { name: 'layout', mode: 'out-in' },
    pageTransition: { name: 'page', mode: 'out-in' },
  },

  components: [
    {
      path: '~/components',
      pathPrefix: false,
    },
  ],

  devtools: { enabled: true },

  modules: [
    '@nuxtjs/supabase',
    '@nuxtjs/tailwindcss',
  ],

  optimizeDeps: {
    include: ['tailwind.config.ts'],
  },

  runtimeConfig: {
    cloudinaryApiKey: process.env.NUXT_CLOUDINARY_API_KEY,
    cloudinaryApiSecret: process.env.NUXT_CLOUDINARY_API_SECRET,

    public: {
      cloudinaryCloudName: process.env.NUXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
      cloudinaryAuthPagesPath: process.env.NUXT_PUBLIC_CLOUDINARY_AUTH_PAGES_PATH,
      cloudinaryAvatarsPath: process.env.NUXT_PUBLIC_CLOUDINARY_AVATARS_PATH,
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseKey: process.env.SUPABASE_KEY,
      forumsUrl: process.env.NUXT_PUBLIC_FORUMS_URL,
    },
  },

  supabase: {
    redirectOptions: {
      exclude: ['/register', 'terms-and-conditions', '/forgot-password'],
    },
  },

  typescript: {
    typeCheck: true,
  },
});
