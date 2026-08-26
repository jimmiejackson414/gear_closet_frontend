<script lang='ts' setup>
  import { SubscriptionLevel } from '@/types';
  import type { Tier } from '@/utils/tiers';

  interface Props {
    isSelected?: boolean;
    tier: Tier;
    submitting?: boolean;
  }

  const props = withDefaults(defineProps<Props>(), {
    isSelected: false,
    submitting: false,
  });

  const emit = defineEmits(['handleAction']);

  const handleSelect = () => {
    emit('handleAction', props.tier);
  };
</script>

<template>
  <div
    class="w-full cursor-pointer"
    @click="handleSelect">
    <div
      class="rounded-lg transition-all duration-200 ease-in-out"
      :class="[
        {
          'border-tertiary': props.tier.value === SubscriptionLevel.FREE,
          'border-primary': props.tier.value === SubscriptionLevel.ANNUAL,
          'border-accent-alt': props.tier.value === SubscriptionLevel.MONTHLY,
        },
        props.isSelected ? 'shadow-lg' : 'shadow-xs hover:shadow-lg',
        'border-t-[5px]',
      ]">
      <div class="bg-charlie-brown p-4 text-center">
        <div
          class="inline-block px-4 py-2 rounded-[5px]"
          :class="[{
            'bg-tertiary': props.tier.value === SubscriptionLevel.FREE,
            'bg-primary text-white': props.tier.value === SubscriptionLevel.ANNUAL,
            'bg-accent-alt': props.tier.value === SubscriptionLevel.MONTHLY,
          } ]">
          <typography class="font-bold text-white uppercase">
            {{ tier?.title }}
          </typography>
        </div>
        <div>
          <typography
            class="mt-6 font-black"
            variant="h3">
            {{ tier?.price }}
          </typography>
          <typography class="mb-4 text-muted-foreground">
            {{ tier?.priceSubtitle }}
          </typography>
          <typography
            v-if="props.tier.value === SubscriptionLevel.MONTHLY || props.tier.value === SubscriptionLevel.ANNUAL"
            class="mb-4"
            variant="muted">
            Start on Free — add billing in Profile when you're ready to upgrade.
          </typography>
        </div>
      </div>
      <hr class="bg-gray-200 border-0 h-px">
      <div class="p-4">
        <ul class="space-y-4 text-muted-foreground text-left">
          <li
            v-for="(item, i) in tier?.description"
            :key="i"
            class="flex items-center space-x-3 text-base">
            <icon-check-circle-2
              :class="{
                'text-tertiary': props.tier.value === SubscriptionLevel.FREE,
                'text-primary': props.tier.value === SubscriptionLevel.ANNUAL,
                'text-accent-alt': props.tier.value === SubscriptionLevel.MONTHLY,
              }"
              :color="tailwind.theme.colors['text-positive']"
              :size="24"
              :stroke-width="2" />
            <span>{{ item }}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>