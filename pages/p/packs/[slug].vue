<script lang='ts' setup>
  import type { Database } from '@/types';
  import type { ExtendedPack } from '@/types/helpers';

  definePageMeta({ layout: 'public-layout' });

  const $appStore = useAppStore();

  /**
   * Fetches the pack data.
   */
  const $route = useRoute();
  const pack = ref<ExtendedPack | undefined>(undefined);
  const fetchPack = async () => {
    try {
      const supabase = useSupabaseClient<Database>();
      const { data: fetchedPack, error } = await supabase
        .from('packs')
        .select(
          `
          *,
          categories(*,
            category_items(*,
              item:item_id(*)
            )
          )
        `,
        )
        .eq('slug', $route.params.slug)
        .returns<ExtendedPack | undefined>()
        .maybeSingle();
      if (error) throw error;
      if (!fetchedPack) throw new Error('No pack data found');
      pack.value = fetchedPack;
    } catch (error) {
      $appStore.notifyNegative('Failed to fetch pack data');
    }
  };
  await fetchPack();
</script>

<template>
  <div>
    <!-- 1A. If pack is not private, show pack data  -->
    <div v-if="!pack?.private">
      Pack data

      <!-- 2A. If comments are enabled, show the comments tab. -->
      <div v-if="pack?.allow_comments">
        Comments tab
      </div>

      <!-- 2B. Otherwise, show the comments tab disabled with a tooltip that says comments are disabled. -->
      <div v-else>
        Comments tab disabled
      </div>
    </div>

    <!-- 1B. Otherwise, show fake chart and data with blur, and message that says this pack is set to private.. -->
    <div v-else>
      This pack is private
    </div>
  </div>
</template>
