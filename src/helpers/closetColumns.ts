import { QTableProps } from 'quasar';

export const columns = [
  {
    name: 'drag', label: '', field: 'drag', align: 'left', sortable: false, style: 'width: 40px',
  },
  {
    name: 'generic_type', label: 'Description', field: 'generic_type', align: 'left', sortable: true,
  },
  {
    name: 'name', label: 'Name', field: 'name', align: 'left', sortable: true,
  },
  {
    name: 'consumable', label: 'Consumable', field: 'consumable', align: 'center', sortable: true,
  },
  {
    name: 'worn', label: 'Worn', field: 'worn', align: 'center', sortable: true,
  },
  {
    name: 'weight', label: 'Weight', field: 'weight', align: 'center', sortable: true,
  },
  {
    name: 'price', label: 'Price', field: 'price', align: 'center', sortable: true,
  },
  {
    name: 'quantity', label: 'Quantity', field: 'quantity', align: 'center', sortable: true,
  },
  {
    name: 'actions', label: 'Actions', field: 'actions', align: 'right', sortable: false,
  },
] as QTableProps['columns'];

export const publicColumns = [
  {
    name: 'generic_type', label: 'Description', field: 'generic_type', align: 'left',
  },
  {
    name: 'name', label: 'Name', field: 'name', align: 'left',
  },
  {
    name: 'consumable', label: 'Consumable', field: 'consumable', align: 'center',
  },
  {
    name: 'worn', label: 'Worn', field: 'worn', align: 'center',
  },
  {
    name: 'weight', label: 'Weight', field: 'weight', align: 'center',
  },
  {
    name: 'price', label: 'Price', field: 'price', align: 'center',
  },
  {
    name: 'quantity', label: 'Quantity', field: 'quantity', align: 'center',
  },
] as QTableProps['columns'];
