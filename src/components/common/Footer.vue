<template>
  <q-footer class="bg-grey-1">
    <q-toolbar class="justify-center text-grey-8">
      <p class="text-body2 q-mb-none">
        <span
          role="img"
          aria-label="copyright">
          &#169;
        </span>
        {{ ' ' }}Gear Closet {{ copyrightYear() }}
      </p>
    </q-toolbar>
  </q-footer>
</template>

<script lang='ts' setup>
  // get dynamic year
  const copyrightYear = (): number => new Date()
    .getFullYear();
</script>

<style lang="scss" scoped>
  .q-footer {
    position: inherit;
  }
</style>
