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
    loading: { control: 'boolean' },
    nullable: { control: 'boolean' },
    placeholder: { control: 'text' },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    // options: { control: { type: 'array' } },
    // prependIcon: { control: { type: 'none' } },
    required: { control: 'boolean' },
  },
  args: { // default values
    options: [{ label: 'Option 1', value: 'option1' }, { label: 'Option 2', value: 'option2' }] as SelectOption[],
    size: 'md',
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

export const FullExample: Story = {
  ...Template,
  name: 'Default',
  args: {
    placeholder: 'Select an option',
    prependIcon: MailIcon,
  },
};

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
    nullable: true,
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

export const Required: Story = {
  ...Template,
  args: {
    required: true,
  },
};