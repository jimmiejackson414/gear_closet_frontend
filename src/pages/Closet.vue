<template>
  <MainLayout>
    <ItemsDrawer />
    <div class="container container-sm">
      <div class="actions-row q-my-lg justify-between items-center">
        <q-btn
          flat
          icon="bi-chevron-double-right"
          color="primary"
          class="view-all-btn"
          @click="store.toggleItemsDrawer">
          <q-tooltip>
            View all items
          </q-tooltip>
        </q-btn>
        <q-select
          v-model="selectedPack"
          :options="packs"
          label="Selected Pack"
          outlined
          dense
          dropdown-icon="bi-chevron-down"
          class="packs-dropdown"
          option-label="name"
          :loading="loadingData"
          @update:model-value="handleChangePack">
          <template #no-option>
            <q-item>
              <q-item-section class="text-grey">
                Create your first Pack!
              </q-item-section>
            </q-item>
          </template>
        </q-select>
        <q-btn
          label="New pack"
          :ripple="false"
          color="secondary"
          icon="bi-plus"
          class="q-pl-sm new-pack-btn"
          @click="isCreatePackModalOpen = true" />
        <q-btn
          class="closet-settings q-ml-md"
          round
          color="grey-4"
          size="sm"
          text-color="text"
          unelevated
          :ripple="false"
          icon="bi-gear-fill">
          <q-menu>
            <q-list style="min-width: 100px;">
              <q-item
                v-close-popup
                clickable
                @click="sharePackDialog.visible = true">
                <q-item-section>
                  Share pack list
                </q-item-section>
              </q-item>
              <q-item
                v-close-popup
                clickable
                @click="csvImportDialog.visible = true">
                <q-item-section>
                  Import from CSV
                </q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </div>
      <div v-if="selectedPack">
        <div class="row q-mb-lg q-col-gutter-lg">
          <PackSummary v-if="!loadingData" />
          <LoadingTable v-else />
        </div>
        <div class="row">
          <div class="col-12 pack-details-header">
            <h6 class="text-h6 q-ma-none">
              Pack Details
            </h6>
            <q-btn
              id="new-category-btn"
              :ripple="false"
              color="primary"
              @click="handleCreateCategory">
              <q-icon name="bi-plus" />
              New category
            </q-btn>
          </div>
        </div>
        <div class="row q-mb-lg">
          <div
            v-if="!loadingData && selectedPack"
            class="tables-wrapper">
            <CategoryTable
              v-for="category in selectedPack.categories"
              :key="category!.id"
              :category="category!"
              @handle-item-link="itemLinkDialog.visible = true"
              @handle-remove-item="handleRemoveItem" />
          </div>
          <div
            v-else
            class="full-width">
            <LoadingTable />
          </div>
        </div>
      </div>
      <div v-else>
        <div class="row">
          <div class="col-12 col-sm-6 offset-sm-3 text-center">
            <h6 class="text-h6 q-ma-none">
              Create your first Pack!
            </h6>
            <p class="text-body1">
              Click on the green "New Pack" button to get started.
            </p>
            <img
              src="/images/mountains_abstract-min.png"
              class="no-packs-img"
              alt="Mountains">
          </div>
        </div>
      </div>
    </div>
    <CreatePackDialog
      :is-open="isCreatePackModalOpen"
      @handle-close="isCreatePackModalOpen = false" />
    <ConfirmRemoveItemDialog
      :is-open="confirmRemoveDialog.visible"
      @handle-close="confirmRemoveDialog.visible = false"
      @handle-remove="handleRemoveItem" />
    <ConfirmDeleteCategoryDialog
      :is-open="confirmRemoveCategoryDialog.visible"
      @handle-close="confirmRemoveCategoryDialog.visible = false"
      @handle-delete="handleDeleteCategory" />
    <ItemLinkDialog
      :is-open="itemLinkDialog.visible"
      @handle-close="handleCloseItemLinkDialog" />
    <CsvImportDialog
      :is-open="csvImportDialog.visible"
      @handle-update="handleCsvImport"
      @handle-close="csvImportDialog.visible = false" />
    <SharePackListDialog
      :is-open="sharePackDialog.visible"
      @handle-close="sharePackDialog.visible = false" />
    <Walkthrough
      :steps="closetSteps(finishWalkthrough)"
      :trigger-start="startWalkthrough" />
  </MainLayout>
</template>

