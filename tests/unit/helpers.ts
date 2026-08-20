import VueTippy from 'vue-tippy';
import { createTestingPinia, type TestingOptions } from '@pinia/testing';
import { vi } from 'vitest';
import type { VueWrapper } from '@vue/test-utils';

type InitialState = NonNullable<TestingOptions['initialState']>;

/**
 * Testing Pinia with spies; pass initialState for store seeds.
 */
export function createTestPinia (initialState?: InitialState, options: TestingOptions = {}) {
  return createTestingPinia({
    createSpy: vi.fn,
    stubActions: false,
    initialState,
    ...options,
  });
}

/** Default mount global options (Tippy + testing Pinia). */
export function testMountGlobals (initialState?: InitialState, options: TestingOptions = {}) {
  return {
    plugins: [VueTippy, createTestPinia(initialState, options)],
  };
}

export async function openDropdownMenu (wrapper: VueWrapper<any>) {
  const trigger = wrapper.findComponent({ name: 'DropdownMenuTrigger' });
  await trigger.trigger('click');
  await wrapper.vm.$nextTick();
}

export function getMenuItemsFromBody () {
  return [...document.body.querySelectorAll('[role="menuitem"]')] as HTMLElement[];
}

export function findBodyButton (text: string) {
  return [...document.body.querySelectorAll('button')]
    .find(b => b.textContent?.includes(text)) as HTMLButtonElement | undefined;
}

export function isDialogRootOpen (wrapper: VueWrapper<any>) {
  return Boolean(wrapper.findComponent({ name: 'DialogRoot' })
    .props('open'));
}

export function isAlertDialogOpen (wrapper: VueWrapper<any>) {
  return Boolean(wrapper.findComponent({ name: 'AlertDialog' })
    .props('open'));
}

export function isButtonDisabled (wrapper: VueWrapper<any>) {
  return Boolean((wrapper.element as HTMLButtonElement).disabled);
}
