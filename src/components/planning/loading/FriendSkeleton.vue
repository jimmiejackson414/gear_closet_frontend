<template>
  <q-item>
    <q-item-section avatar>
      <q-skeleton
        type="QAvatar"
        animation="fade" />
    </q-item-section>
    <q-item-section>
      <q-item-label>
        <q-skeleton
          type="text"
          animation="fade" />
      </q-item-label>
      <q-item-label caption>
        <q-skeleton
          animation="fade"
          type="text"
          width="80%" />
      </q-item-label>
    </q-item-section>
  </q-item>
</template>

<script lang="ts" setup></script>
