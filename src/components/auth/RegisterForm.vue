<template>
  <div class="form-wrapper">
    <q-form
      @submit.prevent.stop="handleSubmit">
      <div class="row text-center justify-around q-gutter-y-lg social-row">
        <q-btn
          :disabled="isSubmitting"
          :ripple="false"
          round
          unelevated
          size="sm"
          @click="handleOauthSignup(Provider.Facebook)">
          <q-avatar>
            <img
              src="/images/facebook.png"
              alt="Facebook Login">
          </q-avatar>
        </q-btn>
        <q-btn
          :disabled="isSubmitting"
          :ripple="false"
          round
          unelevated
          size="xs"
          @click="handleOauthSignup(Provider.Google)">
          <q-avatar>
            <img
              src="/images/google.png"
              alt="Google Login">
          </q-avatar>
        </q-btn>
        <q-btn
          :disabled="isSubmitting"
          :ripple="false"
          round
          unelevated
          @click="handleOauthSignup(Provider.Twitter)">
          <q-avatar>
            <img
              src="/images/twitter.png"
              alt="Twitter Login">
          </q-avatar>
        </q-btn>
      </div>
      <div class="row justify-center">
        <p class="text-overline text-uppercase q-mt-md">
          or
        </p>
      </div>
      <div class="col q-gutter-y-sm">
        <!-- Email -->
        <q-input
          ref="emailRef"
          v-model="email"
          :disable="isSubmitting"
          outlined
          dense
          aria-required="true"
          label="Email"
          type="email"
          :rules="emailRules"
          data-cy="register-email-input">
          <template #prepend>
            <q-icon
              size="xs"
              name="bi-envelope" />
          </template>
        </q-input>
        <!-- First Name -->
        <q-input
          ref="firstNameRef"
          v-model="firstName"
          :disable="isSubmitting"
          outlined
          dense
          aria-required="true"
          label="First Name"
          :rules="nameRules"
          data-cy="register-fname-input">
          <template #prepend>
            <q-icon
              size="xs"
              name="bi-person-circle" />
          </template>
        </q-input>
        <!-- Last Name -->
        <q-input
          ref="lastNameRef"
          v-model="lastName"
          :disable="isSubmitting"
          outlined
          dense
          aria-required="true"
          label="Last Name"
          :rules="nameRules"
          data-cy="register-lname-input">
          <template #prepend>
            <q-icon
              size="xs"
              name="bi-person-circle" />
          </template>
        </q-input>
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
          :rules="passwordRules"
          data-cy="register-password-input">
          <template #prepend>
            <q-icon
              size="xs"
              name="bi-lock" />
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
          :rules="passwordConfirmRules"
          data-cy="register-confirm-password-input">
          <template #prepend>
            <q-icon
              size="xs"
              name="bi-lock" />
          </template>
        </q-input>
        <Alert
          v-if="registerError"
          severity="error"
          :message="errorMessage"
          data-cy="register-error-alert" />
        <div class="row justify-end">
          <q-btn
            class="full-width"
            :loading="isSubmitting"
            :disable="isSubmitting"
            label="Submit"
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
        Already have an account?
        <router-link
          to="/login"
          class="text-body2 text-primary no-underline">
          Signin
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
  import { useRouter } from 'vue-router';
  import supabase from '@/lib/supabase';
  import type { Provider as SupabaseProvider } from '@supabase/supabase-js';
  import { event } from 'vue-gtag';
  import { Provider } from '@/generated/types';
  import { isValidEmail } from '@/helpers/functions';
  import Alert from '@/components/common/Alert.vue';

  const router = useRouter();

  // Form Functions and State
  const isSubmitting = ref(false);
  const registerError = ref(false);
  const errorMessage = ref('There was an error logging in.<br> Please try again.');
  const email = ref('');
  const firstName = ref('');
  const lastName = ref('');
  const password = ref('');
  const passwordConfirm = ref('');
  const emailRef = ref(null);
  const firstNameRef = ref(null);
  const lastNameRef = ref(null);
  const passwordRef = ref(null);
  const passwordConfirmRef = ref(null);
  const emailRules = [
    (val: string): boolean | string => (val && val.length > 0) || 'Email is required',
    (val: string): boolean | string => isValidEmail(val) || 'Not a valid email',
  ];
  const nameRules = [
    (val: string): boolean | string => (val && val.length > 0) || 'Required field',
  ];
  const passwordRules = [
    (val: string): boolean | string => (val && val.length > 0) || 'Password is required',
  ];
  const passwordConfirmRules = [
    (val: string): boolean | string => (val && val.length > 0) || 'Confirm Password is required',
    (val: string): boolean | string => (password.value === val) || 'Must match password',
  ];

  const handleOauthSignup = async (provider: Provider): Promise<void> => {
    isSubmitting.value = true;

    try {
      const supabaseProvider = provider.toLowerCase() as SupabaseProvider;
      const { error } = await supabase.auth.signInWithOAuth({
        provider: supabaseProvider,
        options: {
          redirectTo: `${window.location.origin}/onboarding`,
        },
      });

      if (error) registerError.value = true;

      isSubmitting.value = false;
      event('register', { method: provider, event_category: 'auth' });
    } catch (error) {
      localStorage.removeItem('redirectRoute');
      registerError.value = true;
      isSubmitting.value = false;
    }
  };

  const handleSubmit = async (): Promise<void> => {
    registerError.value = false;
    errorMessage.value = 'There was an error logging in.<br> Please try again.';

    try {
      isSubmitting.value = true;

      const { data: user, error } = await supabase.auth.signUp(
        {
          email: email.value,
          password: password.value,
          options: {
            emailRedirectTo: `${window.location.origin}/onboarding`,
            data: {
              first_name: firstName.value,
              last_name: lastName.value,
            },
          },
        },
      );
      console.log({ error });

      if (error || !user) {
        registerError.value = true;
        isSubmitting.value = false;
        console.log({ error });

        if (error && (error?.status >= 400 || error?.status < 500)) {
          errorMessage.value = error?.message ?? 'There was an error logging in.<br> Please try again.';
        } else {
          errorMessage.value = 'There was an error logging in.<br> Please try again.';
        }

        return;
      }

      event('register', { method: 'email', event_category: 'auth' });
      router.push({ name: 'login', query: { reason: 'confirm_email' } });
    } catch (error) {
      localStorage.removeItem('redirectRoute');
      registerError.value = true;
      isSubmitting.value = false;
    }
  };
</script>
