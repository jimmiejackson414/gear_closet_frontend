<script lang='ts' setup>
  import { toTypedSchema } from '@vee-validate/zod';
  import { useForm } from 'vee-validate';
  import * as z from 'zod';
  import { type Severity } from '@/components/common/GcAlert.vue';
  import { authCallbackUrl } from '@/utils/authRedirect';
  import type { Provider } from '@supabase/supabase-js';

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

  const { handleSubmit, isFieldDirty, isSubmitting, resetForm } = useForm({
    validationSchema: formSchema,
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      const { error } = await supabase.auth.signUp({
        email: values.email,
        options: { emailRedirectTo: authCallbackUrl(window.location.origin) },
        password: values.password,
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
        options: { redirectTo: authCallbackUrl(window.location.origin) },
        provider,
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
    <social-login-buttons @select="handleOAuthSignUp" />
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
