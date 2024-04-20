import { MailIcon } from 'lucide-vue-next';
import GcAutocomplete, { type Props } from "@/components/common/GcAutocomplete.vue";
import type { Meta, StoryObj, StoryFn } from '@storybook/vue3';
import type { SelectOption } from '@/types/helpers';

const meta: Meta<typeof GcAutocomplete> = {
  title: 'GcAutocomplete',
  component: GcAutocomplete,
  decorators: [() => ({ template: '<div style="padding: 3rem;"><story/></div>' })],
  tags: ['autodocs'],
  argTypes: {
    disabled: { control: 'boolean' },
    placeholder: { control: 'text' },
    modelValue: { control: { type: 'none' } },
    nullable: { control: 'boolean' },
    multiple: { control: 'boolean' },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    options: { control: { type: 'array' } },
    prependIcon: { control: { type: 'none' } },
  },
  args: { // default values
    options: [{ label: 'Option 1', value: 'option1' }, { label: 'Option 2', value: 'option2' }] as SelectOption[],
    size: 'md',
    modelValue: undefined,
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const Template: StoryFn<Props> = (args: Props) => ({
  components: { GcAutocomplete, MailIcon },
  setup () {
    return { args };
  },
  template: '<GcAutocomplete v-bind="args" />',
});

export const Disabled: Story = {
  ...Template,
  args: {
    disabled: true,
  },
};

export const Loading: Story = {
  ...Template,
  args: {
    loading: true,
  },
};

export const Nullable: Story = {
  ...Template,
  args: {
    modelValue: { label: 'Option 1', value: 'option1' },
    nullable: true,
  },
};

export const Multiple: Story = {
  ...Template,
  args: {
    modelValue: [{ label: 'Option 1', value: 'option1' }],
    multiple: true,
  },
};

export const Placeholder: Story = {
  ...Template,
  args: {
    placeholder: 'Select an option',
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
    placeholder: 'Select an option',
    size: 'lg',
  },
};

export const PrependIcon: Story = {
  ...Template,
  args: {
    prependIcon: MailIcon,
  },
};

export const NoOptions: Story = {
  ...Template,
  args: {
    options: [],
  },
};