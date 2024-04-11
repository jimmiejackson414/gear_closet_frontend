import { defineStore } from 'pinia';
import { toast } from 'vue3-toastify';

type State = {
  drawer: boolean;
  loading: boolean;
};

type Getters = {
  //
};

type Actions = {
  notifyPositive: (message: string) => void;
  notifyNegative: (message: string) => void;
  notifyInfo: (message: string) => void;
  toggleDrawer(): void;
};

export const useAppStore = defineStore<'app', State, Getters, Actions>('app', {
  state () {
    return {
      drawer: false,
      loading: false,
    };
  },

  getters: {},

  actions: {
    notifyPositive (message) {
      toast.success(message);
    },
    notifyNegative (message) {
      toast.error(message);
    },
    notifyInfo (message) {
      toast.info(message);
    },
    toggleDrawer () {
      this.drawer = !this.drawer;
    },
  },
});
