import { defineStore } from 'pinia';
import { useAppStore } from '@/stores/app';
import { SubscriptionLevel, type Database, type TablesUpdate } from '@/types';
import { isPaidPlanIdentifier } from '@/utils/planLimits';
import type { ExtendedNotification, ProfileApiResponse, ProfileLayoutResponse } from '@/types/profile';
import type { QueryData, RealtimeChannel, SupabaseClient } from '@supabase/supabase-js';

/** Profile plus its subscriptions and the price each subscription points at. */
export const profileWithSubscriptionsQuery = (
  supabase: SupabaseClient<Database>,
  profileId: string,
) => supabase.from('profiles')
  .select(`
    *,
    subscriptions!subscriptions_profile_id_fkey(*, prices!subscriptions_price_id_fkey(*))
  `)
  .eq('id', profileId)
  .single();

export type ProfileWithSubscriptions = QueryData<ReturnType<typeof profileWithSubscriptionsQuery>>;

/** Module-scoped so remounts can tear down the previous Realtime channel. */
let notificationsChannel: RealtimeChannel | null = null;

export const useUserStore = defineStore('user', () => {
  const profile = ref<ProfileApiResponse | null>(null);
  const notifications = ref<ExtendedNotification[]>([]);

  const currentPlanIdentifier = computed<SubscriptionLevel>(() =>
    (profile.value?.subscriptions?.[0]?.prices?.identifier as SubscriptionLevel | undefined)
      ?? SubscriptionLevel.FREE);

  const isPaidMember = computed(() => isPaidPlanIdentifier(currentPlanIdentifier.value));

  const unreadNotifications = computed(() => notifications.value.filter(n => !n.read_on_date));

  const setProfile = (next: ProfileLayoutResponse | null) => {
    profile.value = next;
  };

  const fetchProfile = async () => {
    const $store = useAppStore();

    try {
      const user = useSupabaseUser();

      if (!user.value) {
        profile.value = null;
        notifications.value = [];
        $store.notifyNegative('An error occurred while loading your profile.');
        return;
      }

      const supabase = useSupabaseClient<Database>();
      const { data, error } = await profileWithSubscriptionsQuery(supabase, user.value.sub);

      if (!data || error) {
        profile.value = null;
        $store.notifyNegative('An error occurred while loading your account.');
        return;
      }

      // PostgREST returns [] for an empty embed, but normalize defensively so
      // consumers can always iterate. Mutated in place rather than rebuilt: a
      // fresh object literal makes TS compare two large shapes and hit TS2589.
      data.subscriptions ??= [];
      profile.value = data;
    } catch (err) {
      console.error({ err });
    }
  };

  const fetchNotifications = async () => {
    try {
      const user = useSupabaseUser();
      if (!user.value) return;

      notifications.value = await $fetch<ExtendedNotification[]>('/api/notifications');
    } catch (err) {
      console.error({ err });
    }
  };

  const fetchNotification = async (id: number | string) => {
    const supabase = useSupabaseClient<Database>();

    const { data } = await supabase.from('notifications')
      .select('*, sender:sender_id(*)')
      .eq('id', Number(id))
      .single();

    if (!data) return;

    const i = notifications.value.findIndex(n => n.id === Number(id));
    if (i === -1) {
      notifications.value.push(data);
    } else {
      notifications.value[i] = data;
    }
  };

  const subscribeToNotifications = async () => {
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
            fetchNotification(newNotification.id);
          }
        },
      )
      .subscribe();
  };

  const unsubscribeFromNotifications = async () => {
    if (!notificationsChannel) return;
    const supabase = useSupabaseClient<Database>();
    await supabase.removeChannel(notificationsChannel);
    notificationsChannel = null;
  };

  const markAllAsRead = async () => {
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
    notifications.value = notifications.value.map(n => ({
      ...n,
      read_on_date: n.read_on_date ?? readOn,
    }));
  };

  const deleteAvatar = async () => {
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
  };

  const updateAvatar = async (file: File) => {
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

      await fetchProfile();
      return { success: true };
    } catch {
      return { success: false };
    }
  };

  const updateProfile = async (next: TablesUpdate<'profiles'>) => {
    const $appStore = useAppStore();
    try {
      const supabase = useSupabaseClient<Database>();
      const user = useSupabaseUser();
      const { error } = await supabase.from('profiles')
        .update(next)
        .eq('id', user.value!.sub)
        .select();

      if (error) {
        $appStore.notifyNegative('An error occurred while updating your profile.');
        return { success: false };
      }
      else {
        await fetchProfile();
        $appStore.notifyPositive('Successfully updated your profile!');
        return { success: true };
      }
    } catch {
      $appStore.notifyNegative('An error occurred while updating your profile.');
      return { success: false };
    }
  };

  return {
    currentPlanIdentifier,
    deleteAvatar,
    fetchNotification,
    fetchNotifications,
    fetchProfile,
    isPaidMember,
    markAllAsRead,
    notifications,
    profile,
    setProfile,
    subscribeToNotifications,
    unreadNotifications,
    unsubscribeFromNotifications,
    updateAvatar,
    updateProfile,
  };
});
