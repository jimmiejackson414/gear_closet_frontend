import { MailIcon } from 'lucide-vue-next';
import GcInput from '@/components/common/GcInput.vue';
import type { Meta, StoryObj, StoryFn } from '@storybook/vue3';

const meta: Meta<typeof GcInput> = {
  title: 'GcInput',
  component: GcInput,
  decorators: [() => ({ template: '<div style="padding: 3rem;"><story/></div>' })],
  tags: ['autodocs'],
  argTypes: {
    autocomplete: { control: 'text' },
    disabled: { control: 'boolean' },
    error: { control: 'text' },
    label: { control: 'text' },
    modelValue: { control: 'text' },
    name: { control: 'text' },
    passwordToggle: { control: 'boolean' },
    prependIcon: { control: { type: 'none' } },
    required: { control: 'boolean' },
    type: { control: 'select', options: ['text', 'email', 'password'] },
    placeholder: { control: 'text' },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
  args: { // default values
    autocomplete: 'off',
    disabled: false,
    error: undefined,
    label: '',
    modelValue: 'Jim Halpert',
    name: '',
    passwordToggle: false,
    prependIcon: undefined,
    placeholder: undefined,
    required: false,
    type: 'text',
    size: 'md',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const Template: StoryFn = () => ({
  components: { GcInput, MailIcon },
  setup () {
    return {};
  },
  template: '<GcInput />',
});

export const Default: Story = {
  ...Template,
};

// Prop Stories
export const Autocomplete: Story = {
  ...Template,
  args: {
    autocomplete: 'email',
  },
};

export const Disabled: Story = {
  ...Template,
  args: {
    disabled: true,
  },
};

export const HasError: Story = {
  ...Template,
  args: {
    error: 'This field is required',
  },
};

export const Label: Story = {
  ...Template,
  args: {
    label: 'Email',
  },
};

export const HasValue: Story = {
  ...Template,
  args: {
    modelValue: 'jimmiejackson414@gmail.com',
  },
};

export const Name: Story = {
  ...Template,
  args: {
    name: 'email',
  },
};

export const PasswordToggle: Story = {
  ...Template,
  args: {
    passwordToggle: true,
    type: 'password',
  },
};

export const PrependIcon: Story = {
  ...Template,
  args: {
    prependIcon: MailIcon,
  },
};

export const Required: Story = {
  ...Template,
  args: {
    required: true,
  },
};

export const EmailType: Story = {
  ...Template,
  name: 'Type (Email)',
  args: {
    type: 'email',
    required: true,
  },
};

export const PasswordType: Story = {
  ...Template,
  name: 'Type (Password)',
  args: {
    type: 'password',
  },
};

export const NumberType: Story = {
  ...Template,
  name: 'Type (Number)',
  args: {
    type: 'number',
  },
};

export const Placeholder: Story = {
  ...Template,
  args: {
    placeholder: 'Enter your email',
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

// Action Stories
// export const EmitModelValue: Story = {
//   render: () => ({
//     components: { GcInput },
//     template: '<GcInput />',
//   }),
//   play: async ({ canvasElement }) => {
//     const canvas = within(canvasElement);

//     await userEvent.type(canvas.getByTestId('gc-input'), 'This is a test');

//     await expect(canvas.getByTestId('gc-input'))
//       .toHaveValue('This is a test');
//   },
// };