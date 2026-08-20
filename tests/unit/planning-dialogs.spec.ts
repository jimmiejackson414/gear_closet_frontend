import { mockNuxtImport, mountSuspended } from '@nuxt/test-utils/runtime';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import DeletePollDialog from '@/components/planning/dialogs/DeletePollDialog.vue';
import ModifyPollDialog from '@/components/planning/dialogs/ModifyPollDialog.vue';
import { usePlanningStore } from '@/stores/planning';
import { createSupabaseMock } from '@/tests/unit/mocks/supabase.mock';
import { findBodyButton, isAlertDialogOpen, isDialogRootOpen, testMountGlobals } from './helpers';

const rpcMock = vi.hoisted(() => vi.fn());
const deleteEqMock = vi.hoisted(() => vi.fn());
const notifyNegative = vi.hoisted(() => vi.fn());

vi.mock('@/stores/app', () => ({
  useAppStore: () => ({ notifyNegative }),
}));

const supabaseClient = vi.hoisted(() => ({
  current: null as ReturnType<typeof createSupabaseMock> | null,
}));

mockNuxtImport('useSupabaseClient', () => () => supabaseClient.current);

const blankForm = () => ({
  question: {
    id: 0,
    poll_id: 0,
    created_at: '',
    updated_at: '',
    profile_id: '',
    title: '',
  },
  answers: [{
    id: 0,
    question_id: 0,
    created_at: '',
    updated_at: '',
    profile_id: '',
    content: '',
  }],
});

describe('ModifyPollDialog', () => {
  beforeEach(() => {
    rpcMock.mockReset();
    notifyNegative.mockReset();
    supabaseClient.current = createSupabaseMock({
      rpc: rpcMock,
    });
  });

  it('shows validation errors instead of submitting an invalid poll', async () => {
    const wrapper = await mountSuspended(ModifyPollDialog, {
      attachTo: document.body,
      global: testMountGlobals(),
      props: {
        isOpen: true,
        state: 'create',
        form: blankForm(),
      },
    });

    const createButton = findBodyButton('Create');
    expect(createButton)
      .toBeTruthy();
    await createButton!.click();
    await wrapper.vm.$nextTick();

    expect(rpcMock).not.toHaveBeenCalled();
    expect(document.body.textContent)
      .toContain('Question is required.');
    expect(document.body.textContent)
      .toContain('Add at least two answers.');
    expect(isDialogRootOpen(wrapper))
      .toBe(true);
  });
});

describe('DeletePollDialog', () => {
  beforeEach(() => {
    deleteEqMock.mockReset();
    notifyNegative.mockReset();

    const planningStore = usePlanningStore();
    planningStore.data.poll = { id: 42 } as any;

    supabaseClient.current = createSupabaseMock({
      from: (table: string) => {
        if (table !== 'polls') {
          throw new Error(`Unexpected table ${table}`);
        }
        return {
          delete: () => ({
            eq: deleteEqMock,
          }),
        };
      },
    });
  });

  it('keeps the dialog open when delete fails', async () => {
    deleteEqMock.mockResolvedValue({ error: { message: 'nope' } });

    const wrapper = await mountSuspended(DeletePollDialog, {
      attachTo: document.body,
      global: testMountGlobals({
        planning: {
          data: { poll: { id: 42 } },
        },
      }),
      props: { isOpen: true },
    });

    const deleteButton = findBodyButton('Delete Poll');
    expect(deleteButton)
      .toBeTruthy();
    await deleteButton!.click();
    await wrapper.vm.$nextTick();

    expect(notifyNegative)
      .toHaveBeenCalled();
    expect(isAlertDialogOpen(wrapper))
      .toBe(true);
  });
});
