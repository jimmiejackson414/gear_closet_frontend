<script lang='ts' setup>
  import { SubscriptionLevel } from '@/types';
  
  interface Props {
    subscription: SubscriptionLevel;
  }

  const props = defineProps<Props>();

  const computedClasses = computed(() => ({
    'bg-warning-light text-warning-dark': props.subscription === SubscriptionLevel.FREE,
    'bg-primary-light/60 text-primary-dark': props.subscription === SubscriptionLevel.MONTHLY,
    'bg-positive-light text-positive-dark': props.subscription === SubscriptionLevel.ANNUAL || props.subscription === SubscriptionLevel.LIFE,
  }));
</script>

<template>
  <span
    class="font-bold me-2 px-4 py-2 rounded text-sm"
    :class="computedClasses">
    {{ capitalize(subscription) }} Subscription
  </span>
</template>
