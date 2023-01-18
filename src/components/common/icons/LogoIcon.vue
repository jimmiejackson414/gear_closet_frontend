<template>
  <div
    :class="[wrapperClass, 'svg-wrapper']"
    :style="{ width: `${width}px`, height, fill }">
    <svg
      id="Layer_1"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      x="0px"
      y="0px"
      viewBox="0 0 300 232"
      enableBackground="new 0 0 300 232"
      xmlSpace="preserve">
      <g>
        <g>
          <path d="M177.1,2l-50.69,95l38.53,72.2L143.31,192C120.46,149.25,82.47,78,82.47,78L1.36,230h297.41L177.1,2z" />
        </g>
      </g>
    </svg>
  </div>
</template>

<script lang='ts' setup>
  defineProps({
    wrapperClass: { type: String, required: false, default: '' },
    width: { type: Number, required: false, default: 40 },
    height: { type: [Number, String], required: false, default: 'auto' },
    fill: { type: String, required: false, default: '#4a4a4a' },
  });
</script>
