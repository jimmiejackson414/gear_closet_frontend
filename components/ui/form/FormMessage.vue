<script lang="ts" setup>
  import { ErrorMessage } from 'vee-validate';
  import { toValue } from 'vue';
  import { useFormField } from './useFormField';

  const { name, formMessageId } = useFormField();
</script>

<template>
  <error-message
    :id="formMessageId"
    as="p"
    class="font-medium text-destructive text-sm"
    :name="toValue(name)" />
</template>
