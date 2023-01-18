<template>
  <div class="bottom">
    <q-form
      ref="settingsFormRef"
      @submit.prevent.stop="handleSubmit">
      <div class="row q-col-gutter-lg">
        <div class="col-12 col-md-6">
          <q-input
            ref="passwordRef"
            v-model="password"
            :disable="isSubmitting"
            outlined
            dense
            aria-required="true"
            type="password"
            label="New Password"
            lazy-rules="ondemand"
            :rules="passwordRules">
            <template #prepend>
              <q-icon name="bi-lock" />
            </template>
          </q-input>
        </div>
        <div class="col-12 col-md-6">
          <q-input
            ref="passwordConfirmRef"
            v-model="passwordConfirm"
            :disable="isSubmitting"
            outlined
            dense
            aria-required="true"
            type="password"
            label="Confirm New Password"
            lazy-rules="ondemand"
            :rules="passwordConfirmRules">
            <template #prepend>
              <q-icon name="bi-lock" />
            </template>
          </q-input>
        </div>
      </div>
      <div class="row justify-end">
        <q-btn
          :loading="isSubmitting"
          :disable="isSubmitting"
          label="Update"
          type="submit"
          color="primary"
          :ripple="false">
          <template #loading>
            <q-spinner-tail color="white" />
          </template>
        </q-btn>
      </div>
    </q-form>
  </div>
</template>

<script lang='ts' setup>
  import { ref } from 'vue';
  import { QForm } from 'quasar';
  import { UpdatePasswordInput } from '@/generated/types';
  import { useAppStore } from '@/stores/app';
  import { useUserStore } from '@/stores/user';

  // instantiate store and composable
  const user = useUserStore();
  const $app = useAppStore();

  // local state
  const settingsFormRef = ref<QForm | null>(null);
  const isSubmitting = ref(false);
  const password = ref('');
  const passwordConfirm = ref('');
  const passwordRules = [
    (val: string): boolean | string => (val && val.length > 0) || 'Password is required',
  ];
  const passwordConfirmRules = [
    (val: string): boolean | string => (val && val.length > 0) || 'Confirm Password is required',
    (val: string): boolean | string => (password.value === val) || 'Must match password',
  ];

  // submit form function
  const handleSubmit = (): void => {
    settingsFormRef.value?.validate()
      .then(async ok => {
        if (ok) {
          const payload: UpdatePasswordInput = { password: password.value };
          const { success } = await user.updatePassword(payload);
          if (success) {
            $app.notifyPositive('Successfully updated');
          } else {
            $app.notifyNegative('Error updating password');
          }
        } else {
          $app.notifyNegative('Error updating password');
        }
        // reset form
        password.value = '';
        passwordConfirm.value = '';
      });
  };
</script>

<style lang='scss' scoped>
  .bottom {
    padding: 0;

    @media (min-width: $breakpoint-md-min) {
      padding: 0 4rem;
    }

    section {
      margin-bottom: 2rem;

      h5 {
        margin-bottom: 1rem;
      }
    }
  }
</style>
