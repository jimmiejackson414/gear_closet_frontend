import { boot } from 'quasar/wrappers';
import VueGTag from 'vue-gtag';

export default boot(({ app, router }) => {
  app.use(VueGTag, {
    config: { id: process.env.VITE_GOOGLE_ANALYTICS_ID },
    bootstrap: true,
    appName: 'my-app',
    pageTrackerScreenviewEnabled: true,
  }, router);
});
