import type { User } from '@supabase/supabase-js';
import { defineStore } from 'pinia';
import type { RouteLocation } from 'vue-router';

type State = {
  redirectRoute: Partial<RouteLocation> | null;
}

type Getters = {
  isAuthenticated(): boolean;
  currentUser(): User | null;
}

type Actions = {
  saveRedirectRoute(route: Partial<RouteLocation>): void;
  loadRedirectRoute(): void;
  clearRedirectRoute(): void;
}

export const useAuthStore = defineStore<'auth', State, Getters, Actions>(
  'auth',
  {
    actions: {
      clearRedirectRoute () {
        localStorage.removeItem('redirectRoute');
        this.redirectRoute = null;
      },

      loadRedirectRoute () {
        const route = JSON.parse(
          localStorage.getItem('redirectRoute') || 'null',
        ) as Partial<RouteLocation> | null;

        this.redirectRoute = route;
      },

      saveRedirectRoute (route: Partial<RouteLocation>) {
        const { hash, name, params, query } = route;

        localStorage.setItem(
          'redirectRoute',
          JSON.stringify({
            hash,
            name,
            params,
            query,
          }),
        );
      },
    },

    getters: {
      currentUser () {
        return useSupabaseUser()?.value;
      },
      isAuthenticated () {
        return !!this.currentUser;
      },
    },

    state () {
      return {
        loading: false,
        redirectRoute: null,
        session: null,
      };
    },
  },
);
