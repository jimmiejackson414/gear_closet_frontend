<template>
  <q-item class="column">
    <q-item-section class="q-mb-lg">
      <q-skeleton
        type="text"
        square
        width="50%"
        height="40px"
        animation="fade" />
      <q-skeleton
        type="text"
        square
        width="50%"
        animation="fade" />
    </q-item-section>
    <q-item-section class="data-columns">
      <div
        v-for="i in [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]"
        :key="`detail-${i}`"
        class="col-12 col-md-4">
        <q-skeleton
          type="text"
          square
          height="12px"
          width="40%"
          animation="fade" />
        <q-skeleton
          type="text"
          square
          width="65%"
          animation="fade" />
      </div>
    </q-item-section>
  </q-item>
</template>

<script lang='ts' setup>

</script>

<style lang='scss' scoped>
  .data-columns {
    display: grid;
    grid-template-columns: 1fr;

    @media (min-width: $breakpoint-md-min) {
      grid-template-columns: repeat(3, 1fr);
    }
  }
</style>
