// https://nuxt.com/docs/api/configuration/nuxt-config
// import fs from 'fs';

export default defineNuxtConfig({
  app: {
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
  },

  build: {
    transpile: [
      '@vuepic/vue-datepicker',
      'echarts',
      'zrender',
      'tslib',
    ],
  },

  components: [
    {
      path: '@/components',
      pathPrefix: false,
    },
  ],

  devServer: {
    port: 8000,
    // https: {
    //   key: fs.readFileSync('./localhost-key.pem')
    //     .toString(),
    //   cert: fs.readFileSync('./localhost.pem')
    //     .toString(),
    // },
  },

  devtools: {
    enabled: true,
  },


  headlessui: {
    prefix: 'Headless',
  },

  modules: [
    '@nuxtjs/supabase',
    '@pinia/nuxt',
    '@nuxtjs/tailwindcss',
    '@vueuse/nuxt',
    'nuxt-headlessui',
    '@fixers/nuxt-stripe',
    '@nuxt/test-utils/module',
    "@nuxtjs/storybook",
  ],

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
    playwrightUsername: process.env.NUXT_PLAYWRIGHT_USERNAME,
    playwrightPassword: process.env.NUXT_PLAYWRIGHT_PASSWORD,
    sendgridApiKey: process.env.NUXT_SENDGRID_API_KEY,
    forumsApiKey: process.env.NUXT_PUBLIC_FORUMS_API_KEY,
    forumsApiUsername: process.env.NUXT_PUBLIC_FORUMS_API_USERNAME,
    stripeWebhookSecret: process.env.NUXT_STRIPE_WEBHOOK_SECRET,
    stripeSecret: process.env.NUXT_STRIPE_SECRET,

    public: {
      cloudinaryCloudName: process.env.NUXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
      cloudinaryAuthPagesPath: process.env.NUXT_PUBLIC_CLOUDINARY_AUTH_PAGES_PATH,
      cloudinaryAvatarsPath: process.env.NUXT_PUBLIC_CLOUDINARY_AVATARS_PATH,
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseKey: process.env.SUPABASE_KEY,
      forumsUrl: process.env.NUXT_PUBLIC_FORUMS_URL,
      cookieKey: process.env.NUXT_COOKIE_KEY,
      stripePublishableKey: process.env.NUXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    },
  },

  stripe: {
    publishableKey: process.env.NUXT_STRIPE_PUBLISHABLE_KEY,
  },

  supabase: {
    cookieOptions: {
      secure: process.env.NODE_ENV === 'production',
    },
    redirectOptions: {
      login: '/login',
      callback: '/callback',
      exclude: ['/register', '/terms-and-conditions', '/forgot-password', '/p/packs/*'],
      cookieRedirect: true,
    },
  },

  typescript: {
    typeCheck: true,
    tsConfig: {
      include: ['vendor.d.ts'],
      compilerOptions: {
        paths: {
          '@': ['.'],
          '@/*': ['./*'],
        },
      },
    },
  },

  vite: {
    optimizeDeps: {
      include: ['@vueup/vue-quill', 'tailwind.config.ts'],
    },
  },
});