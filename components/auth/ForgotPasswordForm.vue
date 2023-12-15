<script lang='ts' setup>
  import { ref } from 'vue';
  import supabase from '@/lib/supabase'; 
  import { useValidate } from '@/composables';
  import { isValidEmail } from '@/helpers/functions';
  import GcInput from '@/components/common/GcInput.vue';
  import GcButton from '@/components/common/GcButton.vue';
  import GcAlert, { type Severity } from '@/components/common/GcAlert.vue';

  const form = reactive({ email: '' });
  const submitAction = ref<{message: string, severity: Severity} | undefined>(undefined);
  const submitting = ref(false);

  const rules = {
    email: [
      (val: string): boolean | string => (val && val.length > 0) || 'Email is required',
      (val: string): boolean | string => isValidEmail(val) || 'Not a valid email',
    ],
  };

  const { fieldErrors, validateForm, validateFieldOnBlur } = useValidate(form, rules);

  const handleSubmit = async () => {
    try {
      submitting.value = true;

      if (!validateForm()) {
        return;
      }

      const { error } = await supabase.auth.resetPasswordForEmail(form.email, {
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
    } finally {
      submitting.value = false;
    }
  };
</script>

<template>
  <form @submit.prevent.stop="handleSubmit">
    <div class="auto-rows-auto grid grid-cols-1 gap-4">
      <gc-input
        v-model="form.email"
        :error="fieldErrors.email"
        label="Email"
        name="email"
        placeholder="Enter your email address"
        required
        type="email"
        @blur="validateFieldOnBlur('email')" />
      <gc-alert
        v-if="submitAction"
        class="w-full"
        :message="submitAction.message"
        :severity="submitAction.severity" />
      <gc-button
        class="w-full"
        :disabled="submitting"
        :loading="submitting"
        type="submit">
        Send Reset Link
      </gc-button>
    </div> 
    <div class="flex items-center flex-col mt-4">
      <p class="text-base">
        Remembered your password?
        <router-link
          class="no-underline text-primary"
          :to="{ name: 'login' }">
          Login
        </router-link>
      </p>
    </div>
  </form>
</template>
