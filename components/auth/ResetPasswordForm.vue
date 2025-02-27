<script lang='ts' setup>
  import { toTypedSchema } from '@vee-validate/zod';
  import { useForm } from 'vee-validate';
  import * as z from 'zod';
  import type { Severity } from '@/components/common/GcAlert.vue';

  const supabase = useSupabaseClient();
  const submitAction = ref<undefined | {message: string, severity: Severity}>(undefined);

  const formSchema = toTypedSchema(z.object({
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

  const onSubmit = handleSubmit(async ({ password }) => {
    try {
      const { error } = await supabase.auth.updateUser({ password });

      if (error) {
        submitAction.value = { message: error.message, severity: 'error' };
        return;
      }

      submitAction.value = {
        message: 'Password updated successfully',
        severity: 'positive',
      };

      resetForm();
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
        name="password"
        :validate-on-blur="!isFieldDirty">
        <form-item>
          <form-label class="text-gray-800">
            New Password
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
      <form-field
        v-slot="{ componentField }"
        name="passwordConfirm"
        :validate-on-blur="!isFieldDirty">
        <form-item>
          <form-label class="text-gray-800">
            Confirm New Password
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
        v-if="submitAction"
        class="w-full"
        :message="submitAction.message"
        :severity="submitAction.severity" />
      <button-root
        :disabled="isSubmitting"
        :loading="isSubmitting"
        type="submit">
        Reset Password
      </button-root>
    </div>
  </form>
</template>
