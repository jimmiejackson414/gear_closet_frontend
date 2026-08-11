import { IconCircleAlert, IconCircleCheck, IconInfo } from '#components';
import { useToast } from '@/components/ui/toast';

type State = {
  drawer: boolean;
  loading: boolean;
};

type Getters = Record<string, never>;

type Actions = {
  notifyDefault: (description: string, title?: string) => void;
  notifyPositive: (description: string, title?: string) => void;
  notifyNegative: (description: string, title?: string) => void;
  notifyInfo: (description: string, title?: string) => void;
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
    notifyDefault (description, title) {
      const { toast } = useToast();
      toast({
        title,
        description,
        variant: 'default',
        icon: IconInfo,
      });
    },
    notifyPositive (description, title) {
      const { toast } = useToast();
      toast({
        title,
        description,
        variant: 'positive',
        icon: IconCircleCheck,
      });
    },
    notifyNegative (description, title) {
      const { toast } = useToast();
      toast({
        title,
        description,
        variant: 'destructive',
        icon: IconCircleAlert,
      });
    },
    notifyInfo (description, title) {
      const { toast } = useToast();
      toast({
        title,
        description,
        variant: 'info',
        icon: IconInfo,
      });
    },
    toggleDrawer () {
      this.drawer = !this.drawer;
    },
  },
});
