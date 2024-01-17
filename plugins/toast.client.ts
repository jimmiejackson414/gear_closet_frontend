import * as vt from 'vue-toastification';
import 'vue-toastification/dist/index.css';

const options = {
  timeout: 5000,
  position: vt.POSITION.BOTTOM_CENTER,
  maxToasts: 3,
  showCloseButtonOnHover: true,
  toastClassName: 'gc-toast',
};

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(vt.default, options);

  return {
    provide: {
      toast: vt.useToast(),
    },
  };
});