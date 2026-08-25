/**
 * vue-tippy is client-only (DOM + CSS). Without this stub, SSR of `v-tippy`
 * throws `Cannot read properties of undefined (reading 'getSSRProps')`.
 */
export const tippySsrDirective = {
  getSSRProps: () => ({}),
};

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive('tippy', tippySsrDirective);
});
