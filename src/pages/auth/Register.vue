<template>
  <AuthLayout
    :image="`url(${backgroundImage.image}`"
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
              Create an
            </h4>
            <h4 class="text-h4">
              Account
            </h4>
            <p class="text-subtitle1">
              Please sign up to continue
            </p>
          </div>
        </div>
        <div class="inner-container">
          <RegisterForm />
        </div>
      </div>
    </div>
  </AuthLayout>
</template>

<script lang='ts' setup>
  import { reactive } from 'vue';
  import { useMeta } from 'quasar';
  import { fetchImage } from '@/services';
  import AuthLayout from '@/layouts/AuthLayout.vue';
  import LogoIcon from '@/components/common/icons/LogoIcon.vue';
  import RegisterForm from '@/components/auth/RegisterForm.vue';

  const metaData = {
    title: 'Register | Gear Closet',
  };
  useMeta(metaData);

  const backgroundImage = reactive(fetchImage());

</script>

<style lang="scss" scoped>
  @import "@/css/auth";
</style>
