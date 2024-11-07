import GcSelect from "@/components/common/GcSelect.vue";
import type { Meta, StoryObj, StoryFn } from '@storybook/vue3';

const meta: Meta<typeof GcSelect> = {
  title: 'GcSelect',
  component: GcSelect,
  decorators: [() => ({ template: '<div style="padding: 3rem;"><story/></div>' })],
  tags: ['autodocs'],
  argTypes: {
    clearable: { control: 'boolean' },
    customClasses: { control: 'text' },
    disabled: { control: 'boolean' },
    error: { control: 'text' },
    hideBorder: { control: 'boolean' },
    label: { control: 'text' },
    loading: { control: 'boolean' },
    modelValue: { control: 'text' },
    noOptionsCopy: { control: 'text' },
    // options: { control: { type: 'array' } },
    placeholder: { control: 'text' },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    required: { control: 'boolean' },
  },
  args: { // default values
    clearable: false,
    customClasses: '',
    disabled: false,
    error: null,
    hideBorder: false,
    label: undefined,
    loading: false,
    modelValue: undefined,
    noOptionsCopy: 'No options available',
    placeholder: 'Select an option',
    options: [{ label: 'Option 1', value: 'option1' }, { label: 'Option 2', value: 'option2' }],
    size: 'md',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const Template: StoryFn = () => ({
  components: { GcSelect },
  setup () {
    return {};
  },
  template: '<GcSelect />',
});

export const Default: Story = {
  ...Template,
};

export const Clearable: Story = {
  ...Template,
  args: {
    clearable: true,
  },
};

export const Disabled: Story = {
  ...Template,
  args: {
    disabled: true,
  },
};

export const CustomClasses: Story = {
  ...Template,
  args: {
    customClasses: 'mt-4 !border-indigo-500',
  },
  parameters: {
    docs: {
      description: {
        story: 'This example has `mt-4` applied',
      },
    },
  },
};

export const Error: Story = {
  ...Template,
  args: {
    error: 'This is an error message',
  },
};

export const HideBorder: Story = {
  ...Template,
  args: {
    hideBorder: true,
  },
};

export const Label: Story = {
  ...Template,
  args: {
    label: 'Label',
  },
};

export const Loading: Story = {
  ...Template,
  args: {
    loading: true,
  },
};

export const HasValue: Story = {
  ...Template,
  args: {
    modelValue: 'option2',
  },
};

export const NoOptions: Story = {
  ...Template,
  args: {
    options: [],
  },
};

export const Required: Story = {
  ...Template,
  args: {
    required: true,
  },
};

export const Placeholder: Story = {
  ...Template,
  args: {
    placeholder: 'This is a placeholder',
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