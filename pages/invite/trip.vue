<script lang="ts" setup>
  import { destinationAfterAuth, safeInternalPath } from '@/utils/authRedirect';
  import type { TripInviteClaimResult, TripInvitePreview } from '@/types/planning';
  import type { ProfileLayoutResponse } from '@/types/profile';

  definePageMeta({
    layout: 'public-layout',
    public: true,
  });

  useHead({
    title: 'Trip invitation',
  });

  const route = useRoute();
  const user = useSupabaseUser();
  const redirectInfo = useSupabaseCookieRedirect();

  const token = computed(() => {
    const raw = route.query.token;
    return typeof raw === 'string' ? raw : '';
  });

  const invitePath = computed(() => {
    if (!token.value) return null;
    return safeInternalPath(`/invite/trip?token=${encodeURIComponent(token.value)}`);
  });

  if (invitePath.value) {
    redirectInfo.path.value = invitePath.value;
  }

  const preview = ref<TripInvitePreview | null>(null);
  const claimResult = ref<TripInviteClaimResult | null>(null);
  const loading = ref(true);
  const claiming = ref(false);

  const isLoggedIn = computed(() => Boolean(user.value?.sub));

  const waitingOnClaim = computed(() =>
    Boolean(
      isLoggedIn.value
        && preview.value
        && (preview.value.status === 'ok' || preview.value.status === 'used')
        && !claimResult.value,
    ));

  const errorCopy = computed(() => {
    if (waitingOnClaim.value) return null;

    const reason = claimResult.value && !claimResult.value.ok
      ? claimResult.value.reason
      : preview.value && preview.value.status !== 'ok'
        ? preview.value.status
        : null;

    switch (reason) {
    case 'expired':
      return {
        title: 'This invite has expired',
        description: 'Ask the trip owner to send a new invitation.',
      };
    case 'used':
      return {
        title: 'This invite has already been used',
        description: 'If you already joined, open your dashboard to accept the trip.',
      };
    case 'email_mismatch':
      return {
        title: 'This invite was sent to a different email',
        description: 'Sign in with the address that received the invitation.',
      };
    case 'invalid':
      return {
        title: 'This invite link is invalid',
        description: 'The link may be incorrect, or the invitation may have been removed.',
      };
    default:
      return null;
    }
  });

  const loadPreview = async () => {
    if (!token.value) {
      preview.value = { status: 'invalid' };
      loading.value = false;
      return;
    }

    try {
      preview.value = await $fetch<TripInvitePreview>('/api/trip-invites/preview', {
        query: { token: token.value },
      });
    } catch {
      preview.value = { status: 'invalid' };
    } finally {
      loading.value = false;
    }
  };

  const goToDashboard = async () => {
    const profile = await $fetch<ProfileLayoutResponse | null>('/api/profile', {
      headers: useRequestHeaders(['cookie']),
    })
      .catch(() => null);

    const dest = destinationAfterAuth({
      onboardDate: profile?.onboard_date,
      savedPath: invitePath.value,
    });
    if (dest.consumeSavedPath) {
      redirectInfo.pluck();
    }
    await navigateTo(dest.path === '/onboarding' ? dest.path : '/');
  };

  const claim = async () => {
    if (!token.value || claiming.value) return;
    claiming.value = true;
    try {
      claimResult.value = await $fetch<TripInviteClaimResult>('/api/trip-invites/claim', {
        method: 'POST',
        body: { token: token.value },
      });
      if (claimResult.value.ok) {
        await goToDashboard();
      }
    } catch (err) {
      const status = typeof err === 'object' && err && 'statusCode' in err
        ? Number((err as { statusCode: unknown }).statusCode)
        : 0;
      if (status === 401) {
        await navigateTo('/login');
        return;
      }
      claimResult.value = { ok: false, reason: 'invalid' };
    } finally {
      claiming.value = false;
    }
  };

  await loadPreview();

  watch(user, async (next) => {
    if (!next?.sub || claimResult.value) return;
    if (preview.value?.status === 'ok' || preview.value?.status === 'used') {
      await claim();
    }
  }, { immediate: true });
</script>

<template>
  <div class="mx-auto max-w-lg">
    <card class="px-8 py-10 rounded-3xl">
      <gc-skeleton v-if="loading || waitingOnClaim" />
      <div
        v-else-if="errorCopy"
        class="flex flex-col gap-4 text-center">
        <typography class="font-bold text-xl">
          {{ errorCopy.title }}
        </typography>
        <p class="text-muted-foreground">
          {{ errorCopy.description }}
        </p>
        <nuxt-link
          class="self-center"
          to="/">
          <button-root variant="outline">
            Go to Gear Closet
          </button-root>
        </nuxt-link>
      </div>
      <div
        v-else-if="preview?.status === 'ok'"
        class="flex flex-col gap-4 text-center">
        <typography class="font-bold text-xl">
          You're invited
        </typography>
        <p class="text-muted-foreground">
          {{ preview.inviterName }} invited you to
          <span class="font-medium text-foreground">{{ preview.tripName }}</span>
          on Gear Closet.
        </p>
        <div
          v-if="isLoggedIn"
          class="flex justify-center">
          <button-root
            :disabled="claiming"
            :loading="claiming"
            @click="claim">
            Join trip
          </button-root>
        </div>
        <div
          v-else
          class="flex flex-wrap justify-center gap-3">
          <nuxt-link to="/login">
            <button-root>
              Log in
            </button-root>
          </nuxt-link>
          <nuxt-link to="/register">
            <button-root variant="outline">
              Create an account
            </button-root>
          </nuxt-link>
        </div>
      </div>
    </card>
  </div>
</template>
