<script lang="ts" setup>
  import { toValue } from 'vue';
  import { ErrorMessage } from 'vee-validate';
  import { useFormField } from './useFormField';

  const { formMessageId, name } = useFormField();
</script>

<template>
  <error-message
    :id="formMessageId"
    as="p"
    class="text-sm font-medium text-destructive"
    :name="toValue(name)" />
</template>
