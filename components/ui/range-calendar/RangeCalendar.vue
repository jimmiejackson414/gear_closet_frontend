<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script lang="ts" setup>
  import { computed, type HTMLAttributes } from 'vue';
  import { RangeCalendarRoot, type RangeCalendarRootEmits, type RangeCalendarRootProps, useForwardPropsEmits } from 'radix-vue';
  import { cn } from '@/lib/utils';
  import { RangeCalendarCell, RangeCalendarCellTrigger, RangeCalendarGrid, RangeCalendarGridBody, RangeCalendarGridHead, RangeCalendarGridRow, RangeCalendarHeadCell, RangeCalendarHeader, RangeCalendarHeading, RangeCalendarNextButton, RangeCalendarPrevButton } from '.';

  const props = defineProps<RangeCalendarRootProps & { class?: HTMLAttributes['class'] }>();

  const emits = defineEmits<RangeCalendarRootEmits>();

  const delegatedProps = computed(() => {
    const { class: _, ...delegated } = props;

    return delegated;
  });

  const forwarded = useForwardPropsEmits(delegatedProps, emits);
</script>

<template>
  <range-calendar-root
    v-slot="{ grid, weekDays }"
    :class="cn('p-3', props.class)"
    v-bind="forwarded">
    <range-calendar-header>
      <range-calendar-prev-button />
      <range-calendar-heading />
      <range-calendar-next-button />
    </range-calendar-header>

    <div class="flex sm:flex-row flex-col gap-y-4 sm:gap-x-4 sm:gap-y-0 mt-4">
      <range-calendar-grid
        v-for="month in grid"
        :key="month.value.toString()">
        <range-calendar-grid-head>
          <range-calendar-grid-row>
            <range-calendar-head-cell
              v-for="day in weekDays"
              :key="day">
              {{ day }}
            </range-calendar-head-cell>
          </range-calendar-grid-row>
        </range-calendar-grid-head>
        <range-calendar-grid-body>
          <range-calendar-grid-row
            v-for="(weekDates, index) in month.rows"
            :key="`weekDate-${index}`"
            class="mt-2 w-full">
            <range-calendar-cell
              v-for="weekDate in weekDates"
              :key="weekDate.toString()"
              :date="weekDate">
              <range-calendar-cell-trigger
                :day="weekDate"
                :month="month.value" />
            </range-calendar-cell>
          </range-calendar-grid-row>
        </range-calendar-grid-body>
      </range-calendar-grid>
    </div>
  </range-calendar-root>
</template>
