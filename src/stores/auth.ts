import { defineStore } from 'pinia';
import supabase from '@/lib/supabase';
import type { RouteLocation } from 'vue-router';
import type { User } from '@supabase/supabase-js';

type State = {
  session: User | null;
  redirectRoute: Partial<RouteLocation> | null;
}

type Getters = {
  isAuthenticated(): boolean;
}

type Actions = {
  loadUser(): Promise<void>;
  clearUser(): Promise<void>;
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
      isAuthenticated () {
        return !!this.session;
      },
    },

    actions: {
      async loadUser () {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          
          this.session = user;
        } catch (error) {
          console.error('Error loading user');
          this.session = null;
        }
      },

      async clearUser () {
        this.session = null;
        await supabase.auth.signOut();
      },

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
    //     this.loading = true;
    //     try {
    //       const sbUser = await supabase.auth.getUser();
    //       this.supabaseUser = sbUser.data.user;

    //       const client = useClient();
    //       const sdk = getSdk(client);

    //       const key = import.meta.env.VITE_SUPABASE_LOCALSTORAGE_KEY as string;
    //       const storage = localStorage.getItem(key) as string;
    //       const refreshToken = JSON.parse(storage).refresh_token;
    //       const payload = {
    //         input: {
    //           refresh_token: refreshToken,
    //         },
    //       };

    //       await sdk.SetAuth(payload);

    //       this.loading = false;
    //       return sbUser;
    //     } catch (error) {
    //       this.loading = false;
    //       console.error('Error loading user');
    //       return null;
    //     }
    //   },
    //   clearUser () {
    //     console.log('clearUser');
    //     this.supabaseUser = null;
    //   },
    //   saveRedirectRoute (route: Partial<RouteLocation>) {
    //     const {
    //       name, params, query, hash,
    //     } = route;

    //     localStorage.setItem(
    //       'redirectRoute',
    //       JSON.stringify({
    //         name,
    //         params,
    //         query,
    //         hash,
    //       }),
    //     );
    //   },
    //   loadRedirectRoute () {
    //     const route = JSON.parse(
    //       localStorage.getItem('redirectRoute') || 'null',
    //     ) as Partial<RouteLocation> | null;

    //     this.redirectRoute = route;
    //   },
    //   clearRedirectRoute () {
    //     localStorage.removeItem('redirectRoute');
    //     this.redirectRoute = null;
    //   },
    },
  },
);
