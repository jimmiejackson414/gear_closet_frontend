import { IconCircleAlert, IconCircleCheck, IconInfo } from '#components';
import { useToast } from '@/components/ui';

type State = {
  drawer: boolean;
  loading: boolean;
};

type Getters = {
  //
};

type Actions = {
  notifyDefault: (description: string, title?: string) => void;
  notifyInfo: (description: string, title?: string) => void;
  notifyNegative: (description: string, title?: string) => void;
  notifyPositive: (description: string, title?: string) => void;
  toggleDrawer(): void;
};

export const useAppStore = defineStore<'app', State, Getters, Actions>('app', {
  actions: {
    notifyDefault (description, title) {
      const { toast } = useToast();
      toast({
        description,
        icon: IconInfo,
        title,
        variant: 'default',
      });
    },
    notifyInfo (description, title) {
      const { toast } = useToast();
      toast({
        description,
        icon: IconInfo,
        title,
        variant: 'info',
      });
    },
    notifyNegative (description, title) {
      const { toast } = useToast();
      toast({
        description,
        icon: IconCircleAlert,
        title,
        variant: 'destructive',
      });
    },
    notifyPositive (description, title) {
      const { toast } = useToast();
      toast({
        description,
        icon: IconCircleCheck,
        title,
        variant: 'positive',
      });
    },
    toggleDrawer () {
      this.drawer = !this.drawer;
    },
  },

  getters: {},

  state () {
    return {
      drawer: false,
      loading: false,
    };
  },
});
