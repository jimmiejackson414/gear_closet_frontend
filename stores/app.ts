import type { Component } from 'vue';
import { IconCircleAlert, IconCircleCheck, IconInfo } from '#components';
import { useToast } from '@/components/ui/toast';

/*
 * Setup syntax rather than the options form: the `this`-based options API makes
 * TypeScript re-instantiate the whole store type on every state write, which
 * trips TS2589 once state holds wide relational rows. See #112.
 */
export const useAppStore = defineStore('app', () => {
  const drawer = ref(false);
  const loading = ref(false);

  const notify = (
    variant: 'default' | 'positive' | 'destructive' | 'info',
    icon: Component,
    description: string,
    title?: string,
  ) => {
    const { toast } = useToast();
    toast({
      title,
      description,
      variant,
      icon,
    });
  };

  const notifyDefault = (description: string, title?: string) =>
    notify('default', IconInfo, description, title);

  const notifyPositive = (description: string, title?: string) =>
    notify('positive', IconCircleCheck, description, title);

  const notifyNegative = (description: string, title?: string) =>
    notify('destructive', IconCircleAlert, description, title);

  const notifyInfo = (description: string, title?: string) =>
    notify('info', IconInfo, description, title);

  const toggleDrawer = () => {
    drawer.value = !drawer.value;
  };

  return {
    drawer,
    loading,
    notifyDefault,
    notifyPositive,
    notifyNegative,
    notifyInfo,
    toggleDrawer,
  };
});
