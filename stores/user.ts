import { defineStore } from 'pinia';
import { useAppStore } from '@/stores/app';
import { type Database, SubscriptionLevel, type Tables, type TablesUpdate } from '@/types';
import { isPaidPlanIdentifier } from '@/utils/planLimits';
import type { ExtendedNotification, ProfileApiResponse, SubscriptionType } from '@/types/helpers';
import type { RealtimeChannel } from '@supabase/supabase-js';

type State = {
  profile: ProfileApiResponse | null;
  notifications: ExtendedNotification[];
};

type Getters = {
  isPaidMember(): boolean;
  currentPlanIdentifier(): SubscriptionLevel;
  unreadNotifications(): ExtendedNotification[];
};

type Actions = {
  fetchProfile(): void;
  fetchNotifications(): void;
  fetchNotification (id: number | string): void;
  subscribeToNotifications(): void;
  unsubscribeFromNotifications(): void;
  markAllAsRead(): void;
  deleteAvatar(): Promise<{ success: boolean }>
  updateAvatar(file: File): Promise<{ success: boolean }>;
  updateProfile(profile: TablesUpdate<'profiles'>): Promise<{ success: boolean }>;
};

/** Module-scoped so remounts can tear down the previous Realtime channel. */
let notificationsChannel: RealtimeChannel | null = null;

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
      isPaidMember () {
        return isPaidPlanIdentifier(this.currentPlanIdentifier);
      },
      currentPlanIdentifier () {
        return (this.profile?.subscriptions?.[0]?.prices?.identifier as SubscriptionLevel | undefined)
          ?? SubscriptionLevel.FREE;
      },
      unreadNotifications () {
        return this.notifications.filter(n => !n.read_on_date);
      },
    },

    actions: {
      async fetchProfile () {
        const $store = useAppStore();

        try {
          const user = useSupabaseUser();

          if (!user.value) {
            this.profile = null;
            this.notifications = [];
            $store.notifyNegative('An error occurred while loading your profile.');
            return;
          }

          const supabase = useSupabaseClient<Database>();

          // Nested subscription/price select types exceed TS instantiation depth.
          const { data, error }: {
            data: (Tables<'profiles'> & { subscriptions?: SubscriptionType[] | null }) | null;
            error: { message: string } | null;
          } = await supabase.from('profiles')
            .select(`
              *,
              subscriptions!subscriptions_profile_id_fkey(*, prices!subscriptions_price_id_fkey(*))
            `)
            .eq('id', user.value.sub)
            .single() as any;

          if (!data || error) {
            this.profile = null;
            $store.notifyNegative('An error occurred while loading your account.');
            return;
          }

          this.profile = {
            ...data,
            subscriptions: data.subscriptions ?? [],
          } as any;
        } catch (err) {
          console.error({ err });
        }
      },

      async fetchNotifications () {
        try {
          const user = useSupabaseUser();
          if (!user.value) return;

          this.notifications = await $fetch<ExtendedNotification[]>('/api/notifications');
        } catch (err) {
          console.error({ err });
        }
      },

      async fetchNotification (id) {
        const supabase = useSupabaseClient<Database>();

        const { data }: { data: ExtendedNotification | null } = await supabase.from('notifications')
          .select('*, sender:sender_id(*)')
          .eq('id', Number(id))
          .single() as any;

        if (!data) return;

        const i = this.notifications.findIndex(n => n.id === Number(id));
        if (i === -1) {
          this.notifications.push(data);
        } else {
          this.notifications[i] = data;
        }
      },

      async subscribeToNotifications () {
        const supabase = useSupabaseClient<Database>();

        // Dedupe: tear down any prior channel before creating a new one.
        if (notificationsChannel) {
          await supabase.removeChannel(notificationsChannel);
          notificationsChannel = null;
        }

        notificationsChannel = supabase.channel('notifications')
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

      async unsubscribeFromNotifications () {
        if (!notificationsChannel) return;
        const supabase = useSupabaseClient<Database>();
        await supabase.removeChannel(notificationsChannel);
        notificationsChannel = null;
      },

      async markAllAsRead () {
        const supabase = useSupabaseClient<Database>();
        const user = useSupabaseUser();
        const $store = useAppStore();
        const { error } = await supabase.from('notifications')
          .update({
            read_on_date: new Date()
              .toISOString(),
          })
          .eq('profile_id', user.value?.sub as string);

        if (error) {
          $store.notifyNegative('An error occurred while marking notifications as read.');
          return;
        }

        const readOn = new Date()
          .toISOString();
        this.notifications = this.notifications.map(n => ({
          ...n,
          read_on_date: n.read_on_date ?? readOn,
        }));
      },

      async deleteAvatar () {
        try {
          const supabase = useSupabaseClient<Database>();
          const user = useSupabaseUser();

          // get the list of files in the user's avatar directory
          const { data: files, error: listError } = await supabase.storage.from('avatars')
            .list(`${user.value!.sub}/`);

          if (listError) return { success: false };

          // if there are any files in the directory, delete them
          if (files?.length > 0) {
            const firstFile = files[0];
            if (!firstFile) return { success: false };
            const { error: deleteError } = await supabase.storage.from('avatars')
              .remove([`${user.value!.sub}/${firstFile.name}`]);
            if (deleteError) return { success: false };
          }

          return { success: true };
        } catch {
          return { success: false };
        }
      },

      async updateAvatar (file) {
        try {
          const supabase = useSupabaseClient<Database>();
          const user = useSupabaseUser();
          const profileId = user.value!.sub;

          // get the list of files in the user's avatar directory
          const { data: files, error: listError } = await supabase.storage.from('avatars')
            .list(`${profileId}/`);

          if (listError) return { success: false };

          // if there are any files in the directory, delete them
          if (files?.length > 0) {
            const firstFile = files[0];
            if (!firstFile) return { success: false };
            const { error: deleteError } = await supabase.storage.from('avatars')
              .remove([`${profileId}/${firstFile.name}`]);
            if (deleteError) return { success: false };
          }

          // upload the new file
          const { data, error } = await supabase.storage.from('avatars')
            .upload(`${profileId}/${file.name}`, file, { upsert: true });

          if (!data || error) return { success: false };

          const { error: profileError } = await supabase.from('profiles')
            .update({ image: data.path })
            .eq('id', profileId);

          if (profileError) return { success: false };

          await this.fetchProfile();
          return { success: true };
        } catch {
          return { success: false };
        }
      },

      async updateProfile (profile: TablesUpdate<'profiles'>) {
        const $appStore = useAppStore();
        try {
          const supabase = useSupabaseClient<Database>();
          const user = useSupabaseUser();
          const { error } = await supabase.from('profiles')
            .update(profile)
            .eq('id', user.value!.sub)
            .select();

          if (error) {
            $appStore.notifyNegative('An error occurred while updating your profile.');
            return { success: false };
          }
          else {
            await this.fetchProfile();
            $appStore.notifyPositive('Successfully updated your profile!');
            return { success: true };
          }
        } catch {
          $appStore.notifyNegative('An error occurred while updating your profile.');
          return { success: false };
        }
      },
    },
  },
);
