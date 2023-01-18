<template>
  <AuthLayout
    :image="`url(${backgroundImage.image})`"
    :fill="backgroundImage.fill">
    <div class="form-container">
      <div class="box-container">
        <div class="top-container">
          <div class="backdrop" />
          <div class="header-container">
            <LogoIcon
              :width="50"
              fill="#fff"
              wrapper-class="logo" />
            <h4 class="text-h4">
              Welcome
            </h4>
            <h4 class="text-h4">
              Back!
            </h4>
            <p class="text-subtitle1">
              Please sign in to continue
            </p>
          </div>
        </div>
        <div class="inner-container">
          <LoginForm />
        </div>
      </div>
    </div>
  </AuthLayout>
</template>

<script lang='ts' setup>
  import { onMounted, reactive } from 'vue';
  import { useMeta, useQuasar } from 'quasar';
  import type { MetaOptions } from 'quasar/dist/types/meta';
  import { useRoute } from 'vue-router';
  import { fetchImage } from '@/services';
  import supabase from '@/lib/supabase';
  import AuthLayout from '@/layouts/AuthLayout.vue';
  import LogoIcon from '@/components/common/icons/LogoIcon.vue';
  import LoginForm from '@/components/auth/LoginForm.vue';

  const route = useRoute();
  const $q = useQuasar();

  // metadata
  const metaData = {
    title: 'Login | Gear Closet',
  } as MetaOptions;
  useMeta(metaData);

  const backgroundImage = reactive(fetchImage());

  onMounted(() => {
    const reason = route?.query?.reason;
    if (reason === 'confirm_email') {
      $q.dialog({
        title: 'Confirm Your Email',
        message: `
          We'll send an email to the one provided during registration.<br>
          <b>Please allow up to 10 minutes to receive.</b>
          <br>If you still haven't received it, check your Spam folders!
          Click the link in the email to activate your account, and get started with Gear Closet!
        `,
        html: true,
      });
    } else if (reason === 'logout') {
      supabase.auth.signOut();
    }
  });
</script>

<style lang="scss" scoped>
  @import "@/css/auth";
</style>
