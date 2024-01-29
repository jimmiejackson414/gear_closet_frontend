import { plugin as Slicksort, HandleDirective } from 'vue-slicksort';

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(Slicksort);
  nuxtApp.vueApp.directive('handle', HandleDirective);
});