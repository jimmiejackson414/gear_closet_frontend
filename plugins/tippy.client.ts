import type { App } from 'vue';

const AUTH_ROUTES = new Set([
  '/login',
  '/register',
  '/confirm',
  '/callback',
  '/forgot-password',
  '/reset-password',
  '/terms-and-conditions',
]);

const needsTippy = (path: string) => !AUTH_ROUTES.has(path);

let installPromise: Promise<void> | null = null;

const installTippy = (vueApp: App) => {
  if (installPromise) return installPromise;

  installPromise = (async () => {
    const [{ default: VueTippy }] = await Promise.all([
      import('vue-tippy'),
      import('tippy.js/dist/tippy.css'),
      import('tippy.js/themes/translucent.css'),
    ]);

    vueApp.use(VueTippy, {
      defaultProps: {
        arrow: false,
        placement: 'top',
        theme: 'translucent',
      },
    });
  })();

  return installPromise;
};

export default defineNuxtPlugin((nuxtApp): void | Promise<void> => {
  const route = useRoute();
  const router = useRouter();

  router.beforeEach(async (to) => {
    if (needsTippy(to.path)) {
      await installTippy(nuxtApp.vueApp);
    }
  });

  if (needsTippy(route.path)) {
    return installTippy(nuxtApp.vueApp);
  }
});
