<template>
  <div class="form-wrapper">
    <q-form
      @submit.prevent.stop="handleSubmit">
      <div class="row text-center justify-around q-gutter-y-lg social-row">
        <q-btn
          :disable="isSubmitting"
          :ripple="false"
          round
          unelevated
          size="sm"
          @click="handleOauthSignin(Provider.Facebook)">
          <q-avatar>
            <img
              src="/images/facebook.png"
              alt="Facebook Login">
          </q-avatar>
        </q-btn>
        <q-btn
          :disable="isSubmitting"
          :ripple="false"
          round
          unelevated
          size="xs"
          @click="handleOauthSignin(Provider.Google)">
          <q-avatar>
            <img
              src="/images/google.png"
              alt="Google Login">
          </q-avatar>
        </q-btn>
        <q-btn
          :disable="isSubmitting"
          :ripple="false"
          round
          unelevated
          @click="handleOauthSignin(Provider.Twitter)">
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
          :rules="emailRules"
          data-cy="login-email-input">
          <template #prepend>
            <q-icon
              size="xs"
              name="bi-envelope" />
          </template>
        </q-input>
        <q-input
          ref="passwordRef"
          v-model="password"
          :disable="isSubmitting"
          outlined
          dense
          aria-required="true"
          type="password"
          label="Password"
          autocomplete="password"
          :rules="passwordRules"
          data-cy="login-password-input">
          <template #prepend>
            <q-icon
              size="xs"
              name="bi-lock" />
          </template>
        </q-input>
        <Alert
          v-if="loginError"
          severity="error"
          message="There was an error logging in.<br> Please try again."
          data-cy="login-error-alert" />
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
        Don't have an account?
        <router-link
          to="/register"
          class="text-body2 text-primary no-underline">
          Signup
        </router-link>
      </p>
      <p class="q-mb-none">
        <router-link
          to="/forgot-password"
          class="text-body2 text-primary no-underline">
          Forgot your password?
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
  import { ref, watchEffect } from 'vue';
  import { Cookies, useQuasar } from 'quasar';
  import { useRouter, useRoute } from 'vue-router';
  import type { Provider as SupabaseProvider } from '@supabase/supabase-js';
  import { event } from 'vue-gtag';
  import { Provider } from '@/generated/types';
  import { buildImageSrc, isValidEmail } from '@/helpers/functions';
  import Alert from '@/components/common/Alert.vue';
  import supabase from '@/lib/supabase';
  import { useUserStore } from '@/stores/user';
  import { encrypt } from '@/helpers/encryption';

  const router = useRouter();
  const route = useRoute();
  const $userStore = useUserStore();
  const $q = useQuasar();

  // Form Functions and State
  const isSubmitting = ref(false);
  const loginError = ref(false);
  const email = ref('');
  const password = ref('');
  const emailRef = ref(null);
  const passwordRef = ref(null);
  const emailRules = [
    (val: string): boolean | string => (val && val.length > 0) || 'Email is required',
    (val: string): boolean | string => isValidEmail(val) || 'Not a valid email',
  ];
  const passwordRules = [
    (val: string): boolean | string => (val && val.length > 0) || 'Password is required',
  ];

  const handleOauthSignin = async (provider: Provider): Promise<void> => {
    isSubmitting.value = true;

    try {
      const supabaseProvider = provider.toLowerCase() as SupabaseProvider;
      const { error } = await supabase.auth.signInWithOAuth({ provider: supabaseProvider });

      if (error) loginError.value = true;

      isSubmitting.value = false;
      event('login', { method: provider, event_category: 'auth' });
    } catch (error) {
      localStorage.removeItem('redirectRoute');
      loginError.value = true;
      isSubmitting.value = false;
    }
  };

  const handleSubmit = async (): Promise<void> => {
    try {
      isSubmitting.value = true;

      const { error } = await supabase.auth.signInWithPassword({ email: email.value, password: password.value });

      if (error) {
        loginError.value = true;
        isSubmitting.value = false;
        return;
      }

      const { data } = await supabase.from('users')
        .select('*')
        .eq('email', email.value)
        .single();

      if (data) {
        const payload = {
          id: data.id,
          email: data.email,
          firstName: data.first_name,
          lastName: data.last_name,
          picture: buildImageSrc(data.image),
        };
        Cookies.set('gc.forum', encrypt(payload), {
          httpOnly: true,
          domain: 'localhost',
        });
      }

      // sign in and redirect to forums
      if (route.query.sso && route.query.sig) {
        const payload = route.query.sso as string;
        const sig = route.query.sig as string;
        const res = await $userStore.loginToForums({ payload, sig });

        window.location.href = res.redirect as string;
      } else {
        event('login', { method: 'email', event_category: 'auth' });
        router.push({ name: 'dashboard' });
      }
    } catch (error) {
      localStorage.removeItem('redirectRoute');
      loginError.value = true;
      isSubmitting.value = false;
    }
  };

  // prevent non-members from accessing the forums
  watchEffect(() => {
    if (route.query?.redirect_reason === 'not_member') {
      $q.dialog({
        title: 'Not a member?',
        message: `
          <p>Forums are currently only accessible by members.</p>
          <p>You can sign up for a free account by logging in and upgrading in your Profile settings.</p>
        `,
        html: true,
      });
    }
  });
</script>
