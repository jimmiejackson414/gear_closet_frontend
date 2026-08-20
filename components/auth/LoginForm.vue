<script lang='ts' setup>
  import { toTypedSchema } from '@vee-validate/zod';
  import { useForm } from 'vee-validate';
  import * as z from 'zod';
  import { authCallbackUrl, destinationAfterAuth } from '@/utils/authRedirect';
  import type { ProfileLayoutResponse } from '@/types/helpers';
  import type { Provider } from '@supabase/supabase-js';

  const supabase = useSupabaseClient();
  const redirectInfo = useSupabaseCookieRedirect();
  const loginError = ref<string | undefined>(undefined);

  const formSchema = toTypedSchema(z.object({
    email: z.string()
      .email(),
    password: z.string()
      .min(8),
  }));

  const { isFieldDirty, handleSubmit, isSubmitting } = useForm({
    validationSchema: formSchema,
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ ...values });

      if (error) {
        loginError.value = error.message;
        return;
      }

      const profile = await $fetch<ProfileLayoutResponse | null>('/api/profile', {
        headers: useRequestHeaders(['cookie']),
      });

      const dest = destinationAfterAuth({
        onboardDate: profile?.onboard_date,
        savedPath: redirectInfo.path.value,
      });
      if (dest.consumeSavedPath) {
        redirectInfo.pluck();
      }
      await navigateTo(dest.path);
    } catch (error) {
      if (error instanceof Error) {
        loginError.value = error.message;
      }
    }
  });

  const handleOAuthSignin = async (provider: Provider) => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: { redirectTo: authCallbackUrl(window.location.origin) },
      });

      if (error) {
        loginError.value = error.message;
      }
    } catch (error) {
      if (error instanceof Error) {
        loginError.value = error.message;
      }
    }
  };
</script>

<template>
  <form
    class="w-full max-w-md"
    data-testid="login-form"
    @keydown.enter="onSubmit"
    @submit.prevent="onSubmit">
    <div class="justify-center gap-4 grid grid-cols-[12.5_12.5] text-center">
      <button
        class="flex justify-center items-center gap-2 bg-white disabled:opacity-50 shadow-md hover:shadow-lg p-2 border border-transparent rounded-full w-fit h-fit font-semibold text-white text-sm transition-all duration-100 ease-in-out disabled:pointer-events-none shrink-0"
        type="button"
        @click="handleOAuthSignin('facebook')">
        <img src="/images/facebook.png">
      </button>
      <button
        class="flex justify-center items-center gap-2 bg-white disabled:opacity-50 shadow-md hover:shadow-lg p-2 border border-transparent rounded-full w-fit h-fit font-semibold text-white text-sm transition-all duration-100 ease-in-out disabled:pointer-events-none shrink-0"
        type="button"
        @click="handleOAuthSignin('google')">
        <img src="/images/google.png">
      </button>
    </div>
    <div class="flex justify-center">
      <separator
        class="mx-auto mt-8 mb-6 max-w-60"
        force-color-mode="light"
        label="OR" />
    </div>
    <div class="gap-4 grid grid-cols-1 auto-rows-auto">
      <form-field
        v-slot="{ componentField }"
        name="email"
        :validate-on-blur="!isFieldDirty">
        <form-item>
          <form-label class="text-gray-800">
            Email
          </form-label>
          <form-control>
            <input-root
              data-testid="login-email"
              :disabled="isSubmitting"
              force-color-mode="light"
              type="email"
              v-bind="componentField" />
          </form-control>
        </form-item>
      </form-field>
      <form-field
        v-slot="{ componentField }"
        name="password"
        :validate-on-blur="!isFieldDirty">
        <form-item>
          <form-label class="text-gray-800">
            Password
          </form-label>
          <form-control>
            <input-root
              data-testid="login-password"
              :disabled="isSubmitting"
              force-color-mode="light"
              password-toggle
              type="password"
              v-bind="componentField" />
          </form-control>
        </form-item>
      </form-field>
      <gc-alert
        v-if="loginError"
        data-testid="login-error"
        :message="loginError" />
      <button-root
        data-testid="login-submit"
        :disabled="isSubmitting"
        :loading="isSubmitting"
        type="submit">
        Sign In
      </button-root>
    </div>
    <div class="flex flex-col items-center mt-4">
      <typography class="text-gray-800">
        Don't have an account?
        <nuxt-link
          class="no-underline"
          to="/register">
          <button-root variant="link">
            Signup
          </button-root>
        </nuxt-link>
      </typography>
      <typography class="mb-0">
        <nuxt-link
          class="text-base no-underline"
          :to="{ name: 'forgot-password' }">
          <button-root variant="link">
            Forgot your password?
          </button-root>
        </nuxt-link>
      </typography>
      <typography
        class="mx-auto mt-8 lg:max-w-xs text-center"
        variant="muted">
        By continuing to use GearCloset, you agree to our{{ ' ' }}
        <nuxt-link
          class="text-hyperlink text-sm"
          :to="{ name: 'terms-and-conditions' }">
          Terms and Conditions.
        </nuxt-link>
      </typography>
    </div>
  </form>
</template>
