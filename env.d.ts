/// <reference types="vite/client" />
import ApexCharts from 'apexcharts';

declare module '*.vue' {
  import { DefineComponent } from 'vue';
  // eslint-disable-next-line
  const component: DefineComponent<{}, {}, any>
  export default component;
}

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $apexcharts: typeof ApexCharts;
  }
}

declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: string;
    VUE_ROUTER_MODE: 'hash' | 'history' | 'abstract' | undefined;
    VUE_ROUTER_BASE: string | undefined;
  }
}

interface ImportMetaEnv {
  VITE_BACKEND_URL: string

  VITE_CLOUDINARY_CLOUD_NAME: string
  VITE_CLOUDINARY_API_KEY: string
  VITE_CLOUDINARY_API_SECRET: string
  VITE_CLOUDINARY_AUTH_PAGES_PATH: string

  VITE_JWT_SECRET: string
  VITE_TOKEN_IDENTIFIER: string
  VITE_COOKIE_KEY: string

  VITE_FACEBOOK_APP_ID: string
  VITE_FACEBOOK_APP_SECRET: string

  VITE_TWITTER_API_KEY: string
  VITE_TWITTER_API_SECRET: string

  VITE_GOOGLE_API_KEY: string
  VITE_GOOGLE_API_SECRET: string
  VITE_GOOGLE_ANALYTICS_ID: string

  VITE_SUPABASE_URL: string
  VITE_SUPABASE_PUBLIC_KEY: string

  VITE_STRIPE_PUBLIC_KEY: string

  VITE_HERE_APP_ID: string
  VITE_HERE_API_KEY: string

  VITE_FORUMS_URL: string

  VITE_CYPRESS_BASE_URL: string
  VITE_CYPRESS_USERNAME: string
  VITE_CYPRESS_PASSWORD: string
}
