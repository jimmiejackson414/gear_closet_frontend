<script lang="ts" setup>
  import { CheckCircle2Icon } from 'lucide-vue-next';
  import { SubscriptionLevel } from '@/types';
  import tailwindConfig from '@/utils/tailwind';
  import type { Tier } from '@/utils/tiers';

  interface Props {
    plan: Tier;
  }

  const props = defineProps<Props>();

  const computedBorder = computed(() => ({
    'border-t-4 border-positive': props.plan.value === SubscriptionLevel.MONTHLY,
    'border-t-4 border-primary': props.plan.value === SubscriptionLevel.ANNUAL,
    'border-t-4 border-warning': props.plan.value === SubscriptionLevel.FREE,
  }));
</script>

<template>
  <div
    class="flex flex-col h-full rounded-2xl shadow-light"
    :class="computedBorder">
    <div class="flex justify-center items-center flex-col p-4">
      <gc-pill
        :copy="plan.value"
        :variant="{
          [SubscriptionLevel.MONTHLY]: 'positive' as const,
          [SubscriptionLevel.ANNUAL]: 'primary' as const,
          [SubscriptionLevel.FREE]: 'warning' as const,
          [SubscriptionLevel.LIFE]: 'primary' as const,
        }[plan.value as keyof typeof SubscriptionLevel] || 'primary'" />
      <p class="!font-bold mt-4 text-base-lg">
        {{ plan.value === SubscriptionLevel.FREE ? 'Free' : plan.price }}
      </p>
      <p class="text-sm">
        {{ plan.priceSubtitle }}
      </p>
    </div>
    <hr class="bg-gray-200 border-0 h-px my-2">
    <div class="flex flex-col flex-grow p-4">
      <div
        v-for="(item, index) in plan.description"
        :key="`${plan.value}-${item}-${index}`"
        class="flex items-center gap-4 mb-4 last:mb-0">
        <check-circle-2-icon
          :color="tailwindConfig.theme.colors.primary"
          :size="20" />
        <p class="text-base">
          {{ item }}
        </p>
      </div>
      <gc-button
        class="mt-auto self-center"
        :disabled="plan.buttonDisabled"
        :label="plan.buttonText"
        size="sm" />
    </div>
  </div>
</template>
