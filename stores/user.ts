import { defineStore } from 'pinia';
import supabase from '@/lib/supabase';
import { getUserId } from '@/helpers/functions';
import { useAppStore } from '@/stores/app';
import type {
  Friend,
  Notification,
  Trip,
  TripFriend,
  UpdateNotification,
  User,
} from '@/types';

interface DashboardData {
  friends: Friend[];
  trips: Trip[];
  trip_friends: TripFriend[];
}

type State = {
  currentUser: User | null;
  loading: boolean;
  notifications: {
    items: Notification[];
    totalCount: number;
  };
};

type Getters = {
  unreadNotifications(): Notification[];
};

type Actions = {
  // createOnboardingStep(input: CreateOnboardStepInput): Promise<CreateOnboardStepResponse>;
  fetchCurrentUser(): void;
  fetchDashboard(): Promise<DashboardData>;
  // fetchNotifications(input: NotificationsInput): void;
  // handleAcceptInvite(inviteId: number): Promise<UpdateTripFriendResponse>;
  // handleDeclineInvite(inviteId: number): Promise<UpdateTripFriendResponse>;
  // handleUndoInvite(invite: TripFriend): Promise<UpdateTripFriendResponse>;
  // loginToForums(input: DiscourseInput): Promise<DiscoursePayload>;
  markAllAsRead(): void;
  sendWelcomeEmail(): void;
  // updateAvatar(input: UpdateAvatarInput): void;
  updateNotification(input: UpdateNotification): void;
  // updatePassword(input: UpdatePasswordInput): Promise<UpdatePasswordPayload>;
  // updateUser(input: UpdateUserInput): void;
};

