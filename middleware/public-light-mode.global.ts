/** Auth and public layouts are always rendered in light mode. */
export default defineNuxtRouteMiddleware((to) => {
  if (to.meta.layout === 'public-layout' || to.meta.layout === 'auth-layout') {
    to.meta.colorMode = 'light';
  }
});
