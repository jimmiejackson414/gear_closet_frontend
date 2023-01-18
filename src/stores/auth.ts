import { defineStore } from 'pinia';
import { RouteLocation } from 'vue-router';
import { UserResponse } from '@supabase/supabase-js';
import supabase from '@/lib/supabase';
import { useClient } from '@/lib/graphqlRequest';
import { getSdk } from '@/generated/types';

type State = {
  supabaseUser: UserResponse | null;
  redirectRoute: Partial<RouteLocation> | null;
  loading: boolean;
};

type Getters = {
  isAuthenticated(): boolean;
};

type Actions = {
  loadUser(): void;
  clearUser(): void;
  saveRedirectRoute(route: Partial<RouteLocation>): void;
  loadRedirectRoute(): void;
  clearRedirectRoute(): void;
};

export const useAuthStore = defineStore<'auth', State, Getters, Actions>(
  'auth',
  {
    state () {
      return {
        supabaseUser: null,
        redirectRoute: null,
        loading: false,
      };
    },
    getters: {
      isAuthenticated () {
        return !!this.supabaseUser;
      },
    },
    actions: {
      async loadUser () {
        this.loading = true;
        try {
          const sbUser = await supabase.auth.getUser();
          this.supabaseUser = sbUser;

          const client = useClient();
          const sdk = getSdk(client);

          await sdk.SetAuth();

          this.loading = false;
          return sbUser;
        } catch (error) {
          this.loading = false;
          console.error('Error loading user');
          return null;
        }
      },
      clearUser () {
        this.supabaseUser = null;
      },
      saveRedirectRoute (route: Partial<RouteLocation>) {
        const {
          name, params, query, hash,
        } = route;

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
