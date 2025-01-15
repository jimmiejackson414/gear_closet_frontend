<script lang="ts" setup>
  const emit = defineEmits(['click']);
</script>

<template>
  <button-root
    id="darkmode"
    class="focus-visible:outline-none"
    size="icon"
    tab-index="0"
    variant="ghost"
    @click="emit('click')"
    @keydown.enter="emit('click')">
    <div class="darkmode_icon">
      <span class="ray" />
      <span class="ray" />
      <span class="ray" />
      <span class="ray" />
      <span class="ray" />
      <span class="ray" />
      <span class="ray" />
      <span class="ray" />
    </div>
  </button-root>
</template>

<style>
  :root {
    --header: hsl(var(--input));
    --page-color-transition: background 0.2s ease, color 0.2s ease;
  }

  html.dark {
    --header: hsl(var(--tertiary-foreground));
  }

  body {
    transition: transform 0.5s ease-in-out, var(--page-color-transition);
  }

  #darkmode {
    width: 40px;
    height: 40px;
  }

  #darkmode:hover .darkmode_icon::after {
    background: hsl(var(--accent));
  }

  .darkmode_icon {
    position: absolute;
    width: 20px;
    height: 20px;
    border-radius: 10px;
    background: var(--header);
    transform-origin: center center;
    transition: transform 0.25s ease-in-out, var(--page-color-transition);
  }

  .darkmode_icon::after {
    position: absolute;
    content: '';
    width: 16px;
    height: 16px;
    left: 8px;
    bottom: 4px;
    border-radius: 10px;
    background: hsl(var(--background));
    opacity: 1;
    transform-origin: center center;
    transform: scale(1);
    transition: opacity 0.2s ease, transform 0.25s ease, var(--page-color-transition);
  }

  .darkmode_icon .ray {
    position: absolute;
    left: 7px;
    top: 7px;
    width: 6px;
    height: 6px;
    border-radius: 6px;
    background: var(--header);
    transform-origin: center;
    transition: transform 0.25s ease-in-out, var(--page-color-transition);
  }

  .ray:nth-child(1) { transform: rotate(45deg) translateX(0); }
  .ray:nth-child(2) { transform: rotate(90deg) translateX(0); }
  .ray:nth-child(3) { transform: rotate(135deg) translateX(0); }
  .ray:nth-child(4) { transform: rotate(180deg) translateX(0); }
  .ray:nth-child(5) { transform: rotate(225deg) translateX(0); }
  .ray:nth-child(6) { transform: rotate(270deg) translateX(0); }
  .ray:nth-child(7) { transform: rotate(315deg) translateX(0); }
  .ray:nth-child(8) { transform: rotate(360deg) translateX(0); }

  html.dark .darkmode_icon {
    transform: scale(0.6);
  }

  html.dark .darkmode_icon::after {
    opacity: 0;
    background: var(--header);
    transform: scale(0);
  }

  html.dark .ray:nth-child(1) { transform: rotate(45deg) translateX(-16px); }
  html.dark .ray:nth-child(2) { transform: rotate(90deg) translateX(-16px); }
  html.dark .ray:nth-child(3) { transform: rotate(135deg) translateX(-16px); }
  html.dark .ray:nth-child(4) { transform: rotate(180deg) translateX(-16px); }
  html.dark .ray:nth-child(5) { transform: rotate(225deg) translateX(-16px); }
  html.dark .ray:nth-child(6) { transform: rotate(270deg) translateX(-16px); }
  html.dark .ray:nth-child(7) { transform: rotate(315deg) translateX(-16px); }
  html.dark .ray:nth-child(8) { transform: rotate(360deg) translateX(-16px); }
</style>