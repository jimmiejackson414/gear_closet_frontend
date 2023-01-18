<template>
  <div class="donut-wrapper">
    <VueApexCharts
      ref="donutChart"
      type="donut"
      height="100%"
      width="100%"
      :options="options"
      :series="data.series" />
  </div>
</template>

<script lang='ts' setup>
  import { ref, watch } from 'vue';
  import round from 'lodash.round';
  import { useQuasar } from 'quasar';
  import VueApexCharts, { VueApexChartsComponent } from 'vue3-apexcharts';
  import { ApexOptions } from 'apexcharts';
  import { truncate } from '@/helpers/functions';
  import { findTheme } from '@/helpers/chartTheme';
  import { Theme } from '@/generated/types';

  interface Props {
    theme?: Theme | null;
    data: {
      labels: string[] | undefined;
      series: number[] | undefined;
    };
  }

  // eslint-disable-next-line vue/no-setup-props-destructure
  const { theme, data } = defineProps<Props>();
  const $q = useQuasar();

  const format = (value: number): number => round(value, 2);

  const donutChart = ref<null | VueApexChartsComponent>(null);
  const isMobile = ref($q.screen.xs);
  const options = ref({
    chart: {
      id: 'selected-pack-graph',
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 500,
        animateGradually: {
          enabled: true,
          delay: 0,
        },
        dynamicAnimation: {
          enabled: true,
          speed: 350,
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    labels: data.labels,
    plotOptions: {
      pie: {
        donut: {
          background: 'transparent',
          labels: {
            show: true,
            name: {
              show: true,
              color: '#757575',
              fontSize: '14px',
              fontFamily: 'Lato, Roboto, Helvetica Neue, sans-serif',
              fontWeight: '300',
              formatter: val => truncate(val, 20),
            },
            value: {
              show: true,
              fontSize: isMobile.value ? '18px' : '28px',
              fontFamily: 'Lato, Roboto, Helvetica Neue, sans-serif',
              fontWeight: 'bold',
              color: '#4a4a4a',
              formatter: val => `${format(Number(val))} lbs`,
            },
            total: {
              show: true,
              fontSize: '12px',
              fontFamily: 'Lato, Roboto, Helvetica Neue, sans-serif',
              fontWeight: 'bold',
              color: '#757575',
              formatter: (w) => {
                const reduced = w.globals.seriesTotals.reduce((a: any, b: any) => a + b, 0);
                return `${format(reduced)} lbs`;
              },
            },
          },
        },
        expandOnClick: false,
      },
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
    colors: findTheme(theme),
    legend: {
      position: 'right',
      horizontalAlign: 'center',
      fontSize: '14px',
      fontFamily: 'Lato, Roboto, Helvetica Neue, sans-serif',
    },
    responsive: [
      {
        breakpoint: 768,
        options: {
          chart: {
            width: '100%',
          },
          legend: {
            position: 'bottom',
          },
        },
      },
    ],
  } as ApexOptions);

  // watch for theme change
  watch(() => theme, () => {
    options.value = { ...options.value, colors: findTheme(theme) };
  });

  // watch for data change
  watch(() => data, () => {
    if (!data.labels?.length) options.value = { ...options.value, ...{ legend: { show: false } } };
    else options.value = { ...options.value, ...{ legend: { show: true } } };
  }, { deep: true });
</script>

<style lang="scss" scoped>
  .donut-wrapper {
    height: 350px;
    width: 100%;
    margin: 0 auto;

    @media (max-width: $breakpoint-md-max) {
      height: 300px;
      width: 80%;
    }

    .vue-apexcharts {
      display: flex;
      justify-content: center;
    }
  }
</style>
