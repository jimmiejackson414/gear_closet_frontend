import { mockNuxtImport, mountSuspended } from '@nuxt/test-utils/runtime';
import { type VueWrapper } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import CreateTripDialog from '@/components/planning/dialogs/CreateTripDialog.vue';
import DeletePollDialog from '@/components/planning/dialogs/DeletePollDialog.vue';
import DeleteTripDialog from '@/components/planning/dialogs/DeleteTripDialog.vue';
import ModifyPollDialog from '@/components/planning/dialogs/ModifyPollDialog.vue';
import { usePlanningStore } from '@/stores/planning';
import { trips } from '@/tests/unit/mocks/planning.mock';
import { createSupabaseMock, createThenableQuery } from '@/tests/unit/mocks/supabase.mock';
import { findBodyButton, isAlertDialogOpen, isDialogRootOpen, testMountGlobals } from './helpers';

const rpcMock = vi.hoisted(() => vi.fn());
const deleteEqMock = vi.hoisted(() => vi.fn());
const notifyNegative = vi.hoisted(() => vi.fn());
const notifyPositive = vi.hoisted(() => vi.fn());

vi.mock('@/stores/app', () => ({
  useAppStore: () => ({ notifyNegative, notifyPositive }),
}));

const supabaseClient = vi.hoisted(() => ({
  current: null as ReturnType<typeof createSupabaseMock> | null,
}));

const supabaseUser = vi.hoisted(() => ({
  value: { sub: '61b66be5-d199-48d5-898a-c521dd6b59cc' } as { sub: string } | null,
}));

mockNuxtImport('useSupabaseClient', () => () => supabaseClient.current);
mockNuxtImport('useSupabaseUser', () => () => supabaseUser);

const blankForm = () => ({
  answers: [{
    content: '',
    created_at: '',
    id: 0,
    profile_id: '',
    question_id: 0,
    updated_at: '',
  }],
  question: {
    created_at: '',
    id: 0,
    poll_id: 0,
    profile_id: '',
    title: '',
    updated_at: '',
  },
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
        form: blankForm(),
        isOpen: true,
        state: 'create',
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

describe('CreateTripDialog', () => {
  beforeEach(() => {
    notifyNegative.mockReset();
    notifyPositive.mockReset();
    supabaseClient.current = createSupabaseMock();
  });

  it('clears start and end dates when the dialog closes', async () => {
    const wrapper = await mountSuspended(CreateTripDialog, {
      attachTo: document.body,
      global: testMountGlobals(),
      props: { isOpen: true },
    }) as VueWrapper<any>;

    const picker = wrapper.findComponent({ name: 'VueDatePicker' });
    picker.vm.$emit('update:modelValue', [new Date('2026-08-01'), new Date('2026-08-10')]);
    await wrapper.vm.$nextTick();

    await wrapper.setProps({ isOpen: false });
    await wrapper.vm.$nextTick();
    await wrapper.setProps({ isOpen: true });
    await wrapper.vm.$nextTick();

    const input = document.body.querySelector('input[name="datePicker"]') as HTMLInputElement | null;
    expect(input?.value ?? '')
      .toBe('');

    wrapper.unmount();
    document.body.innerHTML = '';
  });

  it('marks optional fields and shows placeholders for name and description', async () => {
    const wrapper = await mountSuspended(CreateTripDialog, {
      attachTo: document.body,
      global: testMountGlobals(),
      props: { isOpen: true },
    });

    expect(document.body.textContent)
      .toContain('Description (optional)');
    expect(document.body.textContent)
      .toContain('Trip Origin (optional)');
    expect(document.body.textContent)
      .toContain('Trip Destination (optional)');
    expect(document.body.textContent)
      .toContain('Start and End Dates (optional)');

    const nameInput = document.body.querySelector('input[name="name"]') as HTMLInputElement | null;
    const descriptionInput = document.body.querySelector('input[name="description"]') as HTMLInputElement | null;
    expect(nameInput?.placeholder)
      .toBe('John Muir Trail 2026');
    expect(descriptionInput?.placeholder)
      .toBe('A week on the High Sierra');

    wrapper.unmount();
    document.body.innerHTML = '';
  });

  it('requires a trip name before creating', async () => {
    const query = createThenableQuery({ data: null, error: null });
    supabaseClient.current = createSupabaseMock({
      from: (table: string) => {
        if (table !== 'trips') throw new Error(`Unexpected table ${table}`);
        return query;
      },
    });

    const wrapper = await mountSuspended(CreateTripDialog, {
      attachTo: document.body,
      global: testMountGlobals(),
      props: { isOpen: true },
    });

    const createButton = findBodyButton('Create Trip');
    expect(createButton)
      .toBeTruthy();
    await createButton!.click();
    await wrapper.vm.$nextTick();
    await vi.waitFor(() => {
      expect(document.body.textContent)
        .toMatch(/Trip name is required\.|Trip name must be at least 3 characters\./);
    });

    expect(query.insert)
      .not
      .toHaveBeenCalled();
    expect(isDialogRootOpen(wrapper))
      .toBe(true);

    wrapper.unmount();
    document.body.innerHTML = '';
  });

  it('creates a trip with only a name', async () => {
    const created = { ...trips[0]!, id: 99, name: 'JMT 2026' };
    const query = createThenableQuery({ data: [created], error: null });
    supabaseClient.current = createSupabaseMock({
      from: (table: string) => {
        if (table !== 'trips') throw new Error(`Unexpected table ${table}`);
        return query;
      },
    });

    const wrapper = await mountSuspended(CreateTripDialog, {
      attachTo: document.body,
      global: testMountGlobals({
        planning: {
          data: { trips: [] },
          pageLoading: false,
        },
      }),
      props: { isOpen: true },
    });
    const store = usePlanningStore();
    vi.spyOn(store, 'fetchPlanningPage')
      .mockResolvedValue(undefined as never);

    const nameInput = document.body.querySelector('input[name="name"]') as HTMLInputElement;
    nameInput.value = 'JMT 2026';
    nameInput.dispatchEvent(new Event('input', { bubbles: true }));
    await wrapper.vm.$nextTick();

    const createButton = findBodyButton('Create Trip');
    await createButton!.click();
    await vi.waitFor(() => {
      expect(query.insert)
        .toHaveBeenCalled();
    });

    expect(query.insert)
      .toHaveBeenCalledWith([expect.objectContaining({
        description: null,
        ending_date: null,
        ending_point: null,
        name: 'JMT 2026',
        starting_date: null,
        starting_point: null,
      })]);
    expect(notifyPositive)
      .toHaveBeenCalled();

    wrapper.unmount();
    document.body.innerHTML = '';
  });
});

describe('DeleteTripDialog', () => {
  it('renders the selected trip name', async () => {
    const wrapper = await mountSuspended(DeleteTripDialog, {
      attachTo: document.body,
      global: testMountGlobals({
        planning: {
          data: { trips },
          selectedTripId: String(trips[0]!.id),
        },
      }),
      props: { isOpen: true },
    });

    expect(isAlertDialogOpen(wrapper))
      .toBe(true);
    expect(document.body.textContent)
      .toContain('Delete trip');
    expect(document.body.textContent)
      .toContain(trips[0]!.name);

    wrapper.unmount();
    document.body.innerHTML = '';
  });
});
