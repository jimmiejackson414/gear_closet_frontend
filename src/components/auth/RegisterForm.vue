<script lang='ts' setup>
  import { ref } from 'vue';
  import { useValidate } from '@/composables';
  import { isValidEmail } from '@/helpers/functions';
  import supabase from '@/lib/supabase';
  import GcInput from '@/components/common/GcInput.vue';
  import GcButton from '@/components/common/GcButton.vue';
  import GcAlert, { type Severity} from '@/components/common/GcAlert.vue';
  import type { Provider } from '@supabase/supabase-js';

  const $router = useRouter();
  const submitting = ref(false);
  const submitAction = ref<{message: string, severity: Severity} | undefined>(undefined);
  const form = reactive({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    passwordConfirm: '',
  });

  const rules = {
    email: [
      (val: string): boolean | string => (val && val.length > 0) || 'Email is required',
      (val: string): boolean | string => isValidEmail(val) || 'Not a valid email',
    ],
    firstName: [
      (val: string) => (val && val.length > 0) || 'First Name is required',
    ],
    lastName: [
      (val: string) => (val && val.length > 0) || 'Last Name is required',
    ],
    password: [
      (val: string) => (val && val.length > 0) || 'Password is required',
    ],
    passwordConfirm: [
      (val: string) => (val && val.length > 0) || 'Confirm Password is required',
      (val: string) => (form.password === val) || 'Must match password',
    ],
  };

  const { fieldErrors, validateForm, validateFieldOnBlur } = useValidate(form, rules);

  const resetForm = () => {
    form.firstName = '';
    form.lastName = '';
    form.email = '';
    form.password = '';
    form.passwordConfirm = '';
  };

  const handleSubmit = async () => {
    try {
      submitting.value = true;

      if (!validateForm()) {
        return;
      }

      const { error } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          data: {
            first_name: form.firstName,
            last_name: form.lastName,
          },
          emailRedirectTo: `${window.location.origin}/onboarding`,
        },
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
    } finally {
      submitting.value = false;
    }
  };

  const handleOAuthSignUp = async (provider: Provider) => {
    try {
      submitting.value = true;

      const { error } = await supabase.auth.signInWithOAuth({ provider, options: { redirectTo: `${window.location.origin}/onboarding` } });

      if (error) {
        submitAction.value = { message: error?.message, severity: 'error' };
        return;
      }

      submitAction.value = { message: 'Account created successfully!', severity: 'positive' };
      setTimeout(() => {
        $router.push({ name: 'dashboard' });
      }, 1500);
    } catch (error) {
      if (error instanceof Error) {
        submitAction.value = { message: error?.message, severity: 'error' };
      }
    } finally {
      submitting.value = false;
    }
  };
</script>

<template>
  <form @submit.prevent.stop="handleSubmit">
    <div class="grid grid-cols-[50px,50px] gap-4 justify-center text-center">
      <button
        type="button"
        class="bg-white border border-transparent duration-100 ease-in-out flex justify-center items-center flex-shrink-0 font-semibold gap-2 h-fit p-2 disabled:pointer-events-none rounded-full shadow-md hover:shadow-lg text-sm text-white transition-all w-fit disabled:opacity-50"
        @click="handleOAuthSignUp('facebook')">
        <img src="/images/facebook.png">
      </button>
      <button
        type="button"
        class="bg-white border border-transparent duration-100 ease-in-out flex justify-center items-center flex-shrink-0 font-semibold gap-2 h-fit p-2 disabled:pointer-events-none rounded-full shadow-md hover:shadow-lg text-sm text-white transition-all w-fit disabled:opacity-50"
        @click="handleOAuthSignUp('google')">
        <img src="/images/google.png">
      </button>
    </div> 
    <div clas="flex justify-center">
      <p class="my-4 text-center text-eyebrow uppercase">
        or
      </p>
    </div>
    <div class="auto-rows-auto grid grid-cols-1 gap-4">
      <gc-input
        v-model="form.email"
        autocomplete="email"
        label="Email"
        placeholder="Email"
        name="email"
        :disabled="submitting"
        :error="fieldErrors.email"
        required
        @blur="validateFieldOnBlur('email')" />
      <gc-input
        v-model="form.firstName"
        autocomplete="given-name"
        label="First Name"
        placeholder="Tom"
        name="firstName"
        :disabled="submitting"
        :error="fieldErrors.firstName"
        required
        @blur="validateFieldOnBlur('firstName')" />
      <gc-input
        v-model="form.lastName"
        autocomplete="family-name"
        label="Last Name"
        placeholder="Jones"
        name="lastName"
        :disabled="submitting"
        :error="fieldErrors.lastName"
        required
        @blur="validateFieldOnBlur('lastName')" />
      <gc-input
        v-model="form.password"
        autocomplete="current-password"
        label="Password"
        placeholder="Password"
        :disabled="submitting"
        :error="fieldErrors.password"
        name="password"
        type="password"
        password-toggle
        required
        @blur="validateFieldOnBlur('password')" />
      <gc-input
        v-model="form.passwordConfirm"
        autocomplete="confirm-password"
        label="Confirm Password"
        placeholder="Confirm password"
        name="passwordConfirm"
        :disabled="submitting"
        :error="fieldErrors.passwordConfirm"
        type="password"
        password-toggle
        required
        @blur="validateFieldOnBlur('passwordConfirm')" />
      <gc-alert
        v-if="submitAction"
        :severity="submitAction.severity"
        :message="submitAction.message" />
      <gc-button
        label="Create Account"
        type="submit"
        :disabled="submitting" />
    </div>
    <div class="flex items-center flex-col mt-4">
      <p class="text-base">
        Already have an account?
        <router-link
          :to="{ name: 'login' }"
          class="no-underline text-primary">
          Login
        </router-link>
      </p>
      <p class="mt-8 text-center text-grey text-xs">
        By continuing to use GearCloset, you agree to our{{ ' ' }}
        <router-link
          :to="{ name: 'terms-and-conditions' }"
          class="no-underline text-primary text-xs">
          Terms and Conditions.
        </router-link>
      </p>
    </div>
  </form>
</template>
