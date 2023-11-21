import type { RouteLocationNormalized, NavigationGuardNext } from 'vue-router';
import supabase from '@/lib/supabase';

export async function authGuard (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext,
): Promise<void> {
  const { data: { session }} = await supabase.auth.getSession();

  if ((to.meta.authRequired && session?.user) || !to.meta.authRequired) {
    return next();
  }

  return next({ name: 'login' });
}
