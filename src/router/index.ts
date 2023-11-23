import { createRouter, createWebHistory } from 'vue-router';
import { authGuard } from './guards';
import type { RouteComponent } from 'vue-router';

const routes = [
  {
    path: '/login',
    component: (): Promise<RouteComponent> => import('@/pages/Login.vue'),
    name: 'login',
    meta: { authRequired: false, subscriptionRequired: false },
  },
  {
    path: '/forgot-password',
    component: (): Promise<RouteComponent> => import('@/pages/ForgotPassword.vue'),
    name: 'forgot-password',
    meta: { authRequired: false, subscriptionRequired: false },
  },
  {
    path: '/reset-password',
    component: (): Promise<RouteComponent> => import('@/pages/ResetPassword.vue'),
    name: 'reset_password',
    meta: { authRequired: false, subscriptionRequired: false },
  },
  {
    path: '/register',
    component: (): Promise<RouteComponent> => import('@/pages/Register.vue'),
    name: 'register',
    meta: { authRequired: false, subscriptionRequired: false },
  },
  {
    path: '/terms-and-conditions',
    component: (): Promise<RouteComponent> => import('@/pages/TermsAndConditions.vue'),
    name: 'terms-and-conditions',
    meta: { authRequired: false, subscriptionRequired: false },
  },
  {
    path: '/onboarding',
    component: (): Promise<RouteComponent> => import('@/pages/Onboarding.vue'),
    name: 'onboarding',
    meta: { authRequired: true, subscriptionRequired: false },
  },
  {
    path: '/closet',
    component: (): Promise<RouteComponent> => import('@/pages/Closet.vue'),
    name: 'closet',
    meta: { authRequired: true, subscriptionRequired: false },
  },
  {
    path: '/planning',
    component: (): Promise<RouteComponent> => import('@/pages/Planning.vue'),
    name: 'planning',
    meta: { authRequired: true, subscriptionRequired: false },
  },
  {
    path: '/friends',
    component: (): Promise<RouteComponent> => import('@/pages/Friends.vue'),
    name: 'friends',
    meta: { authRequired: true, subscriptionRequired: false },
  },
  // {
  //   path: '/search',
  //   component: (): Promise<RouteComponent> => import('@/pages/Search.vue'),
  //   name: 'friends_search',
  //   meta: { authRequired: true, subscriptionRequired: false },
  // },
  {
    path: '/profile',
    component: (): Promise<RouteComponent> => import('@/pages/Profile.vue'),
    name: 'profile',
    meta: { authRequired: true, subscriptionRequired: false },
  },
  // {
  //   path: '/notifications',
  //   component: (): Promise<RouteComponent> => import('@/pages/Notifications.vue'),
  //   name: 'notifications',
  //   meta: { authRequired: true, subscriptionRequired: false },
  // },
  {
    path: '/forums',
    component: (): Promise<RouteComponent> => import('@/pages/Forums.vue'),
    name: 'forums',
    meta: { authRequired: true, subscriptionRequired: true },
  },
  // {
  //   path: '/p/packs/:slug',
  //   component: (): Promise<RouteComponent> => import('@/pages/public/packs/PublicPack.vue'),
  //   name: 'public_pack',
  //   meta: { authRequired: false, subscriptionRequired: false },
  // },
  {
    path: '/dashboard',
    component: (): Promise<RouteComponent> => import('@/pages/Dashboard.vue'),
    name: 'dashboard',
    meta: { authRequired: true, subscriptionRequired: false },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not_found',
    component: (): Promise<RouteComponent> => import('@/pages/NotFound.vue'),
    meta: { authRequired: false, subscriptionRequired: false },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(authGuard);

export default router;
