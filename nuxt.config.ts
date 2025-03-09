// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      meta: [
        // Primary tags
        { "charset": "utf-8" },
        { "content": "width=device-width, initial-scale=1", "name": "viewport" },
        { "content": "Ever needed a way to plan the next backpacking trip with your friends? Welcome to Gear Closet! Create pack lists, plan your hike, and share your pack lists with others!", "hid": "description", "name": "description" },
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
      'vee-validate',
    ],
  },

  colorMode: {
    classPrefix: '',
    classSuffix: '',
    fallback: 'light',
    preference: 'system',
  },

  compatibilityDate: "2024-12-30",

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
  ],

  postcss: {
    plugins: {
      autoprefixer: {},
      tailwindcss: {},
      'tailwindcss/nesting': {},
    },
  },

  runtimeConfig: {
    cloudinaryApiKey: process.env.NUXT_CLOUDINARY_API_KEY,
    cloudinaryApiSecret: process.env.NUXT_CLOUDINARY_API_SECRET,
    forumsApiKey: process.env.NUXT_PUBLIC_FORUMS_API_KEY,
    forumsApiUsername: process.env.NUXT_PUBLIC_FORUMS_API_USERNAME,
    playwrightPassword: process.env.NUXT_PLAYWRIGHT_PASSWORD,
    playwrightUsername: process.env.NUXT_PLAYWRIGHT_USERNAME,
    public: {
      cloudinaryAuthPagesPath: process.env.NUXT_PUBLIC_CLOUDINARY_AUTH_PAGES_PATH,
      cloudinaryAvatarsPath: process.env.NUXT_PUBLIC_CLOUDINARY_AVATARS_PATH,
      cloudinaryCloudName: process.env.NUXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
      cookieKey: process.env.NUXT_COOKIE_KEY,
      forumsUrl: process.env.NUXT_PUBLIC_FORUMS_URL,
      radarAccessToken: process.env.NUXT_PUBLIC_RADAR_ACCESS_TOKEN,
      stripePublishableKey: process.env.NUXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
      supabaseKey: process.env.NUXT_PUBLIC_SUPABASE_KEY,
      supabaseUrl: process.env.NUXT_PUBLIC_SUPABASE_URL,
    },
    sendgridApiKey: process.env.NUXT_SENDGRID_API_KEY,
    stripeSecret: process.env.NUXT_STRIPE_SECRET,
    stripeWebhookSecret: process.env.NUXT_STRIPE_WEBHOOK_SECRET,
  },

  shadcn: {
    componentDir: './components/ui',
    prefix: '',
  },

  stripe: {
    publishableKey: process.env.NUXT_STRIPE_PUBLISHABLE_KEY,
  },

  supabase: {
    cookieOptions: {
      secure: process.env.NODE_ENV === 'production',
    },
    redirectOptions: {
      callback: '/callback',
      cookieRedirect: true,
      exclude: ['/register', '/terms-and-conditions', '/forgot-password', '/p/packs/*'],
      login: '/login',
    },
  },

  typescript: {
    tsConfig: {
      compilerOptions: {
        baseUrl: '.',
        paths: {
          '@': ['.'],
          '@/*': ['./*'],
        },
      },
      include: ['vendor.d.ts'],
    },
    typeCheck: true,
  },

  vite: {
    optimizeDeps: {
      include: ['tailwind.config.ts'],
    },
  },
});