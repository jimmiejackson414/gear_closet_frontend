<script lang='ts' setup>
  import { toTypedSchema } from '@vee-validate/zod';
  import { useForm } from 'vee-validate';
  import * as z from 'zod';
  import type { Severity } from '@/components/common/GcAlert.vue';
  import type { Provider } from '@supabase/supabase-js';

  const supabase = useSupabaseClient();
  const $router = useRouter();
  const submitAction = ref<undefined | {message: string, severity: Severity}>(undefined);

  const formSchema = toTypedSchema(z.object({
    email: z.string()
      .email(),
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

  const onSubmit = handleSubmit(async (values) => {
    try {
      const { error } = await supabase.auth.signUp({
        email: values.email,
        options: { emailRedirectTo: `${window.location.origin}/onboarding` },
        password: values.password,
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
    }
  });

  const handleOAuthSignUp = async (provider: Provider) => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({ options: { redirectTo: `${window.location.origin}/onboarding` }, provider });

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
    }
  };
</script>

<template>
  <form
    class="max-w-md w-full"
    data-testid="register-form"
    @keydown.enter="onSubmit"
    @submit.prevent.stop="onSubmit">
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
      <separator
        class="max-w-60 mb-6 mt-8 mx-auto"
        force-color-mode="light"
        label="OR" />
    </div>
    <div class="auto-rows-auto grid grid-cols-1 gap-2">
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
      <form-field
        v-slot="{ componentField }"
        name="password"
        :validate-on-blur="!isFieldDirty">
        <form-item>
          <form-label class="text-gray-800">
            Password
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
            Confirm Password
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
        :message="submitAction.message"
        :severity="submitAction.severity" />
      <button-root
        class="mt-4"
        :disabled="isSubmitting"
        :loading="isSubmitting"
        type="submit">
        Create Account
      </button-root>
    </div>
    <div class="flex items-center flex-col mt-4">
      <typography class="text-gray-800">
        Already have an account?
        <nuxt-link
          class="no-underline"
          :to="{ name: 'login' }">
          <button-root variant="link">
            Login
          </button-root>
        </nuxt-link>
      </typography>
      <typography
        class="mt-4 text-center"
        variant="muted">
        By continuing to use GearCloset, you agree to our{{ ' ' }}
        <nuxt-link
          class="no-underline text-primary"
          :to="{ name: 'terms-and-conditions' }">
          Terms and Conditions.
        </nuxt-link>
      </typography>
    </div>
  </form>
</template>
