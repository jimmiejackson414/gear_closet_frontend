import GcCheckbox from '@/components/common/GcCheckbox.vue';
import type { Meta, StoryObj, StoryFn } from '@storybook/vue3';

const meta: Meta<typeof GcCheckbox> = {
  title: 'GcCheckbox',
  component: GcCheckbox,
  decorators: [() => ({ template: '<div style="padding: 3rem;"><story/></div>' })],
  tags: ['autodocs'],
  argTypes: {
    id: { control: 'text' },
    modelValue: { control: 'boolean' },
    label: { control: 'text' },
    strikeThrough: { control: 'boolean' },
    variant: { control: 'select', options: ['primary', 'positive', 'danger', 'secondary'] },
  },
  args: { // default values
    id: 'checkbox',
    variant: 'primary',
    strikeThrough: false,
    modelValue: true,
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const Template: StoryFn = () => ({
  components: { GcCheckbox },
  setup () {
    return {};
  },
  template: '<GcCheckbox />',
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

export const Unchecked: Story = {
  ...Template,
  args: {
    modelValue: false,
  },
};

export const WithLabel: Story = {
  ...Template,
  args: {
    label: 'Label',
  },
};

export const StrikeThrough: Story = {
  ...Template,
  args: {
    strikeThrough: true,
    label: 'Strike Through',
  },
};