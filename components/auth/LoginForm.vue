<script lang='ts' setup>
  import { toTypedSchema } from '@vee-validate/zod';
  import { useForm } from 'vee-validate';
  import * as z from 'zod';
  import type { Tables } from '@/types';
  import type { Provider } from '@supabase/supabase-js';

  const supabase = useSupabaseClient();
  const $router = useRouter();
  const loginError = ref<string | undefined>(undefined);

  const formSchema = toTypedSchema(z.object({
    email: z.string()
      .email(),
    password: z.string()
      .min(8),
  }));

  const { handleSubmit, isFieldDirty, isSubmitting } = useForm({
    validationSchema: formSchema,
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ ...values });

      if (error) {
        loginError.value = error.message;
        return;
      }

      // Fetch the user's profile
      const profile = await $fetch<Tables<'profiles'> | null>('/api/profile', {
        headers: useRequestHeaders(['cookie']),
      });

      // If the user has not completed onboarding, redirect them to the onboarding page
      if (profile && !profile.onboard_date) {
        $router.push('/onboarding');
      } else {
        $router.push({ name: 'index' });
      }
    } catch (error) {
      if (error instanceof Error) {
        loginError.value = error.message;
      }
    }
  });

  const handleOAuthSignin = async (provider: Provider) => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({ provider });

      if (error) {
        loginError.value = error.message;
        return;
      }

      $router.push({ name: 'index' });
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
    <div class="grid grid-cols-[50px,50px] justify-center gap-4 text-center">
      <button
        class="flex size-fit shrink-0 items-center justify-center gap-2 rounded-full border border-transparent bg-white p-2 text-sm font-semibold text-white shadow-md transition-all duration-100 ease-in-out hover:shadow-lg disabled:pointer-events-none disabled:opacity-50"
        type="button"
        @click="handleOAuthSignin('facebook')">
        <img src="/images/facebook.png">
      </button>
      <button
        class="flex size-fit shrink-0 items-center justify-center gap-2 rounded-full border border-transparent bg-white p-2 text-sm font-semibold text-white shadow-md transition-all duration-100 ease-in-out hover:shadow-lg disabled:pointer-events-none disabled:opacity-50"
        type="button"
        @click="handleOAuthSignin('google')">
        <img src="/images/google.png">
      </button>
    </div>
    <div clas="flex justify-center">
      <separator
        class="mx-auto mb-6 mt-8 max-w-60"
        force-color-mode="light"
        label="OR" />
    </div>
    <div class="grid auto-rows-auto grid-cols-1 gap-4">
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
    <div class="mt-4 flex flex-col items-center">
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
        class="mx-auto mt-8 text-center lg:max-w-xs"
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
