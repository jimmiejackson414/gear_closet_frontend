<script lang='ts' setup>
  import { ref } from 'vue';
  import supabase from '@/lib/supabase';
  import GcInput from '@/components/common/GcInput.vue';
  import GcButton from '@/components/common/GcButton.vue';
  import Alert from '@/components/common/Alert.vue';
  import type { Provider } from '@supabase/supabase-js';

  const form = reactive({
    email: '',
    password: '',
  });
  const submitting = ref(false);
  const $router = useRouter();
  const loginError = ref(false);

  const handleSubmit = async () => {
    try {
      submitting.value = true;
      const { error } = await supabase.auth.signInWithPassword({...form});

      if (error) {
        loginError.value = true;
        return;
      }

      $router.push({ name: 'dashboard' });
    } catch (error) {
      if (error instanceof Error) {
        loginError.value = true;
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
        loginError.value = true;
        return;
      }

      $router.push({ name: 'dashboard' });
    } catch (error) {
      if (error instanceof Error) {
        loginError.value = true;
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
        @click="handleOAuthSignin('facebook')">
        <img src="/images/facebook.png" />
      </button>
      <button
        type="button"
        class="bg-white border border-transparent duration-100 ease-in-out flex justify-center items-center flex-shrink-0 font-semibold gap-2 h-fit p-2 disabled:pointer-events-none rounded-full shadow-md hover:shadow-lg text-sm text-white transition-all w-fit disabled:opacity-50"
        @click="handleOAuthSignin('google')">
        <img src="/images/google.png" />
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
        :disabled="submitting"
        required />
      <gc-input
        v-model="form.password"
        autocomplete="current-password"
        label="Password"
        placeholder="Password"
        :disabled="submitting"
        type="password"
        required />
      <Alert
        v-if="loginError"
        message="There was an error logging in.<br> Please try again." />
      <gc-button
        label="Sign In"
        type="submit"
        :disabled="submitting" />
    </div>
    <div class="flex items-center flex-col mt-4">
      <p class="text-base">
        Don't have an account?
        <router-link
          :to="{ name: 'register' }"
          class="no-underline text-primary">
          Signup
        </router-link>
      </p>
      <p class="q-mb-none">
        <router-link
          :to="{ name: 'forgot-password' }"
          class="no-underline text-base text-primary">
          Forgot your password?
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
