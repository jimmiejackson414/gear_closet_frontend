<script lang='ts' setup>
  import { ref } from 'vue';
  import { type Severity } from '@/components/common/GcAlert.vue';

  const supabase = useSupabaseClient();
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
        class="w-full"
        :error="fieldErrors.password"
        label="Password"
        name="password"
        placeholder="Enter your password"
        type="password"
        @blur="validateFieldOnBlur('password')" />
      <gc-input
        v-model="form.passwordConfirm"
        class="w-full"
        :error="fieldErrors.passwordConfirm"
        label="Confirm Password"
        name="passwordConfirm"
        placeholder="Confirm your password"
        type="password"
        @blur="validateFieldOnBlur('passwordConfirm')" />
      <gc-alert
        v-if="submitAction"
        class="w-full"
        :message="submitAction.message"
        :severity="submitAction.severity" />
      <gc-button
        class="w-full"
        color="primary"
        :loading="submitting"
        type="submit">
        Reset Password
      </gc-button>
    </div>
  </form>
</template>
