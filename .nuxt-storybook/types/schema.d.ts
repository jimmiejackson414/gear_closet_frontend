import { NuxtModule, RuntimeConfig } from 'nuxt/schema'
declare module 'nuxt/schema' {
  interface NuxtConfig {
    ["supabase"]?: typeof import("@nuxtjs/supabase").default extends NuxtModule<infer O> ? Partial<O> : Record<string, any>
    ["pinia"]?: typeof import("@pinia/nuxt").default extends NuxtModule<infer O> ? Partial<O> : Record<string, any>
    ["tailwindcss"]?: typeof import("@nuxtjs/tailwindcss").default extends NuxtModule<infer O> ? Partial<O> : Record<string, any>
    ["vueuse"]?: typeof import("@vueuse/nuxt").default extends NuxtModule<infer O> ? Partial<O> : Record<string, any>
    ["headlessui"]?: typeof import("nuxt-headlessui").default extends NuxtModule<infer O> ? Partial<O> : Record<string, any>
    ["stripe"]?: typeof import("@fixers/nuxt-stripe").default extends NuxtModule<infer O> ? Partial<O> : Record<string, any>
    ["storybook"]?: typeof import("@nuxtjs/storybook").default extends NuxtModule<infer O> ? Partial<O> : Record<string, any>
    ["devtools"]?: typeof import("@nuxt/devtools").default extends NuxtModule<infer O> ? Partial<O> : Record<string, any>
    ["telemetry"]?: typeof import("@nuxt/telemetry").default extends NuxtModule<infer O> ? Partial<O> : Record<string, any>
    modules?: (undefined | null | false | NuxtModule | string | [NuxtModule | string, Record<string, any>] | ["@nuxtjs/supabase", Exclude<NuxtConfig["supabase"], boolean>] | ["@pinia/nuxt", Exclude<NuxtConfig["pinia"], boolean>] | ["@nuxtjs/tailwindcss", Exclude<NuxtConfig["tailwindcss"], boolean>] | ["@vueuse/nuxt", Exclude<NuxtConfig["vueuse"], boolean>] | ["nuxt-headlessui", Exclude<NuxtConfig["headlessui"], boolean>] | ["@fixers/nuxt-stripe", Exclude<NuxtConfig["stripe"], boolean>] | ["@nuxtjs/storybook", Exclude<NuxtConfig["storybook"], boolean>] | ["@nuxt/devtools", Exclude<NuxtConfig["devtools"], boolean>] | ["@nuxt/telemetry", Exclude<NuxtConfig["telemetry"], boolean>])[],
  }
  interface RuntimeConfig {
   app: {
      baseURL: string,

      buildAssetsDir: string,

      cdnURL: string,
   },

   cloudinaryApiKey: string,

   cloudinaryApiSecret: string,

   sendgridApiKey: string,

   forumsApiKey: string,

   forumsApiUsername: string,

   stripeWebhookSecret: string,

   stripeSecret: string,

   supabase: {
      serviceKey: any,
   },
  }
  interface PublicRuntimeConfig {
   cloudinaryCloudName: string,

   cloudinaryAuthPagesPath: string,

   cloudinaryAvatarsPath: string,

   supabaseUrl: string,

   supabaseKey: string,

   forumsUrl: string,

   cookieKey: string,

   stripePublishableKey: string,

   supabase: {
      url: string,

      key: string,

      redirect: boolean,

      redirectOptions: {
         login: string,

         callback: string,

         exclude: Array<string>,

         cookieRedirect: boolean,
      },

      cookieName: string,

      cookieOptions: {
         maxAge: number,

         sameSite: string,

         secure: boolean,
      },

      clientOptions: {
         auth: {
            flowType: string,

            detectSessionInUrl: boolean,

            persistSession: boolean,

            autoRefreshToken: boolean,
         },
      },
   },

   stripe: {
      publishableKey: string,
   },
  }
}
declare module 'vue' {
        interface ComponentCustomProperties {
          $config: RuntimeConfig
        }
      }