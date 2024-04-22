import GcAvatar from '@/components/common/GcAvatar.vue';
import type { Meta, StoryObj, StoryFn } from '@storybook/vue3';

const meta: Meta<typeof GcAvatar> = {
  title: 'GcAvatar',
  component: GcAvatar,
  decorators: [() => ({ template: '<div style="padding: 3rem;"><story/></div>' })],
  tags: ['autodocs'],
  argTypes: {
    border: { control: 'boolean' },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    url: { control: 'text' },
    initials: { control: 'text' },
  },
  args: { // default values
    url: 'https://avatar.iran.liara.run/public',
    initials: 'GC',
    size: 'md',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const Template: StoryFn = () => ({
  components: { GcAvatar },
  setup () {
    return {};
  },
  template: '<GcAvatar />',
});

export const Default: Story = {
  ...Template,
};

export const Border: Story = {
  ...Template,
  args: {
    border: true,
  },
};

export const ExtraSmall: Story = {
  ...Template,
  name: 'Sizes (Extra Small)',
  args: {
    size: 'xs',
  },
};

export const Small: Story = {
  ...Template,
  name: 'Sizes (Small)',
  args: {
    size: 'sm',
  },
};

export const Medium: Story = {
  ...Template,
  name: 'Sizes (Medium)',
  args: {
    size: 'md',
  },
};

export const Large: Story = {
  ...Template,
  name: 'Sizes (Large)',
  args: {
    size: 'lg',
  },
};

export const ExtraLarge: Story = {
  ...Template,
  name: 'Sizes (Extra Large)',
  args: {
    size: 'xl',
  },
};

export const Initials: Story = {
  ...Template,
  args: {
    url: undefined,
  },
};

