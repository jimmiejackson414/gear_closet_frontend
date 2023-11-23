<script lang='ts' setup>
  import GcLoadingWrapper from '@/components/common/GcLoadingWrapper.vue';
  import GcDrawer from '@/components/common/GcDrawer.vue';
  import GcFooter from '@/components/common/GcFooter.vue';
  import { useUserStore } from '@/stores/user';
  import { useClient } from '@/lib/graphqlRequest';
  import { getSdk } from '@/generated/types';

  const $store = useUserStore();
  const { loading } = storeToRefs($store);

  const client = useClient();
  const sdk = getSdk(client);

  sdk.CurrentUserQuery()
    .then((res) => {
      console.log(res);
    });
</script>

<template>
  <div>
    <gc-loading-wrapper v-if="loading" />
    <div v-else>
      <gc-drawer />
      <div class="min-h-screen">
        <div class="p-4 pl-[72px] pr-9">
          <slot />
        </div>
      </div>
      <gc-footer />
    </div>
  </div>
</template>
