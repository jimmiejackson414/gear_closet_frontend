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

  devServer: {
    port: 8000,
  },

  head: {
    "meta": [
      // Primary tags
      { "charset": "utf-8" },
      { "name": "viewport", "content": "width=device-width, initial-scale=1" },
      { "hid": "description", "name": "description", "content": "Ever needed a way to plan the next backpacking trip with your friends? Welcome to Gear Closet! Create pack lists, plan your hike, and share your pack lists with others!" },
      // Open Graph/ Facebook
      { "property": "og:type", "content": "website" },
      { "property": "og:url", "content": "https://app.gearcloset.io/" },
      { "property": "og:title", "content": "Gear Closet" },
      { "property": "og:description", "content": "Ever needed a way to plan the next backpacking trip with your friends? Welcome to Gear Closet! Create pack lists, plan your hike, and share your pack lists with others!" },
      { "property": "og:image", "content": "/logo-og.jpeg" },
      // Twitter
      { "property": "twitter:card", "content": "summary_large_image" },
      { "property": "twitter:url", "content": "https://app.gearcloset.io/" },
      { "property": "twitter:title", "content": "Gear Closet" },
      { "property": "twitter:description", "content": "Ever needed a way to plan the next backpacking trip with your friends? Welcome to Gear Closet! Create pack lists, plan your hike, and share your pack lists with others!" },
      { "property": "twitter:image", "content": "/logo-og.jpeg" },

    ],
  },

  modules: [
    '@nuxtjs/supabase',
    '@pinia/nuxt',
    '@nuxtjs/tailwindcss',
    '@vueuse/nuxt',
  ],

  optimizeDeps: {
    include: ['tailwind.config.ts'],
  },

  postcss: {
    plugins: {
      'tailwindcss/nesting': {},
      tailwindcss: {},
      autoprefixer: {},
    },
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
      forumsApiKey: process.env.NUXT_PUBLIC_FORUMS_API_KEY,
      forumsApiUsername: process.env.NUXT_PUBLIC_FORUMS_API_USERNAME,
      cookieKey: process.env.NUXT_COOKIE_KEY,
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