<script lang='ts' setup>
  import {
    ref, onMounted, defineAsyncComponent, watch,
  } from 'vue';
  import { Cookies, useMeta } from 'quasar';
  import { storeToRefs } from 'pinia';
  import { useClosetStore } from '@/stores/closet';
  import { useUserStore } from '@/stores/user';
  import MainLayout from '@/layouts/MainLayout.vue';
  import { Category, Pack } from '@/generated/types';
  import { closetSteps } from '@/helpers/walkthroughSteps';
  import { decrypt, encrypt } from '@/helpers/encryption';
  import CategoryTable from '@/components/closet/CategoryTable.vue';
  import LoadingTable from '@/components/closet/LoadingTable.vue';
  import PackSummary from '@/components/closet/PackSummary.vue';
  import { completedOnboarding } from '@/helpers/functions';

  const CsvImportDialog = defineAsyncComponent(() => import('@/components/closet/dialogs/CsvImportDialog.vue'));
  const ConfirmDeleteCategoryDialog = defineAsyncComponent(() => import('@/components/closet/dialogs/ConfirmDeleteCategoryDialog.vue'));
  const ConfirmRemoveItemDialog = defineAsyncComponent(() => import('@/components/closet/dialogs/ConfirmRemoveItemDialog.vue'));
  const CreatePackDialog = defineAsyncComponent(() => import('@/components/closet/dialogs/CreatePackDialog.vue'));
  const ItemLinkDialog = defineAsyncComponent(() => import('@/components/closet/dialogs/ItemLinkDialog.vue'));
  const ItemsDrawer = defineAsyncComponent(() => import('@/components/closet/ItemsDrawer.vue'));
  const SharePackListDialog = defineAsyncComponent(() => import('@/components/closet/dialogs/SharePackListDialog.vue'));
  const Walkthrough = defineAsyncComponent(() => import('@/components/Walkthrough.vue'));

  // metadata
  const metaData = {
    title: 'Closet | Gear Closet',
  };
  useMeta(metaData);

  // local data
  const isCreatePackModalOpen = ref(false);
  const loadingData = ref(false);
  const startWalkthrough = ref(false);

  const rows = ref<Category[]>([]);

  // store
  const store = useClosetStore();
  const userStore = useUserStore();
  const {
    csvImportDialog, confirmRemoveDialog, confirmRemoveCategoryDialog, itemLinkDialog, sharePackDialog, selectedPack, packs,
  } = storeToRefs(store);
  const { currentUser } = storeToRefs(userStore);

  // change pack
  const handleChangePack = async (pack: Pack): Promise<void> => {
    loadingData.value = true;

    const encrypted = encrypt(pack.id);
    Cookies.set('gc.selected_pack', encrypted);

    await store.fetchPackData(pack.id as number);
    loadingData.value = false;
  };

  // remove item
  const handleRemoveItem = async (): Promise<void> => {
    confirmRemoveDialog.value.visible = false;
    await store.removeItem();
  };

  // delete category
  const handleDeleteCategory = async (): Promise<void> => {
    confirmRemoveCategoryDialog.value.visible = false;
    await store.deleteCategory(confirmRemoveCategoryDialog.value.selectedCategory as number);
  };

  // create category
  const handleCreateCategory = async (): Promise<void> => {
    await store.createCategory();
  };

  const handleCloseItemLinkDialog = (): void => {
    itemLinkDialog.value.visible = false;
    itemLinkDialog.value.selectedItem = null;
  };

  const handleCsvImport = async (data: any): Promise<void> => {
    const payload = { data: data.content, pack_id: null as number | null };
    if (data.addToPack) payload.pack_id = selectedPack.value!.id as number;
    await store.handleCsvImport(payload);
    csvImportDialog.value.visible = false;
  };

  const finishWalkthrough = (): void => {
    startWalkthrough.value = false;
    const input = {
      page: 'closet',
    };
    userStore.createOnboardingStep(input);
  };

  // on mount
  onMounted(() => {
    const cookie = Cookies.get('gc.selected_pack');
    const remembered = JSON.parse(localStorage.getItem('gc.confirmRemove') || 'false');

    if (remembered) {
      confirmRemoveDialog.value.remember = true;
    }

    if (cookie) {
      const decrypted = decrypt(cookie);
      return store.fetchPageData(Number(decrypted));
    }

    return store.fetchPageData();
  });

  // watch for a new selectedPack
  watch(
    () => selectedPack.value,
    (newVal) => {
      if (newVal) {
        rows.value = newVal.categories as Category[];
      }
    },
  );

  watch(() => currentUser.value, () => {
    if (!(completedOnboarding(currentUser.value, 'closet'))) {
      startWalkthrough.value = true;
    }
  });
</script>

<style lang="scss" scoped>
  .actions-row {
    display: grid;
    grid-template-columns: 1fr auto auto;
    grid-template-rows: auto auto;
    grid-gap: 1rem 0.5rem;

    .view-all-btn {
      justify-self: start;
      grid-column: 1 / 1;
    }

    .packs-dropdown {
      min-width: 150px;
      grid-column: 1 / span 3;
      grid-row: 2;
      margin-right: 0;
    }

    @media screen and (min-width: $breakpoint-sm-max) {
      grid-template-columns: 1fr repeat(3, auto);
      grid-template-rows: auto;
      grid-gap: 1rem;

      .view-all-btn {
        grid-column: 1 / 1;
      }

      .packs-dropdown {
        grid-column: 2 / 2;
        grid-row: 1;
      }

      .new-pack-btn {
        grid-column: 3 / 3;
      }

      .closet-settings {
        grid-column: 4 / 4;
      }
    }
  }

  .pack-details-header {
    align-items: center;
    display: flex;
    justify-content: space-between;
    margin-bottom: 1rem;
    margin-top: 2rem;
  }

  .tables-wrapper {
    width: 100%;
  }

  .no-packs-img {
    border-radius: 3rem;
    margin-top: 1rem;
    max-width: 100%;
  }
</style>
