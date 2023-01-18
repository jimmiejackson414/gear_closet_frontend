/* eslint-disable camelcase */
import { defineStore } from 'pinia';
import { useClient } from '@/lib/graphqlRequest';
import {
  Category, CreatePackInput, CsvImportInput, getSdk, Item, Pack, UpdateCategoryInput, UpdateItemInput, UpdatePackInput,
} from '@/generated/types';
import { encrypt } from '@/helpers/encryption';
import { Cookies } from 'quasar';

type State = {
  allItems: Item[];
  allItemsCacheTimer: number;
  packs: Pack[];
  loading: boolean;
  loadingError: boolean;
  selectedPack: Pack | null;
  itemsDrawerOpen: boolean;
  csvImportDialog: {
    visible: boolean;
  },
  confirmRemoveDialog: {
    visible: boolean;
    selectedCategory: number | null;
    selectedItem: number | null;
    remember: boolean;
  }
  confirmRemoveCategoryDialog: {
    visible: boolean;
    selectedCategory: number | null;
  }
  itemLinkDialog: {
    visible: boolean;
    selectedItem: Item | null;
  },
  sharePackDialog: {
    visible: boolean;
  }
}

type Getters = {
  //
};

type Actions = {
  addItemToCategory: (categoryId: number, itemId: number) => Promise<void>;
  createCategory: () => Promise<void>;
  createItem: (category_id: number) => Promise<void>;
  createPack: (input: CreatePackInput) => Promise<boolean>;
  deleteCategory: (id: number) => Promise<void>;
  deleteItem: (id: number) => Promise<void>;
  fetchAllItems(): Promise<void> | Item[];
  fetchPackData(packId: number): void;
  fetchPageData(packId?: number): void;
  handleCsvImport(input: CsvImportInput): Promise<void>;
  removeItem(): Promise<void>;
  toggleConfirmRemoveDialog(): void;
  toggleItemsDrawer(): void;
  updateCategory({ id, input }: { id: number, input: UpdateCategoryInput }): void;
  updateItem({ id, input }: { id: number, input: UpdateItemInput }): void;
  updatePack(id: number, input: UpdatePackInput): Promise<void>;
}

