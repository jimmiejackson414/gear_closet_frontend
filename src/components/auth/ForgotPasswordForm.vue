<template>
  <div class="form-wrapper">
    <q-form
      @submit.prevent.stop="handleSubmit">
      <div class="col q-gutter-y-sm">
        <q-input
          ref="emailRef"
          v-model="email"
          :disable="isSubmitting"
          outlined
          dense
          aria-required="true"
          label="Email"
          type="email"
          autocomplete="email"
          :rules="emailRules">
          <template #prepend>
            <q-icon name="bi-envelope" />
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
            label="Send"
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
  import { isValidEmail } from '@/helpers/functions';
  import Alert from '@/components/common/Alert.vue';
  import supabase from '@/lib/supabase';

  const $q = useQuasar();
  const router = useRouter();

  // Form Functions and State
  const isSubmitting = ref(false);
  const loginError = ref(false);
  const email = ref('');
  const emailRef = ref(null);
  const emailRules = [
    (val: string): boolean | string => (val && val.length > 0) || 'Email is required',
    (val: string): boolean | string => isValidEmail(val) || 'Not a valid email',
  ];

  const handleSubmit = async (): Promise<void> => {
    try {
      isSubmitting.value = true;

      const { error } = await supabase.auth.resetPasswordForEmail(email.value, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        loginError.value = true;
        isSubmitting.value = false;
        return;
      }

      $q.dialog({
        title: 'Email Sent',
        message: `An email has been sent to ${email.value} with instructions to reset your password.`,
      })
        .onOk(() => router.push('/login'));

      isSubmitting.value = false;
    } catch (error) {
      loginError.value = true;
      isSubmitting.value = false;
    }
  };
</script>
