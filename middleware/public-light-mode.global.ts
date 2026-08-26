/** Public-layout pages are always rendered in light mode. */
export default defineNuxtRouteMiddleware((to) => {
  if (to.meta.layout === 'public-layout') {
    to.meta.colorMode = 'light';
  }
});
