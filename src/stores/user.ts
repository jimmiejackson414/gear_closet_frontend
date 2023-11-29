import { defineStore } from 'pinia';
// import { parse } from 'rss-to-json';
// import he from 'he';
// import sanitizeHtml from 'sanitize-html';
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
} from '@/generated/types';

interface News {
  author?: string;
  created?: string;
  description?: string;
  image?: string;
  link?: string;
  published?: string;
  source?: string;
  title?: string;
}

interface DashboardData {
  friends: Friend[];
  upcomingTrips: Trip[];
  invitations: TripFriend[];
  news: News[];
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
        const data: DashboardData = { invitations: [], friends: [], news: [], upcomingTrips: [] };

        try {
          const { id, error: sessionError } = await getUserId();

          if (sessionError || !id) {
            $store.notifyNegative('An error occurred while loading your account.');
            this.loading = false;
            return data;
          }

          // fetch upcoming trips
          const { data: tripsData, error } = await supabase
            .from('trips')
            .select('*')
            .eq('user_id', id)
            .gte('starting_date', new Date()
.toISOString())
            .order('created_at', { ascending: false });

          if (error) {
            $store.notifyNegative('An error occurred while loading your dashboard.');
            this.loading = false;
            return data;
          }

          data.upcomingTrips = tripsData;

          // fetch friends
          const { data: friendsData, error: friendsError } = await supabase
            .from('friends')
            .select('*, user:friend_id!inner(*)')
            .eq('user_id', id)
            .order('created_at', { ascending: false });

          if (friendsError) {
            $store.notifyNegative('An error occurred while loading your dashboard.');
            this.loading = false;
            return data;
          }

          data.friends = friendsData;

          // fetch invitations
          const { data: invitationsData, error: invitationsError } = await supabase
            .from('trip_friends')
            .select('*, trip:trip_id(*, user:user_id(*)), user:user_id(*)')
            .eq('user_id', id)
            .eq('status', 'PENDING')
            .order('created_at', { ascending: false });

          if (invitationsError) {
            $store.notifyNegative('An error occurred while loading your dashboard.');
            this.loading = false;
            return data;
          }

          data.invitations = invitationsData;

          // fetch news
//           const feeds = [] as any[];
//           const sources = [
//             'https://zpacks.com/blogs/news.atom',
//             'http://feeds.feedburner.com/sectionhiker/tEPT?format=xml',
//             'https://www.cleverhiker.com/blog?format=rss',
//             'https://gearjunkie.com/feed',
//             'http://www.outsideonline.com/rss/all/rss.xml',
//           ];

//           await Promise.allSettled(
//             sources.map(async source => {
//               const rss = await parse(source, {});
//               feeds.push(rss);
//             }),
//           );

//           const transformed = feeds.map(feed => {
//             feed.items.forEach(async (item: any) => {
//               item.title = he.decode(item.title);
//               item.source = feed.title;
//               item.image = item.enclosure.url;
//               item.description = sanitizeHtml(item.description, {
//                 allowedTags: [],
//                 allowedAttributes: {},
//               });
//             });
//             return [...feed.items];
//           });

//           const sorted = transformed.flat()
// .sort((a, b) => b.created - a.created)
//           .slice(0, 12);

//           data.news = sorted;

          return data as DashboardData;
        } catch (err) {
          console.error({ err });
          return data;
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
