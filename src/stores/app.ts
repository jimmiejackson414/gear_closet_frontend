import { defineStore } from 'pinia';
import { Notify } from 'quasar';

type State = {
  drawer: boolean;
};

type Getters = {
  //
};

type Actions = {
  notifyPositive: (message: string) => void;
  notifyNegative: (message: string) => void;
  toggleDrawer(): void;
};

export const useAppStore = defineStore<'app', State, Getters, Actions>('app', {
  state () {
    return {
      drawer: false,
    };
  },

  getters: {
  },

  actions: {
    notifyPositive (message) {
      Notify.create({
        message,
        color: 'positive',
        icon: 'bi-check-circle',
      });
    },
    notifyNegative (message) {
      Notify.create({
        message,
        color: 'negative',
        icon: 'bi-exclamation-circle',
      });
    },
    toggleDrawer () {
      this.drawer = !this.drawer;
    },
  },
});
