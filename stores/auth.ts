import { defineStore } from 'pinia';
import type { RouteLocation } from 'vue-router';
import type { User } from '@supabase/supabase-js';

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
    state () {
      return {
        session: null,
        redirectRoute: null,
        loading: false,
      };
    },

    getters: {
      currentUser () {
        return useSupabaseUser()?.value;
      },
      isAuthenticated () {
        return !!this.currentUser;
      },
    },

    actions: {
      saveRedirectRoute (route: Partial<RouteLocation>) {
        const { name, params, query, hash } = route;

        localStorage.setItem(
          'redirectRoute',
          JSON.stringify({
            name,
            params,
            query,
            hash,
          }),
        );
      },

      loadRedirectRoute () {
        const route = JSON.parse(
          localStorage.getItem('redirectRoute') || 'null',
        ) as Partial<RouteLocation> | null;

        this.redirectRoute = route;
      },

      clearRedirectRoute () {
        localStorage.removeItem('redirectRoute');
        this.redirectRoute = null;
      },
    },
  },
);
