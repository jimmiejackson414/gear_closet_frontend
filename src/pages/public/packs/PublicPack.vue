<template>
  <MainLayout
    minimal-layout
    :page-title="`${friendlyUsername($publicStore.user)}'s Pack`"
    :style="pageStyles">
    <div class="public-pack-container">
      <div class="pack-wrapper">
        <PackWidget
          :data="data"
          :loading="loading"
          :pack-name="$publicStore.pack?.name"
          hide-settings />
      </div>
      <div class="wrapper">
        <q-tabs
          v-model="tab"
          dense
          align="center"
          :breakpoint="0"
          inline-label>
          <q-tab
            name="tables"
            icon="bi-table"
            label="Items" />
          <q-tab
            name="comments"
            icon="bi-chat-dots"
            :label="`Comments (${commentLength})`" />
        </q-tabs>
        <q-tab-panels
          v-model="tab"
          animated
          transition-prev="fade"
          transition-next="fade">
          <q-tab-panel
            name="tables"
            class="q-pt-none">
            <div class="tables-wrapper">
              <div v-if="$publicStore.pack && !loading">
                <span
                  v-for="category in $publicStore.pack.categories"
                  :key="(category!.id as number)">
                  <PublicPackTable :category="(category as Category)" />
                </span>
              </div>
              <div
                v-else
                class="full-width">
                <LoadingTable />
              </div>
            </div>
          </q-tab-panel>
          <q-tab-panel
            name="comments"
            class="q-pt-none">
            <div class="comments-wrapper">
              <q-card class="q-pa-xs box-shadow-light">
                <q-card-section>
                  <span v-if="$publicStore.comments.length && $publicStore.pack?.allow_comments">
                    <Comment
                      v-for="comment in $publicStore.comments"
                      :key="comment?.id"
                      :comment="comment" />
                  </span>
                  <span v-else-if="!$publicStore.pack?.allow_comments">
                    <p class="text-body1 text-weight-bold q-mb-none">
                      Comments are disabled for this pack.
                    </p>
                  </span>
                  <span v-else>
                    <p class="text-body1 text-weight-bold q-mb-none">No comments yet</p>
                  </span>
                </q-card-section>
                <q-card-section v-if="$publicStore.pack?.allow_comments && currentUser">
                  <div class="create-comment-wrapper">
                    <q-editor
                      v-model="editor"
                      :disable="alertDialog.isSubmitting"
                      min-height="5rem"
                      :toolbar="[
                        ['bold', 'italic', 'underline', 'strike'],
                        ['undo', 'redo'],
                      ]" />
                    <div class="row items-center q-mt-md">
                      <q-btn
                        color="primary"
                        label="Submit"
                        :ripple="false"
                        :loading="alertDialog.isSubmitting"
                        :disable="alertDialog.isSubmitting"
                        @click="handleCreateComment">
                        <template #loading>
                          <q-spinner-tail color="white" />
                        </template>
                      </q-btn>
                      <p class="text-body2 q-ml-md q-mb-none">
                        Commenting as <span class="text-weight-bold">{{ friendlyUsername(currentUser) }}</span>
                      </p>
                    </div>
                  </div>
                  <p
                    v-if="!currentUser"
                    class="text-body2">
                    *Note: You must be <router-link
                      to="/login"
                      class="text-primary no-underline">
                      logged in
                    </router-link> to comment.
                  </p>
                </q-card-section>
              </q-card>
            </div>
          </q-tab-panel>
        </q-tab-panels>
      </div>
    </div>
    <AlertDialog
      :is-open="alertDialog.open"
      :title="alertDialog.title"
      :btn-text="alertDialog.btnText"
      :btn-color="alertDialog.btnColor"
      :alert-color="alertDialog.alertColor"
      :is-submitting="alertDialog.isSubmitting"
      :has-cancel-btn="alertDialog.hasCancel"
      @handle-continue="alertDialog.continueCallback"
      @handle-close="alertDialog.open = false">
      <template #content>
        <p class="text-body1 q-mb-none text-weight-bold">
          {{ alertDialog.copy1 }}
        </p>
        <p class="text-body1">
          {{ alertDialog.copy2 }}
        </p>
      </template>
    </AlertDialog>
  </MainLayout>
</template>

