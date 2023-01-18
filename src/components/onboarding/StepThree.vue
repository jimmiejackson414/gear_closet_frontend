<template>
  <div class="row q-mb-sm justify-center">
    <p class="text-body1 q-mt-none t-mb-md">
      3. Explore our plans
    </p>
  </div>
  <div class="row q-col-gutter-lg">
    <UpgradeCard
      v-for="tier in tiers"
      :key="tier.title"
      :tier="tier"
      :is-submitting="isSubmitting"
      @handle-action="handleSelected" />
  </div>
  <q-stepper-navigation class="row justify-between q-mt-lg full-width">
    <q-btn
      flat
      :ripple="false"
      color="primary"
      label="Back"
      class="q-ml-sm"
      @click="handlePrevStep" />
    <q-space />
    <q-btn
      :label="submitLabel"
      color="primary"
      :ripple="false"
      :loading="isSubmitting"
      :disabled="isSubmitting || !selectedTier"
      @click="handleSubmit" />
  </q-stepper-navigation>
</template>

<script lang='ts' setup>
  import { computed, ref } from 'vue';
  import UpgradeCard from '@/components/onboarding/UpgradeCard.vue';
  import { tiers } from '@/helpers';
  import { SubscriptionLevel } from '@/generated/types';
  import type { Tier } from '@/helpers/tiers';

  interface Props {
    isSubmitting: boolean;
  }

  // eslint-disable-next-line vue/no-setup-props-destructure
  const { isSubmitting } = defineProps<Props>();
  const selectedTier = ref<Tier | null>(null);

  const emit = defineEmits(['handleNextStep', 'handlePrevStep']);

  const submitLabel = computed(() => {
    if (!selectedTier.value) return 'Select a plan';
    return `${(selectedTier.value?.value === SubscriptionLevel.Monthly || selectedTier.value?.value === SubscriptionLevel.Annual)
      ? `Upgrade to ${selectedTier.value?.title} Plan`
      : 'Continue with Free Plan'
    }`;
  });

  const handleSelected = (tier: Tier): void => {
    selectedTier.value = tier;
  };

  const handlePrevStep = (): void => {
    emit('handlePrevStep');
  };

  const handleSubmit = (): void => {
    emit('handleNextStep', selectedTier.value);
  };
</script>
