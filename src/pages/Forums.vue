<template>
  <LoadingPage class="loading-forums">
    <h5 class="text-h5 q-my-none">
      Logging in to the forums.
    </h5>
    <p class="body1">
      Please wait.
    </p>
  </LoadingPage>
</template>

<script lang='ts' setup>
  import { onMounted } from 'vue';
  import { useRoute } from 'vue-router';
  import { useQuasar } from 'quasar';
  import { useUserStore } from '@/stores/user';
  import LoadingPage from '@/components/common/LoadingPage.vue';

  const route = useRoute();
  const userStore = useUserStore();
  const $q = useQuasar();

  // eslint-disable-next-line consistent-return
  onMounted(async () => {
    // handle if user is signing in to forums via SSO
    const payload = route.query.sso as string;
    const sig = route.query.sig as string;

    if (payload && sig) {
      const res = await userStore.loginToForums({ payload, sig });

      if (res.errors) {
        return $q.dialog({
          title: 'Error',
          message: 'An error occurred logging in to the forums.</br> Please try again or reach out to our support team.',
          html: true,
        });
      }

      window.location.href = res.redirect as string;
    }
  });
</script>

<style lang="scss" scoped>
  .loading-forums {
    align-items: center;
    display: flex;
    flex-direction: column;
    justify-content: center;

    h5 {
      margin-bottom: 0;
    }
  }
</style>
