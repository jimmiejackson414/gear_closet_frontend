<script lang='ts' setup>
  import type { Provider } from '@supabase/supabase-js';
  import { toTypedSchema } from '@vee-validate/zod';
  import { useForm } from 'vee-validate';
  import * as z from 'zod';
  import { Button as FormButton, FormControl, FormField, Input as FormInput, FormItem, FormLabel, Separator, Typography } from '@/components/ui';
  import type { Tables } from '@/types';

  const supabase = useSupabaseClient();
  const $router = useRouter();
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
      const { error } = await supabase.auth.signInWithPassword({...values});

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
    class="max-w-md w-full"
    data-testid="login-form"
    @keydown.enter="onSubmit"
    @submit.prevent="onSubmit">
    <div class="grid grid-cols-[50px,50px] gap-4 justify-center text-center">
      <button
        class="bg-white border border-transparent duration-100 ease-in-out flex justify-center items-center flex-shrink-0 font-semibold gap-2 h-fit p-2 disabled:pointer-events-none rounded-full shadow-md hover:shadow-lg text-sm text-white transition-all w-fit disabled:opacity-50"
        type="button"
        @click="handleOAuthSignin('facebook')">
        <img src="/images/facebook.png">
      </button>
      <button
        class="bg-white border border-transparent duration-100 ease-in-out flex justify-center items-center flex-shrink-0 font-semibold gap-2 h-fit p-2 disabled:pointer-events-none rounded-full shadow-md hover:shadow-lg text-sm text-white transition-all w-fit disabled:opacity-50"
        type="button"
        @click="handleOAuthSignin('google')">
        <img src="/images/google.png">
      </button>
    </div>
    <div clas="flex justify-center">
      <separator
        class="max-w-60 mb-6 mt-8 mx-auto"
        label="OR" />
    </div>
    <div class="auto-rows-auto grid grid-cols-1 gap-4">
      <form-field
        v-slot="{ componentField }"
        name="email"
        :validate-on-blur="!isFieldDirty">
        <form-item>
          <form-label>Email</form-label>
          <form-control>
            <form-input
              :disabled="isSubmitting"
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
          <form-label>Password</form-label>
          <form-control>
            <form-input
              :disabled="isSubmitting"
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
      <form-button
        data-testid="login-submit"
        :disabled="isSubmitting"
        :loading="isSubmitting"
        type="submit">
        Sign In
      </form-button>
    </div>
    <div class="flex items-center flex-col mt-4">
      <typography>
        Don't have an account?
        <nuxt-link
          class="no-underline"
          to="/register">
          <form-button variant="link">
            Signup
          </form-button>
        </nuxt-link>
      </typography>
      <typography class="q-mb-none">
        <nuxt-link
          class="no-underline text-base"
          :to="{ name: 'forgot-password' }">
          <form-button variant="link">
            Forgot your password?
          </form-button>
        </nuxt-link>
      </typography>
      <typography
        class="mt-8 text-center"
        variant="muted">
        By continuing to use GearCloset, you agree to our{{ ' ' }}
        <nuxt-link
          class="no-underline text-primary"
          :to="{ name: 'terms-and-conditions' }">
          Terms and Conditions.
        </nuxt-link>
      </typography>
    </div>
  </form>
</template>
