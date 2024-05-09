<script lang='ts' setup>
  import { InfoIcon } from 'lucide-vue-next';

  const $store = useClosetStore();
  const { dialogStates } = storeToRefs($store);
  const removeItemCheckbox = ref(false);
  const activeCategoryId = ref<number | undefined>(undefined);
  const submitting = ref(false);

  const handleSubmit = async () => {
    submitting.value = true;
    // await $store.removeCategory(activeCategoryId.value, removeItemCheckbox.value);
    submitting.value = false;
    dialogStates.value.deleteCategoryDialog = false;
  };
</script>

<template>
  <gc-modal
    :is-open="dialogStates.deleteCategoryDialog"
    title="Remove Category from Pack"
    @handle-cancel="[ dialogStates.deleteCategoryDialog = false, removeItemCheckbox = false, activeCategoryId = undefined ]">
    <template #content>
      <div>
        <p class="font-bold mb-0 text-base">
          Are you sure you want to remove this category from this pack?
        </p>
        <p class="!font-bold mb-4 text-base text-danger">
          This action cannot be undone!
        </p>
      </div>
      <div class="flex items-center gap-4">
        <gc-checkbox
          id="remove-item-checkbox"
          v-model="removeItemCheckbox"
          label="Remove items from closet?" />
        <info-icon
          v-tippy="{ content: 'Checking this will remove all items from the category as well as your closet.' }"
          class="h-4 w-4" />
      </div>
    </template>
    <template #actions>
      <gc-button
        :disabled="submitting"
        label="Cancel"
        size="sm"
        variant="secondary"
        @click="dialogStates.deleteCategoryDialog = false" />
      <gc-button
        :disabled="submitting"
        label="Remove Category"
        :loading="submitting"
        size="sm"
        variant="danger"
        @click="handleSubmit" />
    </template>
  </gc-modal>
</template>
