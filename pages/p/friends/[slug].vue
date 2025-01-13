<script lang='ts' setup>
  // const user = useSupabaseUser();
  // definePageMeta({ layout: 'public-layout', colorMode: !user.value ? 'light' : undefined, public: true });
  definePageMeta({ layout: 'public-layout', colorMode: 'light', public: true });

  // update to be dynamic with friend's name
  useHead({ title: 'Friend '});
</script>

<template>
  <div>
    Public Friends Page
  </div>
</template>
