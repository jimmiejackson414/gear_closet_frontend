<script lang='ts' setup>
  import { ChevronUpIcon } from 'lucide-vue-next';
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

<template>
  <transition
    v-show="visible"
    enter-active-class="transition ease-in-out duration-200 scale-100"
    enter-from-class="opacity-0 scale-50"
    leave-active-class="transition ease-in-out duration-200 scale-50"
    leave-to-class="opacity-0 scale-50"
    mode="out-in"
    :duration="300"
    appear>
    <div class="cursor-pointer fixed right-[3%] bottom-[5%] z-50">
      <button
        type="button"
        class="bg-primary hover:bg-primary-dark border border-transparent flex justify-center items-center flex-shrink-0 font-semibold gap-2 h-[3rem] rounded-full text-sm text-white transition-all w-[3rem]"
        @click="scrollTop"
        @keydown="scrollTop">
        <chevron-up-icon />
      </button>
    </div>
  </transition>
</template>
