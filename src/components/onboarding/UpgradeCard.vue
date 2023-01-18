<template>
  <div class="col-12 col-md-4">
    <q-card :style="headerStyles">
      <q-card-section class="text-center texture">
        <div :style="titleStyles">
          <p class="text-body1 q-ma-none text-uppercase text-weight-bold">
            {{ tier.title }}
          </p>
        </div>
        <div class="price-description">
          <h4 class="text-h4 text-weight-bolder q-mt-lg q-mb-none">
            {{ tier.price }}
          </h4>
          <p class="text-subtitle1 text-grey">
            {{ tier.priceSubtitle }}
          </p>
        </div>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <q-list
          padding
          class="tier-list">
          <q-item
            v-for="(item, i) in tier.description"
            :key="i"
            class="text-subtitle1">
            <q-item-section avatar>
              <q-icon
                name="bi-check-circle"
                color="primary" />
            </q-item-section>
            <q-item-section>
              {{ item }}
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
      <q-card-actions>
        <q-btn
          :outline="tier.buttonVariant === 'outlined'"
          :unelevated="tier.buttonVariant === 'unelevated'"
          color="secondary"
          :loading="isSubmitting"
          :label="tier.buttonText"
          :disable="tier.buttonDisabled || isSubmitting"
          :ripple="false"
          class="full-width"
          @click="() => handleClick(tier)" />
      </q-card-actions>
    </q-card>
  </div>
</template>

<script lang='ts' setup>
  import { reactive, ref } from 'vue';
  import { SubscriptionLevel } from '@/generated/types';
  import { Tier } from '@/helpers/tiers';

  interface Props {
    tier: Tier;
    isSubmitting: boolean;
  }

  // eslint-disable-next-line vue/no-setup-props-destructure
  const { tier, isSubmitting } = defineProps<Props>();

  const selectedTier = ref<Tier | null>(null);

  const headerStyles = reactive({
    'border-top': `5px solid ${tier.borderColor}`,
  });

  const titleStyles = reactive({
    'border-radius': '5px',
    'background-color': tier.borderColor,
    padding: '0.5rem 1rem',
    color: tier.value === SubscriptionLevel.Free ? '#4a4a4a' : '#fff',
    display: 'inline-block',
  });

  const emit = defineEmits(['handleAction']);

  const handleClick = (t: Tier): void => {
    selectedTier.value = t;
    emit('handleAction', t.value);
  };
</script>

<style le lang='scss' scoped>
  .texture {
    background-image: $charlie-brown;
  }
</style>
