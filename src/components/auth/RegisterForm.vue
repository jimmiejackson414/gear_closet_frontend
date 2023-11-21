<script lang='ts' setup>
  import { ref } from 'vue';
  import supabase from '@/lib/supabase';
  import GcInput from '@/components/common/GcInput.vue';
  import GcButton from '@/components/common/GcButton.vue';
  import Alert from '@/components/common/Alert.vue';
  import type { Provider } from '@supabase/supabase-js';

  const $router = useRouter();
  const submitting = ref(false);
  const submitError = ref(false);
  const form = reactive({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    passwordConfirm: '',
  });

  const handleSubmit = async () => {
    try {
      submitting.value = true;
      const { data, error } = await supabase.auth.signUp({
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

      if (error || !data) {
        submitError.value = true;
        return;
      }

      $router.push({ name: 'login' });
    } catch (error) {
      if (error instanceof Error) {
        submitError.value = true;
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
        submitError.value = true;
        return;
      }

      $router.push({ name: 'dashboard' });
    } catch (error) {
      if (error instanceof Error) {
        submitError.value = true;
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
        <img src="/images/facebook.png" />
      </button>
      <button
        type="button"
        class="bg-white border border-transparent duration-100 ease-in-out flex justify-center items-center flex-shrink-0 font-semibold gap-2 h-fit p-2 disabled:pointer-events-none rounded-full shadow-md hover:shadow-lg text-sm text-white transition-all w-fit disabled:opacity-50"
        @click="handleOAuthSignUp('google')">
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
        v-model="form.firstName"
        autocomplete="given-name"
        label="First Name"
        placeholder="Tom"
        :disabled="submitting"
        required />
      <gc-input
        v-model="form.lastName"
        autocomplete="family-name"
        label="Last Name"
        placeholder="Jones"
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
      <gc-input
        v-model="form.passwordConfirm"
        autocomplete="confirm-password"
        label="Confirm Password"
        placeholder="Confirm password"
        :disabled="submitting"
        type="password"
        required />
      <Alert
        v-if="submitError"
        message="There was an error logging in.<br> Please try again." />
      <gc-button
        label="Sign In"
        type="submit"
        :disabled="submitting" />
    </div>
    <div class="flex items-center flex-col mt-4">
      <p class="text-base">
        Already have an account?
        <router-link
          :to="{ name: 'login' }"
          class="no-underline text-primary">
          Signin
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
