<template>
  <div class="form-wrapper">
    <q-form
      @submit.prevent.stop="handleSubmit">
      <div class="col q-gutter-y-sm">
        <!-- Password -->
        <q-input
          ref="passwordRef"
          v-model="password"
          :disable="isSubmitting"
          outlined
          dense
          aria-required="true"
          type="password"
          label="Password"
          :rules="passwordRules">
          <template #prepend>
            <q-icon name="bi-lock" />
          </template>
        </q-input>
        <!-- Password Confirm -->
        <q-input
          ref="passwordConfirmRef"
          v-model="passwordConfirm"
          :disable="isSubmitting"
          outlined
          dense
          aria-required="true"
          type="password"
          label="Confirm Password"
          :rules="passwordConfirmRules">
          <template #prepend>
            <q-icon name="bi-lock" />
          </template>
        </q-input>
        <Alert
          v-if="loginError"
          severity="error"
          message="There was an error sending the reset password email.<br> Please try again." />
        <div class="row justify-end">
          <q-btn
            class="full-width"
            :loading="isSubmitting"
            :disable="isSubmitting"
            label="Update Password"
            type="submit"
            color="primary"
            :ripple="false">
            <template #loading>
              <q-spinner-tail color="white" />
            </template>
          </q-btn>
        </div>
      </div>
    </q-form>
    <div class="row justify-center q-gutter-y-sm q-mt-md">
      <p class="text-body2 q-mb-none">
        Don't have an account?
        <router-link
          to="/register"
          class="text-body2 text-primary no-underline">
          Signup
        </router-link>
      </p>
      <p class="text-grey-5 text-caption text-center q-mb-none q-mt-lg">
        By continuing to use GearCloset, you agree to our{{ ' ' }}
        <router-link
          to="/terms-and-conditions"
          class="text-caption text-primary no-underline">
          Terms and Conditions.
        </router-link>
      </p>
    </div>
  </div>
</template>

<script lang='ts' setup>
  import { ref } from 'vue';
  import { useQuasar } from 'quasar';
  import { useRouter } from 'vue-router';
  import { event } from 'vue-gtag';
  import Alert from '@/components/common/Alert.vue';
  import supabase from '@/lib/supabase';

  const $q = useQuasar();
  const router = useRouter();

  // Form Functions and State
  const isSubmitting = ref(false);
  const loginError = ref(false);
  const password = ref('');
  const passwordConfirm = ref('');
  const passwordRules = [
    (val: string): boolean | string => (val && val.length > 0) || 'Password is required',
  ];
  const passwordConfirmRules = [
    (val: string): boolean | string => (val && val.length > 0) || 'Confirm Password is required',
    (val: string): boolean | string => (password.value === val) || 'Must match password',
  ];

  const handleSubmit = async (): Promise<void> => {
    try {
      isSubmitting.value = true;

      const { error } = await supabase.auth.updateUser({
        password: password.value,
      });

      if (error) {
        loginError.value = true;
        isSubmitting.value = false;
        return;
      }

      isSubmitting.value = false;
      event('reset-password', {
        event_category: 'auth',
        event_label: 'reset-password',
      });

      $q.dialog({
        title: 'Password updated',
        message: 'Your password has now been updated! You will be redirected to login with your new credentials.',
      })
        .onOk(() => router.push('/login'));
    } catch (error) {
      loginError.value = true;
      isSubmitting.value = false;
    }
  };
</script>
