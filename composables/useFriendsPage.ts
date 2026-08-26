import { FriendRequestStatus, type Database } from '@/types';
import {
  countSharedTripsByFriendId,
  emailsFromNestedField,
  idsFromField,
  matchingCrewIds,
  visibleSentEmails,
} from '@/utils/friendsPage';
import { parseFriendSearchEmail } from '@/utils/friendsSearch';
import type { ExtendedFriend, ExtendedFriendInvite, SentFriendEmail } from '@/types/planning';

export const useFriendsPage = () => {
  const $appStore = useAppStore();
  const $userStore = useUserStore();
  const supabase = useSupabaseClient<Database>();
  const user = useSupabaseUser();

  const requests = shallowRef<ExtendedFriendInvite[]>([]);
  const currentFriends = shallowRef<ExtendedFriend[]>([]);
  const sentInvites = shallowRef<ExtendedFriendInvite[]>([]);
  const sentEmails = shallowRef<SentFriendEmail[]>([]);
  const sharedTripCounts = ref<Map<string, number>>(new Map());
  const crewFilter = ref('');
  const inviteOpen = ref(false);
  const activeTab = ref<'crew' | 'requests' | 'sent'>('crew');
  const resendingEmail = ref<string | null>(null);

  const filteredCrew = computed(() => {
    const query = crewFilter.value.trim()
      .toLowerCase();
    const list = currentFriends.value as unknown;
    if (!query) return list as typeof currentFriends.value;
    const matchingIds = matchingCrewIds(list, query);
    return (list as Array<{ id: number }>)
      .filter(row => matchingIds.has(row.id)) as typeof currentFriends.value;
  });

  const friendEmails = computed(() =>
    emailsFromNestedField(currentFriends.value as unknown, 'friend'));

  const pendingEmails = computed(() =>
    emailsFromNestedField(sentInvites.value as unknown, 'recipient'));

  const friendProfileIds = computed(() =>
    idsFromField(currentFriends.value as unknown, 'friend_id'));

  const pendingProfileIds = computed(() =>
    idsFromField(sentInvites.value as unknown, 'recipient_id'));

  const offPlatformEmails = computed(() =>
    visibleSentEmails(
      sentEmails.value,
      $userStore.profile?.email,
      friendEmails.value,
      pendingEmails.value,
    ));

  const sentCount = computed(() =>
    sentInvites.value.length + offPlatformEmails.value.length);

  const requestBannerText = computed(() => {
    const count = requests.value.length;
    if (count === 1) {
      const sender = (requests.value[0] as unknown as {
        sender?: Parameters<typeof friendlyUsername>[0];
      } | undefined)?.sender;
      const name = friendlyUsername(sender, { includeTrailName: true });
      return `${name} wants to connect.`;
    }
    return `${count} friend requests`;
  });

  const fetchFriendPage = async () => {
    try {
      const userId = user.value?.sub;
      if (!userId) return;

      const [requestsResult, friendsResult, sentResult, tripsResult] = await Promise.all([
        supabase
          .from('friend_invitations')
          .select('*, sender:profiles!sender_id(*), recipient:profiles!recipient_id(*)')
          .eq('recipient_id', userId)
          .eq('status', FriendRequestStatus.PENDING),
        supabase
          .from('friends')
          .select('*, friend:profiles!friends_friend_id_fkey(*)')
          .eq('profile_id', userId),
        supabase
          .from('friend_invitations')
          .select('*, sender:profiles!sender_id(*), recipient:profiles!recipient_id(*)')
          .eq('sender_id', userId)
          .eq('status', FriendRequestStatus.PENDING),
        supabase
          .from('trips')
          .select('id, profile_id'),
      ]);

      if (requestsResult.error) {
        $appStore.notifyNegative('An error occurred while fetching friend requests.');
      } else {
        requests.value = (requestsResult.data as ExtendedFriendInvite[]) ?? [];
      }

      if (friendsResult.error) {
        $appStore.notifyNegative('An error occurred while fetching friends.');
      } else {
        currentFriends.value = (friendsResult.data as ExtendedFriend[]) ?? [];
      }

      if (sentResult.error) {
        $appStore.notifyNegative('An error occurred while fetching sent invites.');
      } else {
        sentInvites.value = (sentResult.data as ExtendedFriendInvite[]) ?? [];
      }

      const friendIds = (friendsResult.data ?? [])
        .map(row => row.friend_id)
        .filter((id): id is string => Boolean(id));

      let memberships: Array<{
        trip_id: number | null;
        profile_id: string | null;
        status: string;
      }> = [];
      if (friendIds.length) {
        const { data: membershipData, error: membershipError } = await supabase
          .from('trip_friends')
          .select('trip_id, profile_id, status')
          .eq('status', 'ACCEPTED')
          .in('profile_id', friendIds);
        if (!membershipError) memberships = membershipData ?? [];
      }

      sharedTripCounts.value = countSharedTripsByFriendId(
        userId,
        friendIds,
        tripsResult.data ?? [],
        memberships,
      );

      try {
        const payload = await $fetch<{ emails: SentFriendEmail[] }>('/api/friends/invites');
        sentEmails.value = payload?.emails ?? [];
      } catch {
        sentEmails.value = [];
      }
    } catch {
      $appStore.notifyNegative('An error occurred while fetching the page.');
    }
  };

  const removeRequest = (requestId: number) => {
    requests.value = requests.value.filter(request => request.id !== requestId);
  };

  const handleAcceptRequest = (friend: ExtendedFriend, requestId: number) => {
    currentFriends.value = [friend, ...currentFriends.value];
    removeRequest(requestId);
  };

  const handleDeclineRequest = (id: number) => {
    removeRequest(id);
  };

  const handleRemoveFriend = (friendshipId: number) => {
    currentFriends.value = currentFriends.value.filter(friend => friend.id !== friendshipId);
  };

  const openInvite = () => {
    inviteOpen.value = true;
  };

  const closeInvite = () => {
    inviteOpen.value = false;
  };

  const handleInvitesSent = () => {
    void fetchFriendPage();
  };

  const inviteErrorMessage = (err: unknown) => {
    const status = typeof err === 'object' && err && 'statusCode' in err
      ? Number((err as { statusCode: unknown }).statusCode)
      : 0;
    if (status === 429) return 'Too many invites. Try again later.';
    return 'Unable to send that invite.';
  };

  const resendInvite = async (email: string | null | undefined) => {
    const parsed = parseFriendSearchEmail(email);
    if (!parsed || resendingEmail.value) return;

    try {
      resendingEmail.value = parsed;
      await $fetch('/api/friends/invites', {
        body: { email: parsed },
        method: 'POST',
      });
      $appStore.notifyPositive('Invite sent.');
      await fetchFriendPage();
    } catch (err) {
      $appStore.notifyNegative(inviteErrorMessage(err));
    } finally {
      resendingEmail.value = null;
    }
  };

  const sharedTripCountFor = (friendId: string | null) =>
    friendId ? (sharedTripCounts.value.get(friendId) ?? 0) : 0;

  return {
    activeTab,
    closeInvite,
    crewFilter,
    currentFriends,
    fetchFriendPage,
    filteredCrew,
    friendEmails,
    friendProfileIds,
    handleAcceptRequest,
    handleDeclineRequest,
    handleInvitesSent,
    handleRemoveFriend,
    inviteOpen,
    offPlatformEmails,
    openInvite,
    ownEmail: computed(() => $userStore.profile?.email ?? null),
    pendingEmails,
    pendingProfileIds,
    requestBannerText,
    requests,
    resendingEmail,
    resendInvite,
    sentCount,
    sentInvites,
    sharedTripCountFor,
  };
};
