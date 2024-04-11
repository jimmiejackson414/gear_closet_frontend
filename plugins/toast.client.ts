import Vue3Toastify, { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

export default defineNuxtPlugin((nuxtApp) => {
  const options = {
    autoClose: 5000,
    limit: 3,
    position: toast.POSITION.BOTTOM_CENTER,
    toastClassName: 'gc-toast',
  };

  nuxtApp.vueApp.use(Vue3Toastify, options);

  return {
    provide: {
      toast,
    },
  };
});