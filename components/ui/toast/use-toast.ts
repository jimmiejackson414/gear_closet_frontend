import { computed, shallowRef, type Component, type ComputedRef, type VNode } from 'vue';
import type { ToastProps } from '.';

const TOAST_LIMIT = 5;
const TOAST_REMOVE_DELAY = 1000000;

export type StringOrVNode =
  | string
  | VNode
  | (() => VNode)

type ToasterToast = ToastProps & {
  id: string
  title?: string
  description?: StringOrVNode
  action?: Component
  icon?: Component
}

const actionTypes = {
  ADD_TOAST: 'ADD_TOAST',
  UPDATE_TOAST: 'UPDATE_TOAST',
  DISMISS_TOAST: 'DISMISS_TOAST',
  REMOVE_TOAST: 'REMOVE_TOAST',
} as const;

let count = 0;

function genId () {
  count = (count + 1) % Number.MAX_VALUE;
  return count.toString();
}

type ActionType = typeof actionTypes

type Action =
  | {
    type: ActionType['ADD_TOAST']
    toast: ToasterToast
  }
  | {
    type: ActionType['UPDATE_TOAST']
    toast: Partial<ToasterToast>
  }
  | {
    type: ActionType['DISMISS_TOAST']
    toastId?: ToasterToast['id']
  }
  | {
    type: ActionType['REMOVE_TOAST']
    toastId?: ToasterToast['id']
  }

/**
 * shallowRef (not ref): ToastProps from reka-ui is too deep for Vue's
 * Ref unwrap, which surfaces as TS2589 on assignments. We replace the
 * array wholesale anyway, so deep reactivity is unnecessary.
 */
const toastsState = shallowRef<ToasterToast[]>([]);

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>();

function addToRemoveQueue (toastId: string) {
  if (toastTimeouts.has(toastId))
    return;

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId);
    dispatch({
      type: actionTypes.REMOVE_TOAST,
      toastId,
    });
  }, TOAST_REMOVE_DELAY);

  toastTimeouts.set(toastId, timeout);
}

function dispatch (action: Action) {
  switch (action.type) {
  case actionTypes.ADD_TOAST:
    toastsState.value = [action.toast, ...toastsState.value].slice(0, TOAST_LIMIT);
    break;

  case actionTypes.UPDATE_TOAST:
    toastsState.value = toastsState.value.map((t: ToasterToast) =>
      t.id === action.toast.id ? { ...t, ...action.toast } : t,
    );
    break;

  case actionTypes.DISMISS_TOAST: {
    const { toastId } = action;

    if (toastId) {
      addToRemoveQueue(toastId);
    }
    else {
      toastsState.value.forEach((toast: ToasterToast) => {
        addToRemoveQueue(toast.id);
      });
    }

    toastsState.value = toastsState.value.map((t: ToasterToast) =>
      t.id === toastId || toastId === undefined
        ? {
          ...t,
          open: false,
        }
        : t,
    );
    break;
  }

  case actionTypes.REMOVE_TOAST:
    if (action.toastId === undefined)
      toastsState.value = [];
    else
      toastsState.value = toastsState.value.filter((t: ToasterToast) => t.id !== action.toastId);

    break;
  }
}

function useToast (): {
  toasts: ComputedRef<ToasterToast[]>
  toast: typeof toast
  dismiss: (toastId?: string) => void
  } {
  return {
    toasts: computed(() => toastsState.value),
    toast,
    dismiss: (toastId?: string) => dispatch({ type: actionTypes.DISMISS_TOAST, toastId }),
  };
}

type Toast = Omit<ToasterToast, 'id'>

function toast (props: Toast) {
  const id = genId();

  const update = (props: ToasterToast) =>
    dispatch({
      type: actionTypes.UPDATE_TOAST,
      toast: { ...props, id },
    });

  const dismiss = () => dispatch({ type: actionTypes.DISMISS_TOAST, toastId: id });

  dispatch({
    type: actionTypes.ADD_TOAST,
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open: boolean) => {
        if (!open)
          dismiss();
      },
    },
  });

  return {
    id,
    dismiss,
    update,
  };
}

export { toast, useToast };
