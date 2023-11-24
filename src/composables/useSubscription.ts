import { ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';
// import { SubscriptionLevel } from '../generated/types';
import type { Ref } from 'vue';

interface ReturnType {
  alertIsOpen: Ref<boolean>;
  handleGoBack: () => void;
}

const useSubscription = (): ReturnType => {
  const router = useRouter();
  const currentRoute = useRoute();
  const user = useUserStore();

  const alertIsOpen = ref(false);

  // check if route being entered requires subscription
  const checkSubscription = (): void => {
    // if (currentRoute.meta.subscriptionRequired && user.currentUser?.subscription_level === SubscriptionLevel.Free) {
    //   alertIsOpen.value = true;
    // }
  };

  const handleGoBack = (): void => router.go(-1);

  watch(() => user.currentUser, () => {
    if (user.currentUser) checkSubscription();
  });

  return { alertIsOpen, handleGoBack };
};

export default useSubscription;
