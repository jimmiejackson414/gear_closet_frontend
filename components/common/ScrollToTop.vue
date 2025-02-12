<script lang='ts' setup>
  // define props
  const props = defineProps({
    color: { default: 'blue-6', required: false, type: String },
    showBelow: { default: 250, required: false, type: Number },
  });

  // determines whether to show button
  const visible = ref(false);

  // scrolls to top
  const scrollTop = (): void => {
    window.scrollTo({ behavior: 'smooth', left: 0, top: 0 });
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

<template>
  <transition
    v-show="visible"
    appear
    :duration="300"
    enter-active-class="transition ease-in-out duration-200 scale-100"
    enter-from-class="opacity-0 scale-50"
    leave-active-class="transition ease-in-out duration-200 scale-50"
    leave-to-class="opacity-0 scale-50"
    mode="out-in">
    <div class="cursor-pointer fixed right-[3%] bottom-[5%] z-50">
      <button
        class="bg-primary border border-transparent flex justify-center items-center flex-shrink-0 font-semibold gap-2 h-[3rem] rounded-full text-primary-foreground text-sm transition-all w-[3rem]"
        type="button"
        @click="scrollTop"
        @keydown="scrollTop">
        <icon-chevron-up />
      </button>
    </div>
  </transition>
</template>
