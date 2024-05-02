import { BackpackIcon } from 'lucide-vue-next';
import GcButton, { type Props } from '@/components/common/GcButton.vue';
import type { Meta, StoryObj, StoryFn } from '@storybook/vue3';

const meta: Meta<typeof GcButton> = {
  title: 'GcButton',
  component: GcButton,
  decorators: [() => ({ template: '<div style="padding: 3rem;"><story/></div>' })],
  tags: ['autodocs'],
  argTypes: {
    disabled: { control: 'boolean' },
    icon: { control: { type: 'none' } },
    label: { control: 'text' },
    loading: { control: 'boolean' },
    outlined: { control: 'boolean' },
    ghost: { control: 'boolean' },
    round: { control: 'boolean' },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    to: { control: 'text' },
    type: { control: 'select', options: ['button', 'submit', 'reset'] },
    variant: { control: 'select', options: ['primary', 'positive', 'danger', 'secondary'] },
  },
  args: { // default options
    type: 'button',
    variant: 'primary',
    size: 'md',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const Template: StoryFn<Props> = (args: Props) => ({
  components: { GcButton, BackpackIcon },
  setup () {
    return { args };
  },
  template: '<GcButton v-bind="args" />',
});

export const Default: Story = {
  ...Template,
  args: {
    label: 'Default',
  },
  parameters: {
    docs: {
      description: {
        story: '<b>Note</b>: `type`, `variant` and `size` are unnecessary because they are set to their default values.',
      },
    },
  },
};

export const PrimaryVariant: Story = {
  ...Template,
  name: 'Variants (Primary)',
  args: {
    label: 'Primary',
    variant: 'primary',
  },
  parameters: {
    docs: {
      description: {
        story: '<b>Note</b>: the `variant` prop is unnecessary because `primary` is the default value.',
      },
    },
  },
};

export const PositiveVariant: Story = {
  ...Template,
  name: 'Variants (Positive)',
  args: {
    label: 'Positive',
    variant: 'positive',
  },
};

export const DangerVariant: Story = {
  ...Template,
  name: 'Variants (Danger)',
  args: {
    label: 'Danger',
    variant: 'danger',
  },
};

export const SecondaryVariant: Story = {
  ...Template,
  name: 'Variants (Secondary)',
  args: {
    label: 'Secondary',
    variant: 'secondary',
  },
};

export const Disabled: Story = {
  ...Template,
  args: {
    label: 'Disabled',
    disabled: true,
  },
};

export const Icon: Story = {
  ...Template,
  args: {
    label: 'Icon',
    icon: BackpackIcon,
  },
};

export const Loading: Story = {
  ...Template,
  args: {
    label: 'Loading',
    loading: true,
  },
};

export const Outlined: Story = {
  ...Template,
  args: {
    label: 'Outlined',
    outlined: true,
  },
};

export const Ghost: Story = {
  ...Template,
  args: {
    label: 'Ghost',
    ghost: true,
  },
};

export const Round: Story = {
  ...Template,
  args: {
    label: 'Round',
    round: true,
  },
};

export const SmallSize: Story = {
  ...Template,
  name: 'Sizes (Small)',
  args: {
    label: 'Small',
    size: 'sm',
  },
};

export const MediumSize: Story = {
  ...Template,
  name: 'Sizes (Medium)',
  args: {
    label: 'Medium',
    size: 'md',
  },
};

export const LargeSize: Story = {
  ...Template,
  name: 'Sizes (Large)',
  args: {
    label: 'Large',
    size: 'lg',
  },
};

export const Link: Story = {
  ...Template,
  args: {
    label: 'Link',
    to: 'https://google.com',
  },
};

export const Submit: Story = {
  ...Template,
  name: 'Types (Submit)',
  args: {
    label: 'Submit',
    type: 'submit',
  },
};

export const Reset: Story = {
  ...Template,
  name: 'Types (Reset)',
  args: {
    label: 'Reset',
    type: 'reset',
  },
};