<script lang="ts" setup>
  import { SubscriptionLevel } from '@/types';
  import tailwindConfig from '@/utils/tailwind';
  import type { Tier } from '@/utils/tiers';

  interface Props {
    plan: Tier;
    selectedPlan?: SubscriptionLevel;
  }

  const props = defineProps<Props>();

  const $store = useUserStore();
  const profile = toRef($store, 'profile');

  const computedBorder = computed(() => {
    const classes = ['border-2', 'transition', 'duration-200', 'ease-snap border-t-8'];

    // define the border top color based on the plan
    if (props.plan.value === SubscriptionLevel.FREE) { classes.push('border-t-tertiary'); }
    else if (props.plan.value === SubscriptionLevel.MONTHLY) { classes.push('border-t-accent-alt'); }
    else if (props.plan.value === SubscriptionLevel.ANNUAL) { classes.push('border-t-primary'); }

    // apply the border color based on the selected plan and whether the plan is selected
    if (props.selectedPlan !== undefined && props.plan.value === props.selectedPlan) {
      if (props.plan.value === SubscriptionLevel.FREE) { classes.push('border-tertiary'); }
      else if (props.plan.value === SubscriptionLevel.MONTHLY) { classes.push('border-accent-alt'); }
      else if (props.plan.value === SubscriptionLevel.ANNUAL) { classes.push('border-primary'); }
    } else {
      classes.push('border-transparent');
    }

    return classes;
  });

  const emit = defineEmits(['handle-select']);
</script>

<template>
  <div
    class="flex flex-col shadow-xs rounded-2xl h-full"
    :class="computedBorder">
    <div class="flex flex-col justify-center items-center pt-4 pb-2">
      <gc-pill
        :copy="plan.value"
        size="sm"
        :variant="{
          [SubscriptionLevel.MONTHLY]: 'positive' as const,
          [SubscriptionLevel.ANNUAL]: 'primary' as const,
          [SubscriptionLevel.FREE]: 'warning' as const,
          [SubscriptionLevel.LIFE]: 'primary' as const,
        }[plan.value as keyof typeof SubscriptionLevel] || 'primary'" />
      <p class="mt-4 font-bold! text-base-lg">
        {{ plan.value === SubscriptionLevel.FREE ? 'Free' : plan.price }}
      </p>
      <p class="text-sm">
        {{ plan.priceSubtitle }}
      </p>
    </div>
    <hr class="bg-gray-200 my-2 border-0 h-px">
    <div class="flex flex-col px-4 py-2 grow">
      <div
        v-for="(item, index) in plan.description"
        :key="`${plan.value}-${item}-${index}`"
        class="flex items-center gap-4 mb-2 last:mb-0">
        <icon-check-circle-2
          :color="tailwindConfig.theme.colors.primary.DEFAULT"
          :size="20" />
        <p class="text-base">
          {{ item }}
        </p>
      </div>
      <button-root
        class="self-center mt-auto"
        :disabled="plan.buttonDisabled || (profile?.subscriptions[0]?.prices.identifier === plan.value)"
        size="sm"
        variant="secondary"
        @click="emit('handle-select', plan.value)">
        {{ plan.buttonText }}
      </button-root>
    </div>
  </div>
</template>
