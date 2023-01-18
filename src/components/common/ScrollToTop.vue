<template>
  <transition
    v-show="visible"
    name="zoom"
    mode="out-in"
    :duration="300"
    appear>
    <q-page-sticky
      position="bottom-right"
      :offset="[18, 18]">
      <q-btn
        fab
        icon="bi-chevron-up"
        :ripple="false"
        :color="color"
        @click="scrollTop"
        @keydown="scrollTop" />
    </q-page-sticky>
  </transition>
</template>

<script lang='ts' setup>
  import { onBeforeUnmount, onMounted, ref } from 'vue';

  // define props
  const props = defineProps({
    color: { type: String, required: false, default: 'blue-6' },
    showBelow: { type: Number, required: false, default: 250 },
  });

  // determines whether to show button
  const visible = ref(false);

  // scrolls to top
  const scrollTop = (): void => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  };

  // scroll listener
  const scrollListener = (): void => {
    visible.value = window.scrollY > props.showBelow;
  };

  // attach listener onMounted
  onMounted(() => {
    window.addEventListener('scroll', scrollListener);
  });

  // removes listener on unMount
  onBeforeUnmount(() => {
    window.removeEventListener('scroll', scrollListener);
  });
</script>

<style lang='scss' scoped>
  .bottom-right {
    position: fixed;
    bottom: 5%;
    right: 3%;
    cursor: pointer;
  }

  .zoom-enter-active,
  .zoom-leave-active {
    transition: all 0.3s ease;
    transform: scale(1);
  }

  .zoom-enter-from,
  .zoom-leave-to {
    opacity: 0;
    transform: scale(0.25);
  }
</style>
