import {
  createRouter,
  createWebHistory,
  RouteRecordRaw,
  RouteComponent,
} from 'vue-router';
// import { authGuard } from './guards';
import { useAuthStore } from '@/stores/auth';

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    component: (): Promise<RouteComponent> => import('@/pages/auth/Login.vue'),
    name: 'login',
    meta: { authRequired: false, subscriptionRequired: false },
  },
  {
    path: '/forgot-password',
    component: (): Promise<RouteComponent> => import('@/pages/auth/ForgotPassword.vue'),
    name: 'forgot_password',
    meta: { authRequired: false, subscriptionRequired: false },
  },
  {
    path: '/reset-password',
    component: (): Promise<RouteComponent> => import('@/pages/auth/ResetPassword.vue'),
    name: 'reset_password',
    meta: { authRequired: false, subscriptionRequired: false },
  },
  {
    path: '/register',
    component: (): Promise<RouteComponent> => import('@/pages/auth/Register.vue'),
    name: 'register',
    meta: { authRequired: false, subscriptionRequired: false },
  },
  // {
  //   path: '/terms-and-conditions',
  //   component: (): Promise<RouteComponent> => import('@/pages/TermsAndConditions.vue'),
  //   name: 'terms_and_conditions',
  //   meta: { authRequired: false, subscriptionRequired: false },
  // },
  // {
  //   path: '/onboarding',
  //   component: (): Promise<RouteComponent> => import('@/pages/Onboarding.vue'),
  //   name: 'onboarding',
  //   meta: { authRequired: true, subscriptionRequired: false },
  // },
  // {
  //   path: '/closet',
  //   component: (): Promise<RouteComponent> => import('@/pages/Closet.vue'),
  //   name: 'closet',
  //   meta: { authRequired: true, subscriptionRequired: false },
  // },
  // {
  //   path: '/planning',
  //   component: (): Promise<RouteComponent> => import('@/pages/Planning.vue'),
  //   name: 'planning',
  //   meta: { authRequired: true, subscriptionRequired: false },
  // },
  // {
  //   path: '/friends',
  //   component: (): Promise<RouteComponent> => import('@/pages/Friends.vue'),
  //   name: 'friends',
  //   meta: { authRequired: true, subscriptionRequired: false },
  // },
  // {
  //   path: '/search',
  //   component: (): Promise<RouteComponent> => import('@/pages/Search.vue'),
  //   name: 'friends_search',
  //   meta: { authRequired: true, subscriptionRequired: false },
  // },
  // {
  //   path: '/profile',
  //   component: (): Promise<RouteComponent> => import('@/pages/Profile.vue'),
  //   name: 'profile',
  //   meta: { authRequired: true, subscriptionRequired: false },
  // },
  // {
  //   path: '/notifications',
  //   component: (): Promise<RouteComponent> => import('@/pages/Notifications.vue'),
  //   name: 'notifications',
  //   meta: { authRequired: true, subscriptionRequired: false },
  // },
  // {
  //   path: '/forums',
  //   component: (): Promise<RouteComponent> => import('@/pages/Forums.vue'),
  //   name: 'forums',
  //   meta: { authRequired: true, subscriptionRequired: true },
  // },
  // {
  //   path: '/p/packs/:slug',
  //   component: (): Promise<RouteComponent> => import('@/pages/public/packs/PublicPack.vue'),
  //   name: 'public_pack',
  //   meta: { authRequired: false, subscriptionRequired: false },
  // },
  {
    path: '/',
    component: (): Promise<RouteComponent> => import('@/pages/Dashboard.vue'),
    name: 'dashboard',
    meta: { authRequired: true, subscriptionRequired: false },
  },
  {
    path: '/:notFound(.*)*',
    name: 'not_found',
    component: (): Promise<RouteComponent> => import('@/pages/ErrorNotFound.vue'),
    meta: { authRequired: false, subscriptionRequired: false },
  },
];

const router = createRouter({
  scrollBehavior: () => ({ left: 0, top: 0 }),
  routes,
  history: createWebHistory(),
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();

  if ((to.meta.authRequired && authStore.isAuthenticated) || !to.meta.authRequired) {
    return next();
  }

  authStore.saveRedirectRoute(to);
  return next({ name: 'login' });
});

export default router;
