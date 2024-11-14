<script lang='ts' setup>
  import { toTypedSchema } from '@vee-validate/zod';
  import { CheckIcon, CircleIcon, DotIcon } from 'lucide-vue-next';
  import * as z from 'zod';
  import { Button as FormButton, Form as FormWrapper, FormControl, FormField, FormLabel, FormMessage, Input as FormInput, Select as FormSelect, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue, Stepper, StepperDescription, StepperIndicator, StepperItem, StepperSeparator, StepperTitle, StepperTrigger } from '@/components/ui';
  import { MeasuringSystem } from '@/types';

  const formSchema = [
    z.object({
      avatar: z.string()
        .url()
        .optional(),
    }),
    z.object({
      firstName: z.string()
        .min(1),
      lastName: z.string()
        .min(1),
      trailName: z.string()
        .optional(),
      measuringSystem: z.union([z.literal(MeasuringSystem.IMPERIAL), z.literal(MeasuringSystem.METRIC)]),
    }),
  ];

  const stepIndex = ref(1);
  const steps = [
    {
      step: 1,
      title: 'Upload Avatar',
      description: 'Upload a photo of yourself (optional)',
    },
    {
      step: 2,
      title: 'Account Info',
      description: 'Tell us a little about yourself',
    },
    {
      step: 3,
      title: 'Plan Options',
      description: 'Choose your plan',
    },
  ];

  const onSubmit = async (values: any) => {
    console.log(values);
  };
</script>

<template>
  <form-wrapper
    v-slot="{ meta, values, validate, errorBag }"
    as=""
    keep-values
    :validation-schema="toTypedSchema(formSchema[stepIndex - 1])">
    <stepper
      v-slot="{ isNextDisabled, isPrevDisabled, nextStep, prevStep }"
      v-model="stepIndex"
      class="block max-w-4xl mt-8 mx-auto w-full">
      <form
        @submit="(e) => {
          e.preventDefault()
          validate()
          console.log({ errorBag });

          if (stepIndex === steps.length && meta.valid) {
            onSubmit(values)
          }
        }">
        <div class="flex flex-start gap-2 w-full">
          <stepper-item
            v-for="step in steps"
            :key="step.step"
            v-slot="{ state }"
            class="flex justify-center items-center flex-col relative w-full"
            :step="step.step">
            <stepper-separator
              v-if="step.step !== steps[steps.length - 1].step"
              class="absolute top-5 right-[calc(-50%+10px)] left-[calc(50%+20px)] bg-muted block group-data-[state=completed]:bg-primary h-0.5 rounded-full shrink-0" />

            <stepper-trigger as-child>
              <form-button
                class="rounded-full shrink-0 z-10"
                :class="[state === 'active' && 'ring-2 ring-ring ring-offset-2 ring-offset-background']"
                :disabled="state !== 'completed' && !meta.valid"
                size="icon"
                :variant="state === 'completed' || state === 'active' ? 'default' : 'outline'">
                <check-icon
                  v-if="state === 'completed'"
                  class="size-5" />
                <circle-icon v-if="state === 'active'" />
                <dot-icon v-if="state === 'inactive'" />
              </form-button>
            </stepper-trigger>

            <div class="flex items-center flex-col mt-5 text-center">
              <stepper-title
                class="font-semibold text-sm lg:text-base transition"
                :class="[state === 'active' && 'text-primary']">
                {{ step.title }}
              </stepper-title>
              <stepper-description
                class="sr-only text-muted-foreground lg:text-sm text-xs transition md:not-sr-only"
                :class="[state === 'active' && 'text-primary']">
                {{ step.description }}
              </stepper-description>
            </div>
          </stepper-item>
        </div>

        <div class="flex flex-col gap-4 max-w-xl mt-16 mx-auto">
          <template v-if="stepIndex === 1">
            <form-field
              v-slot="{ componentField }"
              name="avatar">
              <FormItem>
                <form-control>
                  <gc-avatar-upload
                    v-bind="componentField"
                    classes="max-w-xs mx-auto" />
                </form-control>
                <form-message class="place-self-center" />
              </FormItem>
            </form-field>
          </template>

          <template v-if="stepIndex === 2">
            <form-field
              v-slot="{ componentField }"
              name="firstName">
              <FormItem>
                <form-label>First Name</form-label>
                <form-control>
                  <form-input v-bind="componentField" />
                </form-control>
                <form-message />
              </FormItem>
            </form-field>

            <form-field
              v-slot="{ componentField }"
              name="lastName">
              <FormItem>
                <form-label>Last Name</form-label>
                <form-control>
                  <form-input
                    type="password"
                    v-bind="componentField" />
                </form-control>
                <form-message />
              </FormItem>
            </form-field>

            <form-field
              v-slot="{ componentField }"
              name="trailName">
              <FormItem>
                <form-label>Trail Name (optional)</form-label>
                <form-control>
                  <form-input
                    type="password"
                    v-bind="componentField" />
                </form-control>
                <form-message />
              </FormItem>
            </form-field>

            <form-field
              v-slot="{ componentField }"
              name="measuringSystem">
              <FormItem>
                <form-label>Preferred Measuring System</form-label>

                <form-select v-bind="componentField">
                  <form-control>
                    <select-trigger>
                      <select-value placeholder="Select a drink" />
                    </select-trigger>
                  </form-control>
                  <select-content>
                    <select-group>
                      <select-item value="coffee">
                        Coffe
                      </select-item>
                      <select-item value="tea">
                        Tea
                      </select-item>
                      <select-item value="soda">
                        Soda
                      </select-item>
                    </select-group>
                  </select-content>
                </form-select>
                <form-message />
              </FormItem>
            </form-field>
          </template>

          <template v-if="stepIndex === 3" />
        </div>

        <div class="flex justify-between items-center mt-16">
          <form-button
            :disabled="isPrevDisabled"
            size="sm"
            variant="outline"
            @click="prevStep()">
            Back
          </form-button>
          <div class="flex items-center gap-3">
            <form-button
              v-if="stepIndex !== 3"
              :disabled="isNextDisabled"
              size="sm"
              :type="meta.valid ? 'button' : 'submit'"
              @click="meta.valid && nextStep()">
              Next
            </form-button>
            <form-button
              v-if="stepIndex === 3"
              size="sm"
              type="submit">
              Submit
            </form-button>
          </div>
        </div>
      </form>
    </stepper>
  </form-wrapper>
</template>
