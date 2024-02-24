<script lang='ts' setup>
  import { CheckCircle2Icon } from 'lucide-vue-next';
  import { SubscriptionLevel } from '@/types';

  interface Props {
    isSelected: boolean;
    tier: Tier;
    submitting: boolean;
  }

  const props = withDefaults(defineProps<Props>(), {
    isSelected: false,
    tier: undefined,
    submitting: false,
  });

  const emit = defineEmits(['handleAction']);

  const handleSelect = () => {
    emit('handleAction', props.tier);
  };
</script>

<template>
  <div
    class="cursor-pointer w-full"
    @click="handleSelect">
    <div
      class="duration-200 ease-in-out rounded-lg transition-all"
      :class="[
        {
          'border-warning': props.tier.value === SubscriptionLevel.FREE,
          'border-primary': props.tier.value === SubscriptionLevel.ANNUAL,
          'border-positive': props.tier.value === SubscriptionLevel.MONTHLY,
        },
        props.isSelected ? 'shadow-lg' : 'shadow hover:shadow-lg',
        'border-t-[5px]',
      ]">
      <div class="bg-charlie-brown p-4 text-center">
        <div
          class="inline-block px-4 py-2 rounded-[5px]"
          :class="[{
            'bg-warning': props.tier.value === SubscriptionLevel.FREE,
            'bg-primary': props.tier.value === SubscriptionLevel.ANNUAL,
            'bg-positive': props.tier.value === SubscriptionLevel.MONTHLY,
          }, props.tier.value === SubscriptionLevel.FREE ? 'text-dark-grey' : 'text-white' ]">
          <p class="font-bold text-base uppercase">
            {{ tier?.title }}
          </p>
        </div>
        <div>
          <h4 class="font-black mt-6 text-2xl">
            {{ tier?.price }}
          </h4>
          <p class="mb-4 text-base text-grey">
            {{ tier?.priceSubtitle }}
          </p>
        </div>
      </div>
      <hr class="bg-gray-200 border-0 h-px">
      <div class="p-4">
        <ul class="space-y-4 text-dark-grey text-left">
          <li
            v-for="(item, i) in tier?.description"
            :key="i"
            class="flex items-center space-x-3 text-base">
            <check-circle-2-icon
              :class="{
                'text-warning': props.tier.value === SubscriptionLevel.FREE,
                'text-primary': props.tier.value === SubscriptionLevel.ANNUAL,
                'text-positive': props.tier.value === SubscriptionLevel.MONTHLY,
              }"
              :color="tailwind.theme.colors['text-positive']"
              size="24"
              :stroke-width="2" />
            <span>{{ item }}</span>
          </li>
        </ul>
      </div>
    </div> 
  </div>
</template>