<script lang='ts' setup>
  import {
    computed, defineAsyncComponent, onMounted, ref, watchEffect,
  } from 'vue';
  import { useMeta, useQuasar } from 'quasar';
  import { useRoute, useRouter } from 'vue-router';
  import { storeToRefs } from 'pinia';
  import convert from 'convert';
  import round from 'lodash.round';
  import { Category, CreateCommentInput } from '@/generated/types';
  import { calculateCategoryWeight, friendlyUsername } from '@/helpers/functions';
  import { useAppStore } from '@/stores/app';
  import { useUserStore } from '@/stores/user';
  import { usePublicStore } from '@/stores/public';
  import MainLayout from '@/layouts/MainLayout.vue';
  import PackWidget from '@/components/planning/PackWidget.vue';
  import LoadingTable from '@/components/closet/LoadingTable.vue';
  import PublicPackTable from '@/components/publicPack/PublicPackTable.vue';
  import Comment from '@/components/publicPack/Comment.vue';

  const AlertDialog = defineAsyncComponent(() => import('@/components/common/dialogs/AlertDialog.vue'));

  interface MappedData {
    labels: string[] | undefined;
    series: number[] | undefined;
  }

  // local data and instantiations
  const $route = useRoute();
  const $router = useRouter();
  const $store = useUserStore();
  const $appStore = useAppStore();
  const $publicStore = usePublicStore();
  const $q = useQuasar();
  const loading = ref(false);
  const tab = ref('tables');
  const editor = ref('');
  const pageStyles = ref({});
  const data = {
    series: [],
    labels: [],
  } as MappedData;
  const { currentUser } = storeToRefs($store);
  const { alertDialog, publicPack } = storeToRefs($publicStore);

  // set metadata
  const metaData = computed(() => {
    if (!publicPack?.value?.user) return { title: 'Public Pack | Gear Closet' };
    return {
      title: `${friendlyUsername(publicPack.value.user)}'s Pack | Gear Closet`,
    };
  });
  useMeta(() => metaData.value);

  const commentLength = computed(() => {
    const num = $publicStore.comments.reduce((prev, cur) => prev + 1 + cur.replies.length, 0);
    return num.toString();
  });

  // generate mapped data for chart
  const generateMappedData = (): void => {
    const categories = $publicStore.pack?.categories as Category[];

    data.series = categories?.map(category => round(
      convert(calculateCategoryWeight(category as Category), 'mg')
        .to('lb'),
    ));

    data.labels = publicPack?.value
      ? publicPack.value.pack?.categories?.map(category => (category && category.name ? category.name : 'Unnamed'))
      : [];
  };

  const handleCreateComment = async (): Promise<void> => {
    alertDialog.value.isSubmitting = true;

    const input = { text: editor.value, pack_id: publicPack?.value?.pack?.id } as CreateCommentInput;
    const response = await $publicStore.createComment(input);

    if (response.comment && !response.errors) {
      editor.value = '';
    } else {
      $appStore.notifyNegative('Failed to create comment');
    }

    alertDialog.value.isSubmitting = false;
  };

  onMounted(async () => {
    loading.value = true;

    const input = { slug: $route.params.slug as string };
    await $publicStore.fetchPublicPack(input);

    if (publicPack?.value?.pack?.private) {
      $publicStore.setAlertDialog({
        open: true,
        title: 'Private Pack',
        btnText: 'Continue',
        btnColor: 'primary',
        copy1: 'This pack is currently set to private.',
        copy2: 'Please ask the pack list owner to make this public.',
        hasCancel: false,
        isSubmitting: false,
        continueCallback: () => {
          $router.go(-1);
        },
      });
      return;
    }

    if (publicPack?.value?.pack && publicPack.value.user && !publicPack.value.pack.private) {
      generateMappedData();
    }

    loading.value = false;
  });

  watchEffect(() => {
    if ($q.screen.xs) {
      pageStyles.value = {
        paddingLeft: '0',
      };
    } else {
      pageStyles.value = {
        paddingLeft: '57px',
      };
    }
  });
</script>

<style lang='scss' scoped>
  .public-pack-container {
    max-width: 1000px;
    margin: 3rem auto 0;

    .pack-wrapper {
      max-width: 750px;
      margin: 0 auto 2rem;
    }

    .q-tab {
      border-radius: 1rem;
    }

    .q-separator {
      max-width: 750px;
      margin: 0 auto;
    }

    .q-tab-panels {
      background: none;

      .tables-wrapper,
      .comments-wrapper {
        max-width: 750px;
        margin: 0 auto;
        padding: 0 0 2rem;
      }
    }
  }

</style>
