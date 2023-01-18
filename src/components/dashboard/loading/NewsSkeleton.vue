<template>
  <q-item
    v-for="i in [0, 1, 2]"
    :key="`item-${i}`">
    <q-item-section class="q-mb-sm">
      <q-item-section avatar>
        <q-skeleton type="QAvatar" />
      </q-item-section>
      <q-item-section>
        <q-item-label>
          <q-skeleton type="text" />
        </q-item-label>
        <q-item-label caption>
          <q-skeleton
            type="text"
            width="65%" />
        </q-item-label>
      </q-item-section>
    </q-item-section>
  </q-item>
</template>

<script lang='ts' setup>
</script>
