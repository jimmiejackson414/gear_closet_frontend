import GcSpinner from "@/components/common/GcSpinner.vue";
import type { Meta, StoryObj, StoryFn } from '@storybook/vue3';

const meta: Meta<typeof GcSpinner> = {
  title: 'GcSpinner',
  component: GcSpinner,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    variant: { control: 'select', options: ['primary', 'default'] },
  },
  args: { // default values
    variant: 'default',
    size: 'md',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const Template: StoryFn = () => ({
  components: { GcSpinner },
  setup () {
    return {};
  },
  template: '<GcSpinner />',
});

export const Default: Story = {
  ...Template,
  decorators: [() => ({ template: '<div style="background-color: #4f4f4f; padding: 3rem"><story /></div>' })],
};

export const PrimaryVariant: Story = {
  ...Template,
  name: 'Variants (Primary)',
  args: {
    variant: 'primary',
  },
};

export const DefaultVariant: Story = {
  ...Template,
  name: 'Variants (Default)',
  args: {
    variant: 'default',
  },
  decorators: [() => ({ template: '<div style="background-color: #4f4f4f; padding: 3rem"><story /></div>' })],
};

export const SmallSize: Story = {
  ...Template,
  name: 'Sizes (Small)',
  args: {
    size: 'sm',
  },
  decorators: [() => ({ template: '<div style="background-color: #4f4f4f; padding: 3rem"><story /></div>' })],
};

export const MediumSize: Story = {
  ...Template,
  name: 'Sizes (Medium)',
  args: {
    size: 'md',
  },
  decorators: [() => ({ template: '<div style="background-color: #4f4f4f; padding: 3rem"><story /></div>' })],
};

export const LargeSize: Story = {
  ...Template,
  name: 'Sizes (Large)',
  args: {
    size: 'lg',
  },
  decorators: [() => ({ template: '<div style="background-color: #4f4f4f; padding: 3rem"><story /></div>' })],
};