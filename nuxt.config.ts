// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite';

export default defineNuxtConfig({
  app: {
    head: {
      meta: [
        // Primary tags
        { "charset": "utf-8" },
        { "content": "width=device-width, initial-scale=1", "name": "viewport" },
        { "content": "Ever needed a way to plan the next backpacking trip with your friends? Welcome to Gear Closet! Create pack lists, plan your hike, and share your pack lists with others!", "name": "description" },
        // Open Graph/ Facebook
        { "content": "website", "property": "og:type" },
        { "content": "https://app.gearcloset.io/", "property": "og:url" },
        { "content": "Gear Closet", "property": "og:title" },
        { "content": "Ever needed a way to plan the next backpacking trip with your friends? Welcome to Gear Closet! Create pack lists, plan your hike, and share your pack lists with others!", "property": "og:description" },
        { "content": "/logo-og.jpeg", "property": "og:image" },
        // Twitter
        { "content": "summary_large_image", "property": "twitter:card" },
        { "content": "https://app.gearcloset.io/", "property": "twitter:url" },
        { "content": "Gear Closet", "property": "twitter:title" },
        { "content": "Ever needed a way to plan the next backpacking trip with your friends? Welcome to Gear Closet! Create pack lists, plan your hike, and share your pack lists with others!", "property": "twitter:description" },
        { "content": "/logo-og.jpeg", "property": "twitter:image" },
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
    classPrefix: '',
    classSuffix: '',
    fallback: 'light',
    preference: 'system',
  },

  compatibilityDate: "2026-08-11",

  components: [
    {
      // Ignore patterns are relative to `path`. UI components are registered by
      // shadcn-nuxt via addComponent() from each folder's index.ts.
      ignore: ['ui/**'],
      path: '@/components',
      pathPrefix: false,
    },
  ],

  // Tailwind 4 via Vite plugin (replaces @nuxtjs/tailwindcss)
  css: ['~/assets/css/tailwind.css'],

  devServer: {
    port: 8000,
  },

  devtools: {
    enabled: process.env.NODE_ENV !== 'production',
  },

  dir: {
    app: 'app',
  },

  eslint: {
    config: {
      // Keep formatting selective (warn-level in eslint.config.mjs) — enabling the
      // full stylistic preset surfaces ~6k errors against the existing codebase.
      stylistic: false,
    },
  },

  future: {
    compatibilityVersion: 4,
  },

  lucide: {
    namePrefix: 'Icon',
  },

  modules: [
    '@sentry/nuxt/module',
    '@nuxtjs/supabase',
    '@pinia/nuxt',
    '@vueuse/nuxt',
    '@nuxt/test-utils/module',
    '@nuxt/eslint',
    "@nuxtjs/color-mode",
    "shadcn-nuxt",
    "nuxt-lucide-icons",
  ],

  runtimeConfig: {
    cloudinaryApiKey: process.env.NUXT_CLOUDINARY_API_KEY,
    cloudinaryApiSecret: process.env.NUXT_CLOUDINARY_API_SECRET,
    forumsApiKey: process.env.NUXT_FORUMS_API_KEY || process.env.NUXT_PUBLIC_FORUMS_API_KEY,
    forumsApiUsername:
      process.env.NUXT_FORUMS_API_USERNAME
      || process.env.NUXT_PUBLIC_FORUMS_API_USERNAME
      || 'system',
    geoapifyApiKey: '',
    mailAllowlist: '',
    mailFrom: '',
    playwrightPassword: process.env.NUXT_PLAYWRIGHT_PASSWORD,
    playwrightUsername: process.env.NUXT_PLAYWRIGHT_USERNAME,
    public: {
      cloudinaryAuthPagesPath: process.env.NUXT_PUBLIC_CLOUDINARY_AUTH_PAGES_PATH,
      cloudinaryAvatarsPath: process.env.NUXT_PUBLIC_CLOUDINARY_AVATARS_PATH,
      cloudinaryCloudName: process.env.NUXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
      cookieKey: process.env.NUXT_COOKIE_KEY,
      forumsUrl: process.env.NUXT_PUBLIC_FORUMS_URL,
      lifetimePromo: process.env.NUXT_PUBLIC_LIFETIME_PROMO === 'true',
      sentryDsn: '',
      sentryEnabled: '',
      sentryEnvironment: '',
      stripePublishableKey: process.env.NUXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
      supabaseKey: process.env.NUXT_PUBLIC_SUPABASE_KEY,
      supabaseUrl: process.env.NUXT_PUBLIC_SUPABASE_URL,
    },
    resendApiKey: '',
    sentryDsn: '',
    sentryProbeKey: '',
    stripeSecret: process.env.NUXT_STRIPE_SECRET,

    stripeWebhookSecret: process.env.NUXT_STRIPE_WEBHOOK_SECRET,
  },

  sentry: {
    authToken: process.env.SENTRY_AUTH_TOKEN,
    // Captures API/Nitro errors in preview/prod without a custom `node --import`.
    autoInjectServerSentry: 'experimental_dynamic-import',
    // Vitest loads nuxt.config; keep the bundler plugin out of unit tests.
    enabled: !process.env.VITEST,
    org: process.env.SENTRY_ORG,
    project: process.env.SENTRY_PROJECT,
    telemetry: false,
  },

  shadcn: {
    componentDir: './components/ui',
    prefix: '',
  },

  sourcemap: {
    client: 'hidden',
  },

  // Nuxt 4 defaults to srcDir: 'app/'. Keep the existing root layout until we
  // intentionally migrate directories (optional; Nuxt usually auto-detects).
  srcDir: '.',

  supabase: {
    cookieOptions: {
      secure: process.env.NODE_ENV === 'production',
    },
    redirectOptions: {
      callback: '/callback',
      exclude: [
        '/register',
        '/confirm',
        '/terms-and-conditions',
        '/forgot-password',
        '/reset-password',
        '/p/packs/*',
        '/invite/trip',
      ],
      login: '/login',
      saveRedirectToCookie: true,
    },
    // Database types live at project-root `types/index.ts` (not the v2 default path).
    types: '~/types/index.ts',
  },

  typescript: {
    tsConfig: {
      compilerOptions: {
        // Vue Official 3.x always typechecks SFCs via ts-plugin; without baseUrl,
        // `@/` aliases and Nuxt globals fail in the IDE (CLI vue-tsc still works).
        baseUrl: '.',
        // Nuxt 4 compat enables this by default (~90+ app errors). Opt out for now;
        // re-enable and fix indexed access after the Nuxt 4 upgrade lands.
        noUncheckedIndexedAccess: true,
        plugins: [{ name: '@vue/typescript-plugin' }],
      },
      include: ['vendor.d.ts', 'vitest-globals.d.ts'],
    },
    typeCheck: true,
  },

  vite: {
    plugins: [tailwindcss()],
  },
});
