<script lang='ts' setup>
  import type { Provider } from '@supabase/supabase-js';
  import { toTypedSchema } from '@vee-validate/zod';
  import { useForm } from 'vee-validate';
  import * as z from 'zod';
  import { type Severity } from '@/components/common/GcAlert.vue';
  import { authCallbackUrl } from '@/utils/authRedirect';

  const supabase = useSupabaseClient();
  const submitAction = ref<{message: string, severity: Severity} | undefined>(undefined);

  const formSchema = toTypedSchema(z.object({
    email: z.string()
      .email(),
    password: z.string()
      .min(8),
    passwordConfirm: z.string()
      .min(8),
  })
    .refine(data => data.password === data.passwordConfirm, {
      message: 'Passwords must match',
      path: ['passwordConfirm'],
    }));

  const { isFieldDirty, handleSubmit, isSubmitting, resetForm } = useForm({
    validationSchema: formSchema,
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      const { error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: { emailRedirectTo: authCallbackUrl(window.location.origin) },
      });

      if (error) {
        submitAction.value = { message: error?.message, severity: 'error' };
        return;
      }

      // reset form
      resetForm();

      submitAction.value = {
        message: 'Account created successfully!<br/>Please check your email for next steps.',
        severity: 'positive',
      };
    } catch (error) {
      if (error instanceof Error) {
        submitAction.value = { message: error?.message, severity: 'error' };
      }
    }
  });

  const handleOAuthSignUp = async (provider: Provider) => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: { redirectTo: authCallbackUrl(window.location.origin) },
      });

      if (error) {
        submitAction.value = { message: error?.message, severity: 'error' };
      }
    } catch (error) {
      if (error instanceof Error) {
        submitAction.value = { message: error?.message, severity: 'error' };
      }
    }
  };
</script>

<template>
  <form
    class="w-full max-w-md"
    data-testid="register-form"
    @keydown.enter="onSubmit"
    @submit.prevent.stop="onSubmit">
    <div class="justify-center gap-4 grid grid-cols-[12.5_12.5] text-center">
      <button
        class="flex justify-center items-center gap-2 bg-white disabled:opacity-50 shadow-md hover:shadow-lg p-2 border border-transparent rounded-full w-fit h-fit font-semibold text-white text-sm transition-all duration-100 ease-in-out disabled:pointer-events-none shrink-0"
        type="button"
        @click="handleOAuthSignUp('facebook')">
        <img src="/images/facebook.png">
      </button>
      <button
        class="flex justify-center items-center gap-2 bg-white disabled:opacity-50 shadow-md hover:shadow-lg p-2 border border-transparent rounded-full w-fit h-fit font-semibold text-white text-sm transition-all duration-100 ease-in-out disabled:pointer-events-none shrink-0"
        type="button"
        @click="handleOAuthSignUp('google')">
        <img src="/images/google.png">
      </button>
    </div>
    <div class="flex justify-center">
      <separator
        class="mx-auto mt-8 mb-6 max-w-60"
        force-color-mode="light"
        label="OR" />
    </div>
    <div class="gap-2 grid grid-cols-1 auto-rows-auto">
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
              data-testid="register-email"
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
              data-testid="register-password"
              :disabled="isSubmitting"
              force-color-mode="light"
              password-toggle
              type="password"
              v-bind="componentField" />
          </form-control>
        </form-item>
      </form-field>
      <form-field
        v-slot="{ componentField }"
        name="passwordConfirm"
        :validate-on-blur="!isFieldDirty">
        <form-item>
          <form-label class="text-gray-800">
            Confirm Password
          </form-label>
          <form-control>
            <input-root
              data-testid="register-password-confirm"
              :disabled="isSubmitting"
              force-color-mode="light"
              password-toggle
              type="password"
              v-bind="componentField" />
          </form-control>
        </form-item>
      </form-field>
      <gc-alert
        v-if="submitAction"
        :message="submitAction.message"
        :severity="submitAction.severity" />
      <button-root
        class="mt-4"
        data-testid="register-submit"
        :disabled="isSubmitting"
        :loading="isSubmitting"
        type="submit">
        Create Account
      </button-root>
    </div>
    <div class="flex flex-col items-center mt-4">
      <typography class="text-gray-800">
        Already have an account?
        <nuxt-link
          class="no-underline"
          :to="{ name: 'login' }">
          <button-root variant="link">
            Login
          </button-root>
        </nuxt-link>
      </typography>
      <typography
        class="mt-4 text-center"
        variant="muted">
        By continuing to use GearCloset, you agree to our{{ ' ' }}
        <nuxt-link
          class="text-primary no-underline"
          :to="{ name: 'terms-and-conditions' }">
          Terms and Conditions.
        </nuxt-link>
      </typography>
    </div>
  </form>
</template>
