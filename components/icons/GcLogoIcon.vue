<script lang='ts' setup>
  interface Props {
    wrapperClass?: string;
    fill?: string;
  }

  withDefaults(defineProps<Props>(), {
    wrapperClass: 'w-4 h-4',
    fill: '#4a4a4a',
  });
</script>

<template>
  <div
    :class="wrapperClass"
    :style="{ fill }">
    <svg
      id="Layer_1"
      enableBackground="new 0 0 300 232"
      version="1.1"
      viewBox="0 0 300 232"
      x="0px"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      xmlSpace="preserve"
      y="0px">
      <g>
        <g>
          <path d="M177.1,2l-50.69,95l38.53,72.2L143.31,192C120.46,149.25,82.47,78,82.47,78L1.36,230h297.41L177.1,2z" />
        </g>
      </g>
    </svg>
  </div>
</template>
