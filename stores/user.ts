import { defineStore } from 'pinia';
import { useAppStore } from '@/stores/app';
import type {
  Database,
  OnboardingStep,
  Notification,
  Profile,
} from '@/types';

interface ProfileData extends Profile {
  onboarding_steps: OnboardingStep[];
  notifications: Notification[];
}

type State = {
  profile: Profile | null;
  notifications: Notification[];
};

type Getters = {
  unreadNotifications(): Notification[];
};

type Actions = {
  fetchProfile(): void;
  fetchNotification (id: number | string): void;
  subscribeToNotifications(): void;
  markAllAsRead(): void;
};

export const useUserStore = defineStore<'user', State, Getters, Actions>(
  'user',
  {
    state () {
      return {
        profile: null,
        notifications: [],
      };
    },

    getters: {
      unreadNotifications () {
        return this.notifications.filter(n => !n.read_on_date);
      },
    },

    actions: {
      async fetchProfile () {
        const $store = useAppStore();
        $store.loading = true;

        try {
          const user = useSupabaseUser();

          if (!user.value) {
            this.profile = null;
            $store.loading = false;
            $store.notifyNegative('An error occurred while loading your profile.');
            return;
          }

          const supabase = useSupabaseClient<Database>();
          const { data, error } = await supabase.from('profiles')
            .select(`
              *,
              onboarding_steps(*),
              notifications!notifications_profile_id_fkey(*, sender:sender_id(*))
            `)
            .eq('id', user.value.id)
            .returns<ProfileData>()
            .single();

          if (!data || error) {
            this.profile = null;
            this.notifications = [];
            $store.loading = false;
            $store.notifyNegative('An error occurred while loading your account.');
            return;
          }

          this.profile = data;
          this.notifications = (data as ProfileData).notifications;
          $store.loading = false;
        } catch (err) {
          console.error({ err });
        } finally {
          $store.loading = false;
        }
      },

      async fetchNotification (id) {
        const supabase = useSupabaseClient<Database>();

        const { data } = await supabase.from('notifications')
          .select('*, sender:sender_id(*)')
          .eq('id', id)
          .single();

        if (data) {
          const i = this.notifications.findIndex(n => n.id === id);
          this.notifications[i] = data as Notification;
        }
      },

      async subscribeToNotifications () {
        const supabase = useSupabaseClient<Database>();

        supabase.channel('notifications')
          .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'notifications' },
            ({ eventType, new: newNotification }) => {
              if (eventType === 'INSERT' || eventType === 'UPDATE') {
                this.fetchNotification(newNotification.id);
              }
            },
          )
          .subscribe();
      },

      async markAllAsRead () {
        const supabase = useSupabaseClient<Database>();
        const user = useSupabaseUser();
        const $store = useAppStore();
        const { data, error } = await supabase.from('notifications')
          .update({
            read_on_date: new Date()
              .toISOString(),
          })
          .eq('profile_id', user.value?.id as string)
          .select();

        if (error) {
          $store.notifyNegative('An error occurred while marking notifications as read.');
        }

        if (data) {
          this.notifications = data;
        }
      },
    },
  },
);
