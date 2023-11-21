import { defineStore } from 'pinia';
import { useClient } from '@/lib/graphqlRequest';
import {
  getSdk,
  TripFriendStatus,
} from '@/generated/types';
import type {
  CreateOnboardStepInput,
  CreateOnboardStepResponse,
  DiscourseInput,
  DiscoursePayload,
  Notification,
  NotificationsInput,
  TripFriend,
  UpdateAvatarInput,
  UpdateNotificationInput,
  UpdatePasswordInput,
  UpdatePasswordPayload,
  UpdateTripFriendResponse,
  UpdateUserInput,
  User,
 } from '@/generated/types';

type State = {
  currentUser: User | null;
  loading: boolean;
  notifications: Notification[];
  totalCount: number;
};

type Getters = {
  totalUnread(): number;
};

type Actions = {
  createOnboardingStep(input: CreateOnboardStepInput): Promise<CreateOnboardStepResponse>;
  fetchCurrentUser(): void;
  fetchNotifications(input: NotificationsInput): void;
  handleAcceptInvite(inviteId: number): Promise<UpdateTripFriendResponse>;
  handleDeclineInvite(inviteId: number): Promise<UpdateTripFriendResponse>;
  handleUndoInvite(invite: TripFriend): Promise<UpdateTripFriendResponse>;
  loginToForums(input: DiscourseInput): Promise<DiscoursePayload>;
  markAllAsRead(): void;
  sendWelcomeEmail(): void;
  updateAvatar(input: UpdateAvatarInput): void;
  updateNotification(input: UpdateNotificationInput): void;
  updatePassword(input: UpdatePasswordInput): Promise<UpdatePasswordPayload>;
  updateUser(input: UpdateUserInput): void;
};

export const useUserStore = defineStore<'user', State, Getters, Actions>(
  'user',
  {
    state () {
      return {
        currentUser: null,
        loading: false,
        notifications: [],
        totalCount: 0,
      };
    },

    getters: {
      totalUnread () {
        return this.notifications.reduce((acc, notification) => {
          if (!notification.read_on_date) {
            return acc + 1;
          }

          return acc;
        }, 0);
      },
    },

    actions: {
      async createOnboardingStep (input: CreateOnboardStepInput) {
        const client = useClient();
        const sdk = getSdk(client);

        const { createOnboardStep } = await sdk.CreateOnboardingStep({ input });

        return createOnboardStep as CreateOnboardStepResponse;
      },

      async fetchCurrentUser () {
        const client = useClient();
        const sdk = getSdk(client);

        this.loading = true;

        try {
          const { me } = await sdk.Me();

          if (!me?.user || me?.errors) {
            this.currentUser = null;
            this.loading = false;
            console.error('Error loading user');
            return;
          }

          this.currentUser = me.user as User;
          this.notifications = me.notifications as Notification[];
          this.totalCount = me.totalCount || 0;
          this.loading = false;
        } catch (err) {
          console.log({ err });
          this.loading = false;
        }
      },

      async fetchNotifications (input: NotificationsInput) {
        const client = useClient();
        const sdk = getSdk(client);

        const { notifications } = await sdk.Notifications({ input });

        if (notifications.notifications && !notifications.errors) {
          this.notifications.push(...notifications.notifications as Notification[]);
          this.totalCount = notifications.totalCount;
        }
      },

      async handleAcceptInvite (inviteId: number) {
        const client = useClient();
        const sdk = getSdk(client);
        const input = {
          id: inviteId,
          status: TripFriendStatus.Accepted,
          accepted_invite_on: new Date()
            .toISOString(),
        };

        const { updateTripFriend } = await sdk.UpdateTripFriend({ input });
        return updateTripFriend as UpdateTripFriendResponse;
      },

      async handleDeclineInvite (inviteId: number) {
        const client = useClient();
        const sdk = getSdk(client);
        const input = { id: inviteId, status: TripFriendStatus.Declined };

        const { updateTripFriend } = await sdk.UpdateTripFriend({ input });
        return updateTripFriend as UpdateTripFriendResponse;
      },

      async handleUndoInvite (invite: TripFriend) {
        const client = useClient();
        const sdk = getSdk(client);
        const input = { id: invite.id, status: TripFriendStatus.Pending, accepted_invite_on: null };

        const { updateTripFriend } = await sdk.UpdateTripFriend({ input });
        return updateTripFriend as UpdateTripFriendResponse;
      },

      async loginToForums (input: DiscourseInput) {
        const client = useClient();
        const sdk = getSdk(client);

        const { loginToForums } = await sdk.LoginToForums({ input });
        return loginToForums;
      },

      async markAllAsRead () {
        const client = useClient();
        const sdk = getSdk(client);

        const { markAllAsRead } = await sdk.MarkAllAsRead({ user_id: this.currentUser?.id as string });
        if (!markAllAsRead.errors) this.notifications = markAllAsRead.notifications as Notification[];
      },

      sendWelcomeEmail () {
        const client = useClient();
        const sdk = getSdk(client);

        sdk.SendWelcomeEmail();
      },

      async updateAvatar (input: UpdateAvatarInput) {
        const client = useClient();
        const sdk = getSdk(client);

        const { updateAvatar } = await sdk.UpdateAvatar({ input });
        if (!updateAvatar.errors) {
          this.currentUser = updateAvatar.user as User;
        }
      },

      async updateNotification (input: UpdateNotificationInput) {
        const client = useClient();
        const sdk = getSdk(client);

        const { updateNotification } = await sdk.UpdateNotification({ input: { ...input } });
        if (!updateNotification.errors) {
          const i = this.notifications.findIndex(n => n.id === updateNotification.notification?.id);
          this.notifications[i] = updateNotification.notification as Notification;
        }
      },

      async updatePassword (input: UpdatePasswordInput) {
        const client = useClient();
        const sdk = getSdk(client);

        const { updatePassword } = await sdk.UpdatePassword({ input });
        return updatePassword;
      },

      async updateUser (input: UpdateUserInput) {
        const client = useClient();
        const sdk = getSdk(client);

        const { updateUser } = await sdk.UpdateUser({ input });
        if (!updateUser.errors) {
          this.currentUser = updateUser.user as User;
        }
      },
    },
  },
);
