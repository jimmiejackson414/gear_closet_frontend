// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite';

export default defineNuxtConfig({
  // Nuxt 4 defaults to srcDir: 'app/'. Keep the existing root layout until we
  // intentionally migrate directories (optional; Nuxt usually auto-detects).
  srcDir: '.',
  dir: {
    app: 'app',
  },

  future: {
    compatibilityVersion: 4,
  },

  app: {
    head: {
      meta: [
        // Primary tags
        { "charset": "utf-8" },
        { "name": "viewport", "content": "width=device-width, initial-scale=1" },
        { "name": "description", "content": "Ever needed a way to plan the next backpacking trip with your friends? Welcome to Gear Closet! Create pack lists, plan your hike, and share your pack lists with others!" },
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
      'reka-ui',
    ],
  },

  colorMode: {
    preference: 'system',
    fallback: 'light',
    classPrefix: '',
    classSuffix: '',
  },

  components: [
    {
      path: '@/components',
      pathPrefix: false,
      // Ignore patterns are relative to `path`. UI components are registered by
      // shadcn-nuxt via addComponent() from each folder's index.ts.
      ignore: ['ui/**'],
    },
  ],

  // Tailwind 4 via Vite plugin (replaces @nuxtjs/tailwindcss)
  css: ['~/assets/css/tailwind.css'],

  devServer: {
    port: 8000,
  },

  devtools: {
    enabled: true,
  },

  lucide: {
    namePrefix: 'Icon',
  },

  modules: [
    '@nuxtjs/supabase',
    '@pinia/nuxt',
    '@vueuse/nuxt',
    '@nuxt/test-utils/module',
    '@nuxt/eslint',
    "@nuxtjs/color-mode",
    "shadcn-nuxt",
    "nuxt-lucide-icons",
  ],

  eslint: {
    config: {
      // Keep formatting selective (warn-level in eslint.config.mjs) — enabling the
      // full stylistic preset surfaces ~6k errors against the existing codebase.
      stylistic: false,
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
      supabaseUrl: process.env.NUXT_PUBLIC_SUPABASE_URL,
      supabaseKey: process.env.NUXT_PUBLIC_SUPABASE_KEY,
      forumsUrl: process.env.NUXT_PUBLIC_FORUMS_URL,
      cookieKey: process.env.NUXT_COOKIE_KEY,
      stripePublishableKey: process.env.NUXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
      lifetimePromo: process.env.NUXT_PUBLIC_LIFETIME_PROMO === 'true',
    },
  },

  shadcn: {
    prefix: '',
    componentDir: './components/ui',
  },

  supabase: {
    // Database types live at project-root `types/index.ts` (not the v2 default path).
    types: '~/types/index.ts',
    cookieOptions: {
      secure: process.env.NODE_ENV === 'production',
    },
    redirectOptions: {
      login: '/login',
      callback: '/callback',
      exclude: ['/register', '/terms-and-conditions', '/forgot-password', '/reset-password', '/p/packs/*'],
      saveRedirectToCookie: true,
    },
  },

  typescript: {
    typeCheck: true,
    tsConfig: {
      include: ['vendor.d.ts', 'vitest-globals.d.ts'],
      compilerOptions: {
        // Vue Official 3.x always typechecks SFCs via ts-plugin; without baseUrl,
        // `@/` aliases and Nuxt globals fail in the IDE (CLI vue-tsc still works).
        baseUrl: '.',
        plugins: [{ name: '@vue/typescript-plugin' }],
        // Nuxt 4 compat enables this by default (~90+ app errors). Opt out for now;
        // re-enable and fix indexed access after the Nuxt 4 upgrade lands.
        noUncheckedIndexedAccess: true,
      },
    },
  },

  vite: {
    plugins: [tailwindcss()],
  },

  compatibilityDate: "2026-08-11",
});
