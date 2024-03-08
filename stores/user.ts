import { defineStore } from 'pinia';
import { useAppStore } from '@/stores/app';
import { SubscriptionLevel, type Database, type Notification } from '@/types';
import type { ProfileApiResponse } from '@/types/helpers';

type State = {
  profile: ProfileApiResponse | null;
};

type Getters = {
  hasForumAccess(): boolean;
  unreadNotifications(): Notification[];
};

type Actions = {
  fetchProfile(): void;
  fetchNotification (id: number | string): void;
  subscribeToNotifications(): void;
  markAllAsRead(): void;
  deleteAvatar(): Promise<{ success: boolean }>
  updateAvatar(file: File): Promise<{ success: boolean }>;
};

export const useUserStore = defineStore<'user', State, Getters, Actions>(
  'user',
  {
    state () {
      return {
        profile: null,
      };
    },

    getters: {
      hasForumAccess () {
        return this.profile?.subscriptions[0].prices.identifier === SubscriptionLevel.ANNUAL || this.profile?.subscriptions[0].prices.identifier === SubscriptionLevel.MONTHLY || this.profile?.subscriptions[0].prices.identifier === SubscriptionLevel.LIFE;
      },
      unreadNotifications () {
        return this.profile!.notifications.filter(n => !n.read_on_date);
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
            .single();

          if (!data || error) {
            this.profile = null;
            this.profile!.notifications = [];
            $store.loading = false;
            $store.notifyNegative('An error occurred while loading your account.');
            return;
          }

          this.profile = data as any;
          this.profile!.notifications = (data).notifications;
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
          const i = this.profile!.notifications.findIndex(n => n.id === id);
          this.profile!.notifications[i] = data;
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
          this.profile!.notifications = data;
        }
      },

      async deleteAvatar () {
        try {
          const supabase = useSupabaseClient<Database>();
          const user = useSupabaseUser();

           // get the list of files in the user's avatar directory
          const { data: files, error: listError } = await supabase.storage.from('avatars')
          .list(`${user.value!.id}/`);

          if (listError) return { success: false };

          // if there are any files in the directory, delete them
          if (files?.length > 0) {
            const { error: deleteError } = await supabase.storage.from('avatars')
              .remove([`${user.value!.id}/${files[0].name}`]);
            if (deleteError) return { success: false };
          }

          return { success: true };
        } catch (err) {
          return { success: false };
        }
      },

      async updateAvatar (file) {
        try {
          const supabase = useSupabaseClient<Database>();
          const user = useSupabaseUser();

          // get the list of files in the user's avatar directory
          const { data: files, error: listError } = await supabase.storage.from('avatars')
            .list(`${user.value!.id}/`);

          if (listError) return { success: false };

          // if there are any files in the dictory, delete them
          if (files?.length > 0) {
            const { error: deleteError } = await supabase.storage.from('avatars')
              .remove([`${user.value!.id}/${files[0].name}`]);
            if (deleteError) return { success: false };
          }

          // upload the new file
          const { data, error } = await supabase.storage.from('avatars')
            .upload(`${user.value!.id}/${file.name}`, file, { upsert: true });
          return (data && !error) ? { success: true } : { success: false };
        } catch (err) {
          return { success: false };
        }
      },
    },
  },
);
