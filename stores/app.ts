import { defineStore } from 'pinia';
// import { CheckCircle2Icon, AlertCircleIcon, InfoIcon } from 'lucide-vue-next';

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

// const toast = useToast();

export const useAppStore = defineStore<'app', State, Getters, Actions>('app', {
  state () {
    return {
      drawer: false,
    };
  },

  getters: {},

  actions: {
    notifyPositive (message) {
      // toast.success(message, {
      //   icon: CheckCircle2Icon,
      // });
    },
    notifyNegative (message) {
      // toast.error(message, {
      //   icon: AlertCircleIcon,
      // });
    },
    notifyInfo (message) {
      // toast.info(message, {
      //   icon: InfoIcon,
      // });
    },
    toggleDrawer () {
      this.drawer = !this.drawer;
    },
  },
});