export const useClosetStore = defineStore<'closet', State, Getters, Actions>('closet', {
  state () {
    return {
      allItems: [],
      allItemsCacheTimer: 0,
      packs: [],
      loading: false,
      loadingError: false,
      selectedPack: null,
      itemsDrawerOpen: false,
      csvImportDialog: {
        visible: false,
      },
      confirmRemoveDialog: {
        visible: false,
        selectedCategory: null,
        selectedItem: null,
        remember: false,
      },
      confirmRemoveCategoryDialog: {
        visible: false,
        selectedCategory: null,
      },
      itemLinkDialog: {
        visible: false,
        selectedItem: null,
      },
      sharePackDialog: {
        visible: false,
      },
    };
  },

  getters: {},

  actions: {
    async addItemToCategory (categoryId, itemId) {
      const client = useClient();
      const sdk = getSdk(client);

      try {
        const payload = { input: { category_id: categoryId, item_id: itemId } };
        const { createCategoryItem } = await sdk.CreateCategoryItem(payload);

        if (createCategoryItem.category_item && !createCategoryItem.errors) {
          const index = this.selectedPack!.categories!.findIndex(category => category!.id === categoryId);
          this.selectedPack!.categories![index]!.category_items!.push(createCategoryItem.category_item);
        }
      } catch (e) {
        console.error(e);
      }
    },

    async createCategory () {
      const client = useClient();
      const sdk = getSdk(client);

      try {
        const input = {
          name: 'New Category',
          pack_id: this.selectedPack!.id as number,
          unit: 'lb',
        };

        const { createCategory } = await sdk.CreateCategory({ input });

        if (createCategory?.category && !createCategory.errors) {
          if (this.selectedPack?.categories?.length) {
            this.selectedPack!.categories.unshift(createCategory.category);
          } else {
            this.selectedPack!.categories = [createCategory.category];
          }
        }
      } catch (err) {
        console.error(err);
      }
    },

    async createItem (category_id) {
      const client = useClient();
      const sdk = getSdk(client);

      const input = {
        name: 'New item',
        generic_type: 'Type',
        url: null,
        price: 0,
        consumable: false,
        worn: false,
        quantity: 0,
        unit: 'oz',
        weight: '0',
      };

      // initial attempt at optimistic create
      // const category_item = {
      //   id: -1,
      //   category_id,
      //   item_id: -1,
      //   item: input,
      // };

      // const foundCategory = this.selectedPack?.categories?.find(category => category!.id === category_id);
      // if (foundCategory) {
      //   foundCategory?.category_items.push(category_item);
      // }

      try {
        const payload = { category_id, input: { ...input } };
        const { createItem } = await sdk.CreateItem(payload);

        if (createItem?.category_item && !createItem.errors) {
          const foundCategory = this.selectedPack?.categories?.find(category => category!.id === category_id);
          if (foundCategory) {
            foundCategory?.category_items.push(createItem.category_item);
          }
        }
      } catch (err) {
        console.error(err);
      }
    },

    async createPack (input) {
      const client = useClient();
      const sdk = getSdk(client);

      try {
        const { createPack } = await sdk.CreatePack({ input });

        if (createPack?.pack && !createPack.errors) {
          this.packs.unshift(createPack.pack);
          return true;
        }
        return false;
      } catch (err) {
        return false;
      }
    },

    async deleteCategory (id) {
      const client = useClient();
      const sdk = getSdk(client);

      try {
        const payload = { id };
        const { deleteCategory } = await sdk.DeleteCategory(payload);

        if (deleteCategory?.category && !deleteCategory.errors) {
          const index = this.selectedPack!.categories!.findIndex(category => category!.id === id);
          if (index !== -1) {
            this.selectedPack!.categories?.splice(index, 1);
          }
        }
      } catch (err) {
        console.error(err);
      }
    },

    async deleteItem (id) {
      const client = useClient();
      const sdk = getSdk(client);

      try {
        const payload = { input: { id } };
        const { deleteItem } = await sdk.DeleteItem(payload);

        if (deleteItem?.item && !deleteItem.errors) {
          // remove from allItems array
          this.allItems.splice(this.allItems.findIndex(item => item?.id === deleteItem.item?.id), 1);

          // remove from categor(ies)
          this.selectedPack?.categories?.forEach(category => {
            category?.category_items.splice(category.category_items.findIndex(catItem => catItem?.id === deleteItem.item?.id), 1);
          });
        }
      } catch (err) {
        console.error(err);
      }
    },

    async fetchAllItems () {
      // return cached data if it's less than 2 minute old
      if (this.allItemsCacheTimer <= 120000 && this.allItems.length) {
        this.allItemsCacheTimer = 0;
        return;
      }

      // start timer to cache data
      if (this.allItemsCacheTimer === 0) {
        setInterval(() => {
          this.allItemsCacheTimer += 1000;
        }, 1000);
      }

      const client = useClient();
      const sdk = getSdk(client);

      try {
        const { allItems } = await sdk.AllItems();

        if (allItems?.items && !allItems.errors) {
          this.allItems = allItems.items as Item[] || [];
        }
      } catch (err) {
        console.error(err);
      }
    },

    async fetchPackData (packId) {
      const client = useClient();
      const sdk = getSdk(client);

      try {
        const payload = { input: { id: packId } };
        const { pack } = await sdk.Pack(payload);

        if (pack?.pack && !pack.errors) {
          this.selectedPack = pack.pack;
        }
      } catch (error) {
        this.loadingError = true;
      }
    },

    async fetchPageData (packId) {
      const client = useClient();
      const sdk = getSdk(client);

      this.loading = true;
      this.loadingError = false;

      try {
        const payload = { input: { pack_id: packId } };
        const { closet } = await sdk.ClosetPage(payload);

        if (closet && !closet.errors) {
          this.packs = closet.packs as Pack[];
          this.selectedPack = closet.selectedPack as Pack | null;

          const encrypted = encrypt(closet.selectedPack?.id);
          Cookies.set('gc.selected_pack', encrypted);

          this.loading = false;
        } else {
          this.loadingError = true;
          this.loading = false;
        }
      } catch (e) {
        this.loadingError = true;
        this.loading = false;
      }
    },

    async handleCsvImport (payload) {
      const client = useClient();
      const sdk = getSdk(client);

      const data = payload.data.map(p => ({
        name: p.name,
        description: p.description,
        quantity: Number(p.quantity),
        weight: String(p.weight),
        unit: p.unit,
        url: p.url,
        price: Number(p.price),
        worn: Boolean(p.worn),
        consumable: Boolean(p.consumable),
        category_name: p.category_name,
        item_name: p.item_name,
        desc: p.desc,
        qty: Number(p.qty),
      }));
      const input = { data, pack_id: payload.pack_id };
      const { csvImport } = await sdk.CsvImport({ input });

      if (csvImport?.success && !csvImport.errors) {
        this.selectedPack = csvImport.pack as Pack;
      }
    },

    async removeItem () {
      const client = useClient();
      const sdk = getSdk(client);

      try {
        // optimistic delete
        const foundCategory = this.selectedPack?.categories?.find(category => category!.id === this.confirmRemoveDialog.selectedCategory);

        if (foundCategory) {
          const index = foundCategory.category_items.findIndex(categoryItem => categoryItem!.category_id === this.confirmRemoveDialog.selectedCategory && categoryItem!.item_id === this.confirmRemoveDialog.selectedItem);
          if (index !== -1) {
            foundCategory.category_items.splice(index, 1);
          }
        }

        const payload = {
          input: {
            category_id: this.confirmRemoveDialog.selectedCategory,
            item_id: this.confirmRemoveDialog.selectedItem,
          },
        };

        // delete from database
        await sdk.DeleteCategoryItem(payload);
      } catch (err) {
        console.error(err);
      }
    },

    toggleConfirmRemoveDialog () {
      this.confirmRemoveDialog.visible = !this.confirmRemoveDialog.visible;
    },

    toggleItemsDrawer () {
      this.itemsDrawerOpen = !this.itemsDrawerOpen;
    },

    async updateCategory ({ id, input }) {
      const client = useClient();
      const sdk = getSdk(client);

      try {
        const payload = { id, input };
        const { updateCategory } = await sdk.UpdateCategory(payload);

        if (this.selectedPack?.categories?.length && updateCategory && !updateCategory.errors) {
          const index = this.selectedPack.categories.findIndex(category => (category as Category).id === id);
          this.selectedPack.categories[index] = updateCategory.category as Category;
        }
      } catch (error) {
        console.log(error);
      }
    },

    async updateItem ({ id, input }) {
      const client = useClient();
      const sdk = getSdk(client);

      const { updateItem } = await sdk.UpdateItem({ id, input });

      if (updateItem && !updateItem.errors) {
        this.selectedPack?.categories?.forEach(category => {
          if (category?.category_items.length) {
            category.category_items.forEach(categoryItem => {
              if (categoryItem?.item && categoryItem.item?.id === id) {
                categoryItem.item = updateItem.item as Item;
              }
            });
          }
        });
      }
    },

    async updatePack (id: number, input: UpdatePackInput) {
      const client = useClient();
      const sdk = getSdk(client);

      try {
        const payload = { id, input };
        const { updatePack: res } = await sdk.UpdatePack(payload);

        if (!res.errors && res.pack) {
          this.selectedPack = res.pack;
        }
      } catch (err) {
        console.log({ err });
      }
    },
  },
});
