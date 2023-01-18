<template>
  <q-chip
    size="md"
    :color="color"
    text-color="white"
    icon="bi-person-badge">
    {{ capitalize(props.plan) }} Membership
  </q-chip>
</template>

<script lang='ts' setup>
  import { computed, PropType } from 'vue';
  import { SubscriptionLevel } from '@/generated/types';
  import { capitalize } from '@/helpers/functions';

  const props = defineProps({
    plan: { type: String as PropType<SubscriptionLevel>, required: true, default: SubscriptionLevel.Free },
  });

  const color = computed(() => {
    if (props.plan === SubscriptionLevel.Annual || props.plan === SubscriptionLevel.Life) return 'positive';
    if (props.plan === SubscriptionLevel.Monthly) return 'warning';
    return 'info';
  });
</script>

<style lang='scss' scoped>
  .q-chip {
    padding: 1rem;
  }
</style>
