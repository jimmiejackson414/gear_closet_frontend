import { defineStore } from 'pinia';
import { useToast } from 'vue-toastification';
import { CheckCircleIcon, ExclamationCircleIcon, InformationCircleIcon } from '@heroicons/vue/24/solid';

type State = {
  drawer: boolean;
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

const toast = useToast();

export const useAppStore = defineStore<'app', State, Getters, Actions>('app', {
  state () {
    return {
      drawer: false,
    };
  },

  getters: {},

  actions: {
    notifyPositive (message) {
      toast.success(message, {
        icon: CheckCircleIcon,
      });
    },
    notifyNegative (message) {
      toast.error(message, {
        icon: ExclamationCircleIcon,
      });
    },
    notifyInfo (message) {
      toast.info(message, {
        icon: InformationCircleIcon,
      });
    },
    toggleDrawer () {
      this.drawer = !this.drawer;
    },
  },
});
