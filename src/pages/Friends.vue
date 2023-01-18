<template>
  <MainLayout>
    <div class="container container-sm q-mt-xl">
      <div class="row">
        <div class="col-xs-12 col-md-10 offset-md-1">
          <div class="row search-row q-mb-lg items-center justify-between">
            <div class="col-xs-12 col-md-8">
              <q-input
                v-model="search"
                outlined
                dense
                label="Search for new friends"
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
          <div class="row q-col-gutter-lg">
            <div class="col-xs-12 col-md-8">
              <FriendsList :loading="pageLoading" />
            </div>
            <div class="col-xs-12 col-md-4">
              <Suggestions />
            </div>
          </div>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<script lang='ts' setup>
  import { onMounted, ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { storeToRefs } from 'pinia';
  import { useFriendsStore } from '@/stores/friends';
  import MainLayout from '@/layouts/MainLayout.vue';
  import Suggestions from '@/components/friends/Suggestions.vue';
  import FriendsList from '@/components/friends/FriendsList.vue';
  import { FriendsQueryInput } from '@/generated/types';

  const $store = useFriendsStore();
  const router = useRouter();

  const search = ref('');
  const page = ref(1);
  const size = ref(20);
  const sortBy = ref('asc');
  const orderBy = ref('email');

  const { pageLoading } = storeToRefs($store);

  const performSearch = async (): Promise<void> => {
    router.push({
      name: 'friends_search',
      query: {
        q: search.value,
      },
    });
  };

  onMounted(async () => {
    const input: FriendsQueryInput = {
      size: size.value,
      page: page.value,
      orderBy: orderBy.value,
      sortOptions: {
        ascending: sortBy.value === 'asc',
        foreignTable: 'user',
      },
    };
    await $store.fetchFriends(input);
  });
</script>

<style lang="scss" scopeds>
  .search-row {
    .search-input {
      min-width: 300px;
    }
  }
</style>
