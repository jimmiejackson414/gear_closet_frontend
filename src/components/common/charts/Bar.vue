<template>
  <div class="bar-wrapper">
    <VueApexCharts
      ref="barChart"
      type="bar"
      height="100%"
      width="100%"
      :options="options"
      :series="data.series"
      @data-point-mouse-enter="onDataPointMouseEnter"
      @data-point-mouse-leave="onDataPointMouseLeave" />
    <div class="bottom">
      <span
        class="color"
        :style="{ backgroundColor: categoryColor }" />
      <span class="text-body1">{{ categoryName }}</span>
    </div>
  </div>
</template>

<script lang='ts' setup>
  import { PropType, ref, watch } from 'vue';
  import round from 'lodash.round';
  import VueApexCharts, { VueApexChartsComponent } from 'vue3-apexcharts';
  import { ApexOptions } from 'apexcharts';
  import { findTheme } from '@/helpers/chartTheme';
  import { Maybe, Theme } from '@/generated/types';

  const props = defineProps({
    theme: { type: String as PropType<Maybe<string> | undefined>, required: false, default: Theme.Blue6 },
    data: { type: Object, required: true, default: () => null },
  });

  const barChart = ref<null | VueApexChartsComponent>(null);
  const categoryName = ref('');
  const categoryColor = ref('');
  const data = ref(props.data);
  const options = ref({
    chart: {
      id: 'selected-pack-graph',
      toolbar: {
        show: false,
      },
    },
    colors: findTheme(props.theme),
    dataLabels: {
      enabled: false,
    },
    grid: {
      show: false,
    },
    labels: props.data.labels,
    legend: {
      show: false,
    },
    noData: {
      text: 'There is not enough data to display the chart',
      align: 'center',
      verticalAlign: 'middle',
      style: {
        fontSize: '14px',
        fontFamily: 'Lato, Roboto, Arial, Helvetica',
      },
    },
    plotOptions: {
      bar: {
        distributed: true,
        borderRadius: 10,
        dataLabels: {
          position: 'top',
        },
      },
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent'],
    },
    tooltip: {
      enabled: true,
      theme: 'dark',
      custom: ({ series, seriesIndex, dataPointIndex }) => {
        const label = series[seriesIndex][dataPointIndex];
        return (
          '<div class="arrow-box q-pa-sm">'
          + `<span>${label} lbs</span>`
          + '</div>'
        );
      },
    },
    xaxis: {
      labels: {
        show: false,
      },
      categories: props.data.labels,
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      tooltip: {
        enabled: false,
      },
    },
    yaxis: {
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        show: false,
        formatter: (value: number) => String(round(value, 2)),
      },
    },
  } as ApexOptions);

  const onDataPointMouseEnter = (_event: any, _chartContext: any, config: any): void => {
    const { dataPointIndex } = config;
    categoryName.value = props.data.labels[dataPointIndex];
    categoryColor.value = config.w.config.colors[dataPointIndex];
  };

  const onDataPointMouseLeave = (): void => {
    categoryName.value = '';
    categoryColor.value = '';
  };

  // watch for theme change
  watch(() => props.theme, () => {
    options.value = { ...options.value, colors: findTheme(props.theme) };
  });

  // watch for data change
  watch(() => props.data, () => {
    data.value = props.data;
  }, { deep: true });
</script>

<style lang="scss">
  .apexcharts-tooltip.apexcharts-theme-light {
    background: transparent;

    .arrow-box {
      background-color: $dark;
      border-color: $dark;
      border-radius: 10px;
      color: white;
      font-weight: bold;
    }
  }
</style>

<style lang="scss" scoped>
  .bar-wrapper {
    height: 200px;
    width: 100%;
    margin: 0 auto 1rem;

    @media (min-width: $breakpoint-md-min) {
      height: 275px;
    }

    .vue-apexcharts {
      display: flex;
      justify-content: center;
    }
  }

  .bottom {
    justify-content: center;
    display: flex;
    min-height: 24px;

    .color {
      height: 24px;
      width: 24px;
      border-radius: 10px;
      margin-right: 8px;
    }
  }
</style>
