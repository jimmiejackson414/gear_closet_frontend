<template>
  <VOnboardingWrapper
    ref="wrapper"
    :steps="steps"
    :options="options">
    <template
      #default="{
        previous, next, step, isFirst, isLast, index,
      }">
      <VOnboardingStep>
        <q-card class="q-pa-lg walkthrough-wrapper">
          <div v-if="step.content">
            <q-card-section class="header q-pt-none">
              <h6
                v-if="step.content.title"
                class="text-h6 q-ma-none">
                {{ step.content.title }}
              </h6>
              <div v-if="step.content.description">
                <p class="text-body1">
                  {{ step.content.description }}
                </p>
              </div>
            </q-card-section>
          </div>
          <div>
            <span class="absolute step-counter text-caption text-weight-bold">{{ `${index + 1}/${steps.length}` }}</span>
            <div class="row">
              <template v-if="!isFirst">
                <q-btn
                  flat
                  color="primary"
                  @click="previous">
                  Previous
                </q-btn>
              </template>
              <q-space />
              <q-btn
                color="primary"
                class="justify-end"
                @click="next">
                {{ isLast ? 'Finish' : 'Next' }}
              </q-btn>
            </div>
          </div>
        </q-card>
      </VOnboardingStep>
    </template>
  </VOnboardingWrapper>
</template>

<script lang='ts' setup>
  import { ref, watchEffect } from 'vue';
  import { VOnboardingWrapper, VOnboardingStep, useVOnboarding } from 'v-onboarding';
  import type { VOnboardingWrapperOptions } from 'v-onboarding/src/types/VOnboardingWrapper';
  import type { StepEntity } from 'v-onboarding/src/types/StepEntity.d';

  interface Props {
    steps: StepEntity[];
    options?: VOnboardingWrapperOptions;
    triggerStart: boolean;
  }

  const props = withDefaults(defineProps<Props>(), {
    steps: () => [],
    triggerStart: false,
    options: () => ({
      popper: {
        placement: 'auto',
        modifiers: [
          {
            name: 'offset',
            options: {
              offset: (): Array<any> => [0, window.matchMedia('(max-width: 598px)').matches ? 0 : 20],
            },
          },
        ],
      },
    }),
  });

  const wrapper = ref(null);
  const { start } = useVOnboarding(wrapper);

  watchEffect(() => {
    if (props.triggerStart) start();
  });
</script>

<style lang='scss'>
  [data-v-onboarding-wrapper] > div > div {
    max-width: 400px;

    .walkthrough-wrapper {
      border-top: 5px solid $primary;

      .step-counter {
        right: 2%;
        top: 2%;
      }
    }
  }
</style>
