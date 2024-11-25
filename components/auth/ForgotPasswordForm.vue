<script lang='ts' setup>
  import { toTypedSchema } from '@vee-validate/zod';
  import { useForm } from 'vee-validate';
  import * as z from 'zod';
  import { type Severity } from '@/components/common/GcAlert.vue';
  import { Button as FormButton, FormControl, FormField, FormInput, FormItem, FormLabel, Typography } from '@/components/ui';

  const supabase = useSupabaseClient();
  const submitAction = ref<{message: string, severity: Severity} | undefined>(undefined);

  const formSchema = toTypedSchema(z.object({
    email: z.string()
      .email(),
  }));

  const { isFieldDirty, handleSubmit, isSubmitting } = useForm({
    validationSchema: formSchema,
  });

  const onSubmit = handleSubmit(async ({ email }) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        submitAction.value = { message: error.message, severity: 'error' };
        return;
      }

      submitAction.value = {
        message: 'Please check your email for a password reset link',
        severity: 'positive',
      };
    } catch (error) {
      if (error instanceof Error) {
        submitAction.value = { message: error.message, severity: 'error' };
      }
    }
  });
</script>

<template>
  <form
    class="max-w-md w-full"
    @keydown.enter="onSubmit"
    @submit.prevent="onSubmit">
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
      <gc-alert
        v-if="submitAction"
        class="w-full"
        :message="submitAction.message"
        :severity="submitAction.severity" />
      <form-button
        class="w-full"
        :disabled="isSubmitting"
        :loading="isSubmitting"
        type="submit">
        Send Reset Link
      </form-button>
    </div>
    <div class="flex items-center flex-col mt-4">
      <typography>
        Remembered your password?
        <nuxt-link
          class="no-underline text-primary"
          :to="{ name: 'login' }">
          <form-button variant="link">
            Login
          </form-button>
        </nuxt-link>
      </typography>
    </div>
  </form>
</template>
