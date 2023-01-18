<template>
  <MainLayout :page-title="pageTitle">
    <div class="container container-sm">
      <div class="row">
        <div class="col-xs-12 col-md-8 offset-md-2">
          <div class="row search-row q-mb-lg">
            <div class="col-xs-12">
              <q-input
                v-model="search"
                outlined
                dense
                label="Search"
                type="search"
                clear-icon="bi-x"
                clearable
                class="search-input full-width"
                @keydown.enter="performSearch">
                <template #prepend>
                  <q-icon
                    name="bi-person-circle"
                    size="sm" />
                </template>
                <template #append>
                  <q-btn
                    size="sm"
                    flat
                    rounded
                    :ripple="false"
                    color="primary"
                    icon-right="bi-search"
                    @click.prevent="performSearch" />
                </template>
              </q-input>
            </div>
          </div>
          <q-card class="q-pa-xs box-shadow-light">
            <q-card-section v-if="pageLoading">
              <FriendSkeleton />
            </q-card-section>
            <q-card-section v-else-if="!pageLoading && !results.length">
              <q-item>
                <q-item-section>
                  <q-item-label class="text-body1">
                    No results found.
                  </q-item-label>
                </q-item-section>
              </q-item>
            </q-card-section>
            <q-card-section v-else>
              <div class="header">
                <div class="left">
                  <q-icon
                    name="bi-people-fill"
                    color="primary"
                    size="sm" />
                  <p class="text-body1 title q-ml-lg q-mb-none">
                    Search Results
                  </p>
                </div>
                <p class="text-subtitle2 count text-grey-6 q-mb-none">
                  Displaying <span class="text-weight-bolder">{{ results?.length || 0 }}</span> of <span class="text-weight-bolder">{{ resultCount }}</span>
                </p>
              </div>
              <q-list>
                <Result
                  v-for="result in results"
                  :key="result.id"
                  :result="result"
                  :loading="actionLoading"
                  @add-connection="handleAddConnection"
                  @remove-invitation="handleRemoveInvitation" />
              </q-list>
              <div class="row justify-end q-mt-md" />
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<script lang='ts' setup>
  import {
    computed, onMounted, ref, watch,
  } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { storeToRefs } from 'pinia';
  import { useSearchStore } from '@/stores/search';
  import MainLayout from '@/layouts/MainLayout.vue';
  import FriendSkeleton from '@/components/planning/loading/FriendSkeleton.vue';
  import Result from '@/components/search/Result.vue';
  import { User } from '@/generated/types';

  const route = useRoute();
  const router = useRouter();
  const $store = useSearchStore();

  const search = ref('');
  const actionLoading = ref(false);
  const { results, resultCount, pageLoading } = storeToRefs($store);

  const pageTitle = computed((): string => `Search: ${route.query.q}`);

  const fetchResults = async (val: string): Promise<void> => {
    await $store.fetchSearchResults(val);
  };

  const performSearch = async (): Promise<void> => {
    router.push({
      name: 'friends_search',
      query: { q: search.value },
    });
    await fetchResults(search.value);
    search.value = '';
  };

  const handleAddConnection = async (result: User): Promise<void> => {
    actionLoading.value = true;
    await $store.addConnection(result.id);
    actionLoading.value = false;
  };

  const handleRemoveInvitation = async (result: User): Promise<void> => {
    actionLoading.value = true;
    await $store.removeInvitation(result.id);
    actionLoading.value = false;
  };

  onMounted(() => {
    fetchResults(route.query.q as string);
  });

  watch(() => route.query, () => {
    fetchResults(route.query.q as string);
  });
</script>

<style lang="scss" scoped>
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 2rem;

    .left {
      display: flex;
      align-items: center;
    }
  }
</style>
