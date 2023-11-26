<script lang='ts' setup>
  import { ref } from 'vue';
  import supabase from '@/lib/supabase';
  import { AtSignIcon, LockIcon } from 'lucide-vue-next';
  import GcInput from '@/components/common/GcInput.vue';
  import GcButton from '@/components/common/GcButton.vue';
  import GcAlert from '@/components/common/GcAlert.vue';
  import { isValidEmail } from '@/helpers/functions';
  import { useValidate } from '@/composables';
  import type { Provider } from '@supabase/supabase-js';

  const form = reactive({
    email: '',
    password: '',
  });
  const submitting = ref(false);
  const $router = useRouter();
  const loginError = ref<string | undefined>(undefined);

  const rules = {
    email: [
      (val: string): boolean | string => (val && val.length > 0) || 'Email is required',
      (val: string): boolean | string => isValidEmail(val) || 'Not a valid email',
    ],
    password: [
      (val: string) => (val && val.length > 0) || 'Password is required',
    ],
  };

  const { fieldErrors, validateForm, validateFieldOnBlur } = useValidate(form, rules);

  const handleSubmit = async () => {
    try {
      submitting.value = true;

      if (!validateForm()) {
        return;
      }

      const { error } = await supabase.auth.signInWithPassword({...form});

      if (error) {
        loginError.value = error.message;
        return;
      }

      $router.push({ name: 'dashboard' });
    } catch (error) {
      if (error instanceof Error) {
        loginError.value = error.message;
      }
    } finally {
      submitting.value = false;
    }
  };  

  const handleOAuthSignin = async (provider: Provider) => {
    try {
      submitting.value = true;

      const { error } = await supabase.auth.signInWithOAuth({ provider });

      if (error) {
        loginError.value = error.message;
        return;
      }

      $router.push({ name: 'dashboard' });
    } catch (error) {
      if (error instanceof Error) {
        loginError.value = error.message;
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
        @click="handleOAuthSignin('facebook')">
        <img src="/images/facebook.png">
      </button>
      <button
        class="bg-white border border-transparent duration-100 ease-in-out flex justify-center items-center flex-shrink-0 font-semibold gap-2 h-fit p-2 disabled:pointer-events-none rounded-full shadow-md hover:shadow-lg text-sm text-white transition-all w-fit disabled:opacity-50"
        type="button"
        @click="handleOAuthSignin('google')">
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
        placeholder="Email"
        :prepend-icon="AtSignIcon"
        required
        type="email"
        @blur="validateFieldOnBlur('email')" />
      <gc-input
        v-model="form.password"
        autocomplete="current-password"
        :disabled="submitting"
        :error="fieldErrors.password"
        password-toggle
        placeholder="Password"
        :prepend-icon="LockIcon"
        required
        type="password"
        @blur="validateFieldOnBlur('password')" />
      <gc-alert
        v-if="loginError"
        :message="loginError" />
      <gc-button
        :disabled="submitting"
        label="Sign In"
        type="submit" />
    </div>
    <div class="flex items-center flex-col mt-4">
      <p class="text-base">
        Don't have an account?
        <router-link
          class="no-underline text-primary"
          :to="{ name: 'register' }">
          Signup
        </router-link>
      </p>
      <p class="q-mb-none">
        <router-link
          class="no-underline text-base text-primary"
          :to="{ name: 'forgot-password' }">
          Forgot your password?
        </router-link>
      </p>
      <p class="mt-8 text-center text-grey text-xs">
        By continuing to use GearCloset, you agree to our{{ ' ' }}
        <router-link
          class="no-underline text-primary text-xs"
          :to="{ name: 'terms-and-conditions' }">
          Terms and Conditions.
        </router-link>
      </p>
    </div>
  </form>
</template>
