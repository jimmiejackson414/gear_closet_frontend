import '@/assets/css/main.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { createHead } from '@unhead/vue';
import Toast, { POSITION } from 'vue-toastification';
import type { PluginOptions } from 'vue-toastification';
import { X } from 'lucide-vue-next';
import 'vue-toastification/dist/index.css';

import App from './App.vue';
import router from './router';

const app = createApp(App);
const head = createHead();

app.use(createPinia());
app.use(router);
app.use(head);

const toastOptions = {
  bodyClassName: 'flex content-center flex-wrap',
  closeButton: X,
  closeButtonClassName: 'w-12 h-12 text-white fill-white',
  position: POSITION.BOTTOM_RIGHT,
  showCloseButtonOnHover: true,
  timeout: false,
  transition: 'Vue-Toastification__fade',
  toastClassName: 'custom',
  icon: {
    iconClassName: 'w-8 h-8 mr-4',
  },
} satisfies PluginOptions;
app.use(Toast, toastOptions);

app.mount('#app');
