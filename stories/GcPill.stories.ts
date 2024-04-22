import GcPill from "@/components/common/GcPill.vue";
import type { Meta, StoryObj, StoryFn } from '@storybook/vue3';

const meta: Meta<typeof GcPill> = {
  title: 'GcPill',
  component: GcPill,
  decorators: [() => ({ template: '<div style="padding: 3rem;"><story/></div>' })],
  tags: ['autodocs'],
  argTypes: {
    copy: { control: 'text' },
    variant: { control: 'select', options: ['primary', 'positive', 'danger', 'secondary', 'warning'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
  args: { // default values
    copy: 'Pill',
    variant: 'primary',
    size: 'md',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const Template: StoryFn = () => ({
  components: { GcPill },
  setup () {
    return {};
  },
  template: '<GcPill />',
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

export const SecondaryVariant: Story = {
  ...Template,
  name: 'Variants (Secondary)',
  args: {
    variant: 'secondary',
  },
};

export const WarningVariant: Story = {
  ...Template,
  name: 'Variants (Warning)',
  args: {
    variant: 'warning',
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