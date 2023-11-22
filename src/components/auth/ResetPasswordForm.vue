<script lang='ts' setup>
  import { ref } from 'vue';
  import supabase from '@/lib/supabase';
  import { useValidate } from '@/composables';
  import GcInput from '@/components/common/GcInput.vue';
  import GcButton from '@/components/common/GcButton.vue';
  import GcAlert, { type Severity } from '@/components/common/GcAlert.vue';

  const form = reactive({ password: '', passwordConfirm: '' });
  const submitAction = ref<{message: string, severity: Severity} | undefined>(undefined);
  const submitting = ref(false);

  const rules = { 
    password: [
      (val: string) => (val && val.length > 0) || 'Password is required',
    ],
    passwordConfirm: [
      (val: string) => (val && val.length > 0) || 'Confirm Password is required',
      (val: string) => (form.password === val) || 'Must match password',
    ],
  };

  const { fieldErrors, validateForm, validateFieldOnBlur } = useValidate(form, rules);

  const handleSubmit = async () => {
    try {
      submitting.value = true;

      if (!validateForm()) {
        return;
      }

      const { error } = await supabase.auth.updateUser({
        password: form.password,
      });

      if (error) {
        submitAction.value = { message: error.message, severity: 'error' };
        return;
      }

      submitAction.value = {
        message: 'Password updated successfully',
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
        v-model="form.password"
        :error="fieldErrors.password"
        @blur="validateFieldOnBlur('password')"
        type="password"
        label="Password"
        name="password"
        placeholder="Enter your password" />
      <gc-input
        v-model="form.passwordConfirm"
        :error="fieldErrors.passwordConfirm"
        @blur="validateFieldOnBlur('passwordConfirm')"
        type="password"
        name="passwordConfirm"
        label="Confirm Password"
        placeholder="Confirm your password" />
      <gc-alert
        v-if="submitAction"
        :message="submitAction.message"
        :severity="submitAction.severity"
        class="w-full" />
      <gc-button
        :loading="submitting"
        type="submit"
        color="primary"
        class="w-full">
        Reset Password
      </gc-button>
    </div> 
  </form>
</template>
