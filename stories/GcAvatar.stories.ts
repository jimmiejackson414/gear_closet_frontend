import GcAvatar from '@/components/common/GcAvatar.vue';
import type { Meta, StoryObj, StoryFn } from '@storybook/vue3';

const meta: Meta<typeof GcAvatar> = {
  title: 'GcAvatar',
  component: GcAvatar,
  decorators: [() => ({ template: '<div style="padding: 3rem;"><story/></div>' })],
  tags: ['autodocs'],
  argTypes: {
    border: { control: 'boolean' },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    profile: { control: { type: 'none' } },
  },
  args: { // default values
    // TODO: Fix or mock buildImageSrc
    profile: {
      "id":"61b66be5-d199-48d5-898a-c521dd6b59cc","email":"jimmiejackson414@gmail.com","first_name":"Jimmie","last_name":"Jackson","trail_name":"Walk 'n Eats","image":"61b66be5-d199-48d5-898a-c521dd6b59cc/17868.jpg","role":"USER","measuring_system":"IMPERIAL","onboard_date":"2024-03-04T00:17:46.769+00:00","address_1":null,"address_2":null,"city":"","state":"","country":"","created_at":"2024-03-02T23:43:33.212812+00:00","updated_at":"2024-03-08T18:01:09.869088+00:00","location":null},
    size: 'md',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const Template: StoryFn = () => ({
  components: { GcAvatar },
  setup () {
    return {};
  },
  template: '<GcAvatar />',
});

export const Default: Story = {
  ...Template,
  name: 'Default',
};

export const Border: Story = {
  ...Template,
  name: 'Border',
  args: {
    border: true,
  },
};

export const ExtraSmall: Story = {
  ...Template,
  name: 'Sizes (Extra Small)',
  args: {
    size: 'xs',
  },
};

export const Small: Story = {
  ...Template,
  name: 'Sizes (Small)',
  args: {
    size: 'sm',
  },
};

export const Medium: Story = {
  ...Template,
  name: 'Sizes (Medium)',
  args: {
    size: 'md',
  },
};

export const Large: Story = {
  ...Template,
  name: 'Sizes (Large)',
  args: {
    size: 'lg',
  },
};

export const ExtraLarge: Story = {
  ...Template,
  name: 'Sizes (Extra Large)',
  args: {
    size: 'xl',
  },
};

// TODO: Initials version
export const Initials: Story = {
  ...Template,
  name: 'Initials',
  args: {
    profile: {
      image: null,
    },
  },
};