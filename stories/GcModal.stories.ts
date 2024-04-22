import GcModal from '@/components/common/GcModal.vue';
import type { Meta, StoryObj, StoryFn } from '@storybook/vue3';

const meta: Meta<typeof GcModal> = {
  title: 'GcModal',
  component: GcModal,
  decorators: [() => ({ template: '<div style="padding: 3rem;"><story/></div>' })],
  tags: ['autodocs'],
  argTypes: {
    closeable: { control: 'boolean' },
    id: { control: 'text' },
    title: { control: 'text' },
    size: { control: 'select', options: ['sm', 'md', 'lg', 'xl'] },
    isOpen: { control: 'boolean' },
  },
  args: { // default values
    closeable: true,
    id: 'static-modal',
    title: 'Modal Title',
    size: 'md',
    isOpen: true,
  },
  parameters: {
    docs: {
      story: {
        inline: false,
        iframeHeight: 400,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const Template: StoryFn = () => ({
  components: { GcModal },
  setup () {
    return {};
  },
  // template: '<GcModal />',
  template: `
    <GcModal v-bind="args">
      <template #content>
        <div class="p-4">
          <p class="text-lg">Modal Content</p>
          <p class="text-sm">This is a modal content</p>
        </div>
      </template>
      <template #actions>
        <div class="flex justify-end p-4">
          <button class="btn btn-primary">Save</button>
          <button class="btn btn-secondary ml-2">Cancel</button>
        </div>
      </template>
    </GcModal>
  `,
});

export const Default: Story = {
  ...Template,
};

export const NotCloseable: Story = {
  ...Template,
  args: {
    closeable: false,
  },
};

export const Closeable: Story = {
  ...Template,
  args: {
    closeable: true,
  },
};

export const SmallSize: Story = {
  ...Template,
  name: 'Size (Small)',
  args: {
    size: 'sm',
  },
};

export const MediumSize: Story = {
  ...Template,
  name: 'Size (Medium)',
  args: {
    size: 'md',
  },
};

export const LargeSize: Story = {
  ...Template,
  name: 'Size (Large)',
  args: {
    size: 'lg',
  },
};

export const ExtraLargeSize: Story = {
  ...Template,
  name: 'Size (Extra Large)',
  args: {
    size: 'xl',
  },
};
