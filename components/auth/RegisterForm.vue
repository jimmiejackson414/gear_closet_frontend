<script lang='ts' setup>
  import type { Provider } from '@supabase/supabase-js';
  import { toTypedSchema } from '@vee-validate/zod';
  import { useForm } from 'vee-validate';
  import * as z from 'zod';
  import { type Severity} from '@/components/common/GcAlert.vue';
  import { Button as FormButton, FormControl, FormField, FormInput, FormItem, FormLabel, Separator, Typography } from '@/components/ui';

  const supabase = useSupabaseClient();
  const $router = useRouter();
  const submitAction = ref<{message: string, severity: Severity} | undefined>(undefined);

  const formSchema = toTypedSchema(z.object({
    email: z.string()
      .email(),
    firstName: z.string()
      .min(1),
    lastName: z.string()
      .min(1),
    password: z.string()
      .min(8),
    passwordConfirm: z.string()
      .min(8),
  })
    .refine(data => data.password === data.passwordConfirm, {
      message: 'Passwords must match',
      path: ['passwordConfirm'],
    }));

  const { isFieldDirty, handleSubmit, isSubmitting, resetForm } = useForm({
    validationSchema: formSchema,
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      const { error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            first_name: values.firstName,
            last_name: values.lastName,
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
    }
  });

  const handleOAuthSignUp = async (provider: Provider) => {
    try {
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
        label="OR" />
    </div>
    <div class="auto-rows-auto grid grid-cols-1 gap-2">
      <form-field
        v-slot="{ componentField }"
        name="email"
        :validate-on-blur="!isFieldDirty">
        <form-item>
          <form-label>Email</form-label>
          <form-control>
            <form-input
              :disabled="isSubmitting"
              type="email"
              v-bind="componentField" />
          </form-control>
        </form-item>
      </form-field>

      <form-field
        v-slot="{ componentField }"
        name="firstName"
        :validate-on-blur="!isFieldDirty">
        <form-item>
          <form-label>First Name</form-label>
          <form-control>
            <form-input
              :disabled="isSubmitting"
              v-bind="componentField" />
          </form-control>
        </form-item>
      </form-field>
      <form-field
        v-slot="{ componentField }"
        name="lastName"
        :validate-on-blur="!isFieldDirty">
        <form-item>
          <form-label>Last Name</form-label>
          <form-control>
            <form-input
              :disabled="isSubmitting"
              v-bind="componentField" />
          </form-control>
        </form-item>
      </form-field>
      <form-field
        v-slot="{ componentField }"
        name="password"
        :validate-on-blur="!isFieldDirty">
        <form-item>
          <form-label>Password</form-label>
          <form-control>
            <form-input
              :disabled="isSubmitting"
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
          <form-label>Confirm Password</form-label>
          <form-control>
            <form-input
              :disabled="isSubmitting"
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
      <form-button
        :disabled="isSubmitting"
        :loading="isSubmitting"
        type="submit">
        Create Account
      </form-button>
    </div>
    <div class="flex items-center flex-col mt-4">
      <typography>
        Already have an account?
        <nuxt-link
          class="no-underline"
          :to="{ name: 'login' }">
          <form-button variant="link">
            Login
          </form-button>
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
