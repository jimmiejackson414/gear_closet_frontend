import GcAlert from "@/components/common/GcAlert.vue";
import type { Meta, StoryObj, StoryFn } from '@storybook/vue3';

const meta: Meta<typeof GcAlert> = {
  title: 'GcAlert',
  component: GcAlert,
  decorators: [() => ({ template: '<div style="padding: 3rem;"><story/></div>' })],
  tags: ['autodocs'],
  argTypes: {
    message: { control: 'text' },
    severity: { control: 'select', options: ['info', 'success', 'warning', 'error'] },
  },
  args: { // default values
    severity: 'error',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const Template: StoryFn = () => ({
  components: { GcAlert },
  setup () {
    return { GcAlert };
  },
  template: '<GcAlert />',
});

export const Default: Story = {
  ...Template,
  args: {
    message: 'This is a default message',
  },
  parameters: {
    docs: {
      description: {
        story: '<b>Note</b>: The `severity` prop has a default value of `error`.',
      },
    },
  },
};

export const InfoSeverity: Story = {
  ...Template,
  name: 'Severity (Info)',
  args: {
    message: 'This is an info message',
    severity: 'info',
  },
};

export const SuccessSeverity: Story = {
  ...Template,
  name: 'Severity (Success)',
  args: {
    message: 'This is a success message',
    severity: 'positive',
  },
};

export const WarningSeverity: Story = {
  ...Template,
  name: 'Severity (Warning)',
  args: {
    message: 'This is a warning message',
    severity: 'warning',
  },
};

export const ErrorSeverity: Story = {
  ...Template,
  name: 'Severity (Error)',
  args: {
    message: 'This is an error message',
    severity: 'error',
  },
};

export const HtmlMessage: Story = {
  ...Template,
  name: 'HTML Message',
  args: {
    message: '<b>This is an <i>HTML</i> message</b>',
  },
  parameters: {
    docs: {
      description: {
        story: '<b>Note</b>: The `message` prop can contain HTML.',
      },
    },
  },
};