<script lang='ts' setup>
  import { toTypedSchema } from '@vee-validate/zod';
  import { useForm } from 'vee-validate';
  import * as z from 'zod';
  import { type Severity } from '@/components/common/GcAlert.vue';

  const supabase = useSupabaseClient();
  const submitAction = ref<undefined | {message: string, severity: Severity}>(undefined);

  const formSchema = toTypedSchema(z.object({
    email: z.string()
      .email(),
  }));

  const { handleSubmit, isFieldDirty, isSubmitting } = useForm({
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
    class="w-full max-w-md"
    @keydown.enter="onSubmit"
    @submit.prevent="onSubmit">
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
      <gc-alert
        v-if="submitAction"
        class="w-full"
        :message="submitAction.message"
        :severity="submitAction.severity" />
      <button-root
        class="w-full"
        :disabled="isSubmitting"
        :loading="isSubmitting"
        type="submit">
        Send Reset Link
      </button-root>
    </div>
    <div class="mt-4 flex flex-col items-center">
      <typography class="text-gray-800">
        Remembered your password?
        <nuxt-link
          class="text-primary no-underline"
          :to="{ name: 'login' }">
          <button-root variant="link">
            Login
          </button-root>
        </nuxt-link>
      </typography>
    </div>
  </form>
</template>
