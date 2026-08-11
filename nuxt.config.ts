// https://nuxt.com/docs/api/configuration/nuxt-config

/**
 * TEMP (remove in Phase 4 / shadcn-nuxt 2): shadcn-nuxt@0.11 registers UI via
 * addComponent() from index barrels (needed for renames like Button→ButtonRoot)
 * but also scans components/ui with extensions:[], which double-registers.
 * Strip that scan dir after shadcn runs. Nuxt config `hooks` would run too early.
 */
function fixShadcnComponentDirs (_options: unknown, nuxt: any) {
  nuxt.hook('components:dirs', (dirs: Array<string | { path?: string }>) => {
    for (let i = dirs.length - 1; i >= 0; i -= 1) {
      const dir = dirs[i];
      const rawPath = typeof dir === 'string' ? dir : dir?.path;
      const dirPath = rawPath?.replace(/\\/g, '/') ?? '';
      if (dirPath.endsWith('/components/ui') || dirPath.endsWith('/components/ui/')) {
        dirs.splice(i, 1);
      }
    }
  });
}

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

  lucide: {
    namePrefix: 'Icon',
  },

  modules: [
    '@nuxtjs/supabase',
    '@pinia/nuxt',
    '@nuxtjs/tailwindcss',
    '@vueuse/nuxt',
    '@fixers/nuxt-stripe',
    '@nuxt/test-utils/module',
    "@nuxtjs/color-mode",
    "shadcn-nuxt",
    "nuxt-lucide-icons",
    fixShadcnComponentDirs,
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
      supabaseUrl: process.env.NUXT_PUBLIC_SUPABASE_URL,
      supabaseKey: process.env.NUXT_PUBLIC_SUPABASE_KEY,
      forumsUrl: process.env.NUXT_PUBLIC_FORUMS_URL,
      cookieKey: process.env.NUXT_COOKIE_KEY,
      stripePublishableKey: process.env.NUXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    },
  },

  shadcn: {
    prefix: '',
    componentDir: './components/ui',
  },

  stripe: {
    publishableKey: process.env.NUXT_STRIPE_PUBLISHABLE_KEY,
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
      exclude: ['/register', '/terms-and-conditions', '/forgot-password', '/p/packs/*'],
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
        noUncheckedIndexedAccess: false,
      },
    },
  },

  vite: {
    optimizeDeps: {
      include: ['tailwind.config.ts'],
    },
  },

  compatibilityDate: "2026-08-11",
});