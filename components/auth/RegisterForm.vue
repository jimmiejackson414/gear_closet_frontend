<script lang='ts' setup>
  import { isValidEmail } from '@/helpers/functions';
  import { type Severity} from '@/components/common/GcAlert.vue';
  import type { Provider } from '@supabase/supabase-js';

  const supabase = useSupabaseClient();
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
        $router.push({ name: 'index' });
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
        class="bg-white border border-transparent duration-100 ease-in-out flex justify-center items-center flex-shrink-0 font-semibold gap-2 h-fit p-2 disabled:pointer-events-none rounded-full shadow-md hover:shadow-lg text-sm text-white transition-all w-fit disabled:opacity-50"
        type="button"
        @click="handleOAuthSignUp('facebook')">
        <img src="/images/facebook.png">
      </button>
      <button
        class="bg-white border border-transparent duration-100 ease-in-out flex justify-center items-center flex-shrink-0 font-semibold gap-2 h-fit p-2 disabled:pointer-events-none rounded-full shadow-md hover:shadow-lg text-sm text-white transition-all w-fit disabled:opacity-50"
        type="button"
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
        :disabled="submitting"
        :error="fieldErrors.email"
        label="Email"
        name="email"
        placeholder="Email"
        required
        @blur="validateFieldOnBlur('email')" />
      <gc-input
        v-model="form.firstName"
        autocomplete="given-name"
        :disabled="submitting"
        :error="fieldErrors.firstName"
        label="First Name"
        name="firstName"
        placeholder="Tom"
        required
        @blur="validateFieldOnBlur('firstName')" />
      <gc-input
        v-model="form.lastName"
        autocomplete="family-name"
        :disabled="submitting"
        :error="fieldErrors.lastName"
        label="Last Name"
        name="lastName"
        placeholder="Jones"
        required
        @blur="validateFieldOnBlur('lastName')" />
      <gc-input
        v-model="form.password"
        autocomplete="current-password"
        :disabled="submitting"
        :error="fieldErrors.password"
        label="Password"
        name="password"
        password-toggle
        placeholder="Password"
        required
        type="password"
        @blur="validateFieldOnBlur('password')" />
      <gc-input
        v-model="form.passwordConfirm"
        autocomplete="confirm-password"
        :disabled="submitting"
        :error="fieldErrors.passwordConfirm"
        label="Confirm Password"
        name="passwordConfirm"
        password-toggle
        placeholder="Confirm password"
        required
        type="password"
        @blur="validateFieldOnBlur('passwordConfirm')" />
      <gc-alert
        v-if="submitAction"
        :message="submitAction.message"
        :severity="submitAction.severity" />
      <gc-button
        :disabled="submitting"
        label="Create Account"
        type="submit" />
    </div>
    <div class="flex items-center flex-col mt-4">
      <p class="text-base">
        Already have an account?
        <nuxt-link
          class="no-underline text-primary"
          :to="{ name: 'login' }">
          Login
        </nuxt-link>
      </p>
      <p class="mt-8 text-center text-grey text-xs">
        By continuing to use GearCloset, you agree to our{{ ' ' }}
        <nuxt-link
          class="no-underline text-primary text-xs"
          :to="{ name: 'terms-and-conditions' }">
          Terms and Conditions.
        </nuxt-link>
      </p>
    </div>
  </form>
</template>
