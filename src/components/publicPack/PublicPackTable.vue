<template>
  <q-table
    class="category-table box-shadow-light"
    :rows="rows"
    :columns="publicColumns"
    row-key="name"
    flat
    hide-selected-banner
    hide-pagination
    separator="horizontal"
    virtual-scroll
    :rows-per-page="[0]">
    <template #top-left>
      <h6 class="text-h6 q-ma-none">
        {{ category.name || 'Unnamed Category' }}
      </h6>
    </template>
    <template #header="props">
      <q-tr :props="props">
        <q-th
          v-for="col in props.cols"
          :key="col.name"
          :props="props">
          {{ col.label }}
        </q-th>
      </q-tr>
    </template>
    <template #body="props">
      <q-tr :props="props">
        <!-- Generic Type -->
        <q-td>
          {{ props.row.generic_type }}
        </q-td>
        <!-- Name -->
        <q-td>
          <a
            v-if="props.row.url"
            :href="props.row.url"
            target="_blank">
            {{ props.row.name }}
          </a>
          <span v-else>{{ props.row.name }}</span>
        </q-td>
        <!-- Consumable -->
        <q-td class="consumable-wrapper text-center">
          <q-btn
            round
            size="sm"
            :ripple="false"
            :class="{ active: props.row.consumable }"
            disable>
            <span class="material-icons">
              restaurant
            </span>
          </q-btn>
        </q-td>
        <!-- Worn -->
        <q-td

          class="worn-wrapper text-center">
          <q-btn
            round
            size="sm"
            :ripple="false"
            :class="{ active: props.row.worn }"
            disable>
            <span class="material-icons">
              checkroom
            </span>
          </q-btn>
        </q-td>
        <!-- Weight -->
        <q-td>
          {{ props.row.weight }} {{ props.row.unit }}
        </q-td>
        <!-- Price -->
        <q-td>
          {{ convertCurrency(props.row.price ) }}
        </q-td>
        <!-- Quantity -->
        <q-td>
          {{ props.row.quantity }}
        </q-td>
      </q-tr>
    </template>
    <template #bottom-row>
      <q-tr class="totals-row">
        <q-td
          colspan="4"
          class="text-left">
          <p class="text-body2 text-weight-bold q-mb-none">
            Totals
          </p>
        </q-td>
        <q-td
          colspan="1"
          class="text-center flex items-center justify-center">
          <p class="text-body2 text-weight-bold q-mb-none">
            {{ computedWeightTotal }} {{ tableProps.category.unit }}
          </p>
        </q-td>
        <q-td
          colspan="1"
          class="text-center">
          <p class="text-body2 text-weight-bold q-mb-none">
            {{ computedPriceTotal }}
          </p>
        </q-td>
        <q-td
          colspan="1"
          class="text-center">
          <p class="text-body2 text-weight-bold q-mb-none">
            {{ computedQuantityTotal }}
          </p>
        </q-td>
      </q-tr>
    </template>
  </q-table>
</template>

<script lang='ts' setup>
  import { computed, ref, watchEffect } from 'vue';
  import convert, { Mass } from 'convert';
  import { Category, Item } from '@/generated/types';
  import { publicColumns } from '@/helpers/closetColumns';
  import {
    calculateCategoryPrice, calculateCategoryQuantity, calculateCategoryWeight, convertCurrency,
  } from '@/helpers/functions';

  const tableProps = defineProps<{
    category: Category;
  }>();

  const rows = ref<Item[]>([]);

  const computedWeightTotal = computed(() => {
    const total = calculateCategoryWeight(tableProps.category);
    return convert(total, 'mg')
      .to(tableProps.category.unit as Mass)
      .toFixed(2);
  });

  const computedPriceTotal = computed(() => {
    const total = (calculateCategoryPrice(tableProps.category) / 100);
    return total.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
    });
  });

  const computedQuantityTotal = computed(() => {
    const total = calculateCategoryQuantity(tableProps.category);
    return total;
  });

  watchEffect(() => {
    const items = tableProps.category.category_items.map(categoryItem => ({
      ...categoryItem?.item,
      position: categoryItem ? categoryItem.position : 0,
    }));
    rows.value = items as Item[];
  });
</script>

<style lang='scss' scoped>
  .category-table {
    border-radius: 1rem;
    margin-bottom: 2rem;

    h6 {
      color: $text;
    }

    thead {
      tr {
        th {
          font-weight: bold;
        }
      }
    }

    /* stylelint-disable-next-line no-descending-specificity */
    tr {
      td {
        border-bottom-width: 1px;
      }

      &.totals-row {
        td {
          border-bottom-width: 0;
        }
      }

      .consumable-wrapper {
        .q-btn {
          &.active {
            background-color: $light-blue-3;
          }
        }
      }

      .worn-wrapper {
        .q-btn {
          &.active {
            background-color: $deep-orange-2;
          }
        }
      }
    }

    .material-icons {
      font-size: 1rem;
    }

    /* stylelint-disable-next-line selector-class-pattern */
    .q-table__bottom {
      border-top: none;
    }
  }
</style>
