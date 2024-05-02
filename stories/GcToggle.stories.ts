import GcToggle from "@/components/common/GcToggle.vue";
import type { Meta, StoryObj, StoryFn } from '@storybook/vue3';

const meta: Meta<typeof GcToggle> = {
  title: 'GcToggle',
  component: GcToggle,
  decorators: [() => ({ template: '<div style="padding: 3rem;"><story/></div>' })],
  tags: ['autodocs'],
  argTypes: {
    disabled: { control: 'boolean' },
    label: { control: 'text' },
    modelValue: { control: 'boolean' },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    variant: { control: 'select', options: ['primary', 'positive', 'danger'] },
  },
  args: { // default values
    disabled: false,
    label: undefined,
    modelValue: true,
    size: 'md',
    variant: 'primary',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const Template: StoryFn = () => ({
  components: { GcToggle },
  setup () {
    return {};
  },
  template: '<GcToggle />',
});

export const Default: Story = {
  ...Template,
};

export const PrimaryVariant: Story = {
  ...Template,
  name: 'Variants (Primary)',
  args: {
    variant: 'primary',
  },
};

export const PositiveVariant: Story = {
  ...Template,
  name: 'Variants (Positive)',
  args: {
    variant: 'positive',
  },
};

export const DangerVariant: Story = {
  ...Template,
  name: 'Variants (Danger)',
  args: {
    variant: 'danger',
  },
};

export const Disabled: Story = {
  ...Template,
  args: {
    disabled: true,
  },
};

export const SmallSize: Story = {
  ...Template,
  name: 'Sizes (Small)',
  args: {
    size: 'sm',
  },
};

export const MediumSize: Story = {
  ...Template,
  name: 'Sizes (Medium)',
  args: {
    size: 'md',
  },
};

export const LargeSize: Story = {
  ...Template,
  name: 'Sizes (Large)',
  args: {
    size: 'lg',
  },
};

export const WithLabel: Story = {
  ...Template,
  args: {
    label: 'Label',
  },
};