export const useUserStore = defineStore<'user', State, Getters, Actions>(
  'user',
  {
    state () {
      return {
        currentUser: null,
        loading: false,
        notifications: {
          items: [],
          totalCount: 0,
        },
      };
    },

    getters: {

      unreadNotifications () {
        return this.notifications.items.filter(n => !n.read_on_date);
      },
    },

    actions: {
      // async createOnboardingStep (input: CreateOnboardStepInput) {
      //   const client = useClient();
      //   const sdk = getSdk(client);

      //   const { createOnboardStep } = await sdk.CreateOnboardingStep({ input });

      //   return createOnboardStep as CreateOnboardStepResponse;
      // },

      async fetchCurrentUser () {
        const $store = useAppStore();
        this.loading = true;

        try {
          const { id, error: sessionError } = await getUserId();

          if (sessionError || !id) {
            this.currentUser = null;
            this.loading = false;
            $store.notifyNegative('An error occurred while loading your account.');
            return;
          }

          const { data: user, error } = await supabase.from('users')
            .select('*, onboarding_steps(*), notifications(*)')
            .eq('id', id)
            .single();

          if (!user || error) {
            this.currentUser = null;
            this.notifications = { items: [], totalCount: 0 };
            this.loading = false;
            $store.notifyNegative('An error occurred while loading your account.');
            return;
          }

          this.currentUser = user;
          this.notifications = { items: user.notifications, totalCount: user.notifications.length };
          this.loading = false;
        } catch (err) {
          console.error({ err });
        } finally {
          this.loading = false;
        }
      },

      async fetchDashboard () {
        this.loading = true;
        const $store = useAppStore();

        try {
          const { id, error: sessionError } = await getUserId();

          if (sessionError || !id) {
            $store.notifyNegative('An error occurred while loading your account.');
            this.loading = false;
            return { trip_friends: [], friends: [], trips: [] } as DashboardData;
          }

          const { data, error } = await supabase.from('users')
            .select('trip_friends(*), friends!friends_friend_id_fkey(*), trips(*)')
            .eq('id', id)
            .single();
          console.log({ data });
          console.log({ error });

          if (!data || error) {
            $store.notifyNegative('An error occurred while loading your account.');
            this.loading = false;
            return { trip_friends: [], friends: [], trips: [] } as DashboardData;
          }

          return data as DashboardData;
        } catch (err) {
          console.error({ err });
          return { trip_friends: [], friends: [], trips: [] } as DashboardData;
        } finally {
          this.loading = false;
        }
      },

      // async fetchNotifications (input: NotificationsInput) {
      //   const client = useClient();
      //   const sdk = getSdk(client);

      //   const { notifications } = await sdk.Notifications({ input });

      //   if (notifications.notifications && !notifications.errors) {
      //     this.notifications.push(...notifications.notifications as Notification[]);
      //     this.totalCount = notifications.totalCount;
      //   }
      // },

      // async handleAcceptInvite (inviteId: number) {
      //   const client = useClient();
      //   const sdk = getSdk(client);
      //   const input = {
      //     id: inviteId,
      //     status: TripFriendStatus.Accepted,
      //     accepted_invite_on: new Date()
      //       .toISOString(),
      //   };

      //   const { updateTripFriend } = await sdk.UpdateTripFriend({ input });
      //   return updateTripFriend as UpdateTripFriendResponse;
      // },

      // async handleDeclineInvite (inviteId: number) {
      //   const client = useClient();
      //   const sdk = getSdk(client);
      //   const input = { id: inviteId, status: TripFriendStatus.Declined };

      //   const { updateTripFriend } = await sdk.UpdateTripFriend({ input });
      //   return updateTripFriend as UpdateTripFriendResponse;
      // },

      // async handleUndoInvite (invite: TripFriend) {
      //   const client = useClient();
      //   const sdk = getSdk(client);
      //   const input = { id: invite.id, status: TripFriendStatus.Pending, accepted_invite_on: null };

      //   const { updateTripFriend } = await sdk.UpdateTripFriend({ input });
      //   return updateTripFriend as UpdateTripFriendResponse;
      // },

      // async loginToForums (input: DiscourseInput) {
      //   const client = useClient();
      //   const sdk = getSdk(client);

      //   const { loginToForums } = await sdk.LoginToForums({ input });
      //   return loginToForums;
      // },

      sendWelcomeEmail () {
        // const client = useClient();
        // const sdk = getSdk(client);

        // sdk.SendWelcomeEmail();
      },

      // async updateAvatar (input: UpdateAvatarInput) {
      //   const client = useClient();
      //   const sdk = getSdk(client);

      //   const { updateAvatar } = await sdk.UpdateAvatar({ input });
      //   if (!updateAvatar.errors) {
      //     this.currentUser = updateAvatar.user as User;
      //   }
      // },

      async markAllAsRead () {
        const $store = useAppStore();
        const { data, error } = await supabase.from('notifications')
          .update({ read_on_date: new Date() })
          .eq('user_id', this.currentUser?.id)
          .select();

        if (error) {
          $store.notifyNegative('An error occurred while marking notifications as read.');
        }

        if (data) {
          this.notifications = { items: data, totalCount: data.length };
        }
      },

      async updateNotification (input: UpdateNotification) {
        const $store = useAppStore();
        const { data, error } = await supabase.from('notifications')
          .update({ read_on_date: new Date()
            .toISOString() })
          .eq('id', input.id)
          .select()
          .single();

        if (error) {
          $store.notifyNegative('An error occurred while marking notifications as read.');
        }

        if (data) {
          const i = this.notifications.items.findIndex(n => n.id === data.id);
          this.notifications.items[i] = data;
        }
      },

      // async updatePassword (input: UpdatePasswordInput) {
      //   const client = useClient();
      //   const sdk = getSdk(client);

      //   const { updatePassword } = await sdk.UpdatePassword({ input });
      //   return updatePassword;
      // },

      // async updateUser (input: UpdateUserInput) {
      //   const client = useClient();
      //   const sdk = getSdk(client);

      //   const { updateUser } = await sdk.UpdateUser({ input });
      //   if (!updateUser.errors) {
      //     this.currentUser = updateUser.user as User;
      //   }
      // },
    },
  },
);
