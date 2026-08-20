import { mountSuspended } from '@nuxt/test-utils/runtime';
import { describe, expect, it, vi } from 'vitest';
import FriendsWidget from '@/components/dashboard/FriendsWidget.vue';
import InvitationsWidget from '@/components/dashboard/InvitationsWidget.vue';
import UpcomingTripsWidget from '@/components/dashboard/UpcomingTripsWidget.vue';
import { friends, invitations, upcomingTrips } from './mocks/dashboard.mock';

vi.mock('@/utils/avatar', () => ({
  buildImageSrc: vi.fn((url: string) => url),
}));

vi.mock('@/utils/displayName', () => ({
  initials: vi.fn((user) => user ? `${user.first_name.charAt(0)}${user.last_name.charAt(0)}` : 'GC'),
  friendlyUsername: vi.fn((user) => {
    if (!user) return 'a friend';
    return user.trail_name || `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'a friend';
  }),
}));

describe('Dashboard', async () => {
  describe('UpcomingTripsWidget', async () => {
    it('renders the loading state for the UpcomingTripsWidget', async () => {
      const wrapper = await mountSuspended(UpcomingTripsWidget, {
        props: {
          data: [],
          loading: true,
        },
      });
      const skeleton = wrapper.findComponent({ name: 'GcSkeleton' });
      expect(skeleton.exists())
        .toBe(true);
    });

    it('renders the empty state for the UpcomingTripsWidget', async () => {
      const wrapper = await mountSuspended(UpcomingTripsWidget, {
        props: {
          data: [],
          loading: false,
        },
      });

      const button = wrapper.findComponent({ name: 'Button' });
      const link = wrapper.findComponent({ name: 'NuxtLink' });
      expect(wrapper.text())
        .toContain('You don\'t have any upcoming trips yet!');
      expect(button.exists())
        .toBe(true);
      expect(button.text())
        .toBe('Get Started');
      expect(link.props('to'))
        .toEqual({ name: 'planning' });
    });

    it('renders upcoming trips correctly', async () => {
      const wrapper = await mountSuspended(UpcomingTripsWidget, {
        props: {
          data: upcomingTrips,
          loading: false,
        },
      });

      const tripElements = wrapper.findAll('li');
      const tripLinks = wrapper.findAllComponents({ name: 'NuxtLink' })
        .filter((link) => link.props('to')?.name === 'planning' && link.props('to')?.query?.trip);

      expect(tripElements.length)
        .toBe(upcomingTrips.length);
      expect(tripLinks.length)
        .toBe(upcomingTrips.length);

      expect(wrapper.text())
        .toContain(`Upcoming Trips (${upcomingTrips.length})`);

      tripElements.forEach((tripElement, index) => {
        const trip = upcomingTrips[index];
        expect(trip)
          .toBeDefined();
        expect(tripElement.text())
          .toContain(trip!.name);
        expect(tripElement.text())
          .toContain(trip!.description);
      });
    });
  });


  describe('FriendsWidget', async () => {
    it('renders the loading state for the FriendsWidget', async () => {
      const wrapper = await mountSuspended(FriendsWidget, {
        props: {
          data: [],
          loading: true,
        },
      });
      const skeleton = wrapper.findComponent({ name: 'GcSkeleton' });
      expect(skeleton.exists())
        .toBe(true);
    });

    it('renders the empty state for the FriendsWidget', async () => {
      const wrapper = await mountSuspended(FriendsWidget, {
        props: {
          data: [],
          loading: false,
        },
      });
      const button = wrapper.findComponent({ name: 'Button' });
      const getStartedLink = wrapper.findAllComponents({ name: 'NuxtLink' })
        .find(l => l.find('button')
          .exists());
      expect(wrapper.text())
        .toContain('You haven\'t connected with any friends yet!');
      expect(button.exists())
        .toBe(true);
      expect(button.text())
        .toBe('Get Started');
      expect(getStartedLink?.props('to'))
        .toEqual({ name: 'friends' });
    });

    it('renders friends correctly', async () => {
      const wrapper = await mountSuspended(FriendsWidget, {
        props: {
          data: friends,
          loading: false,
        },
      });

      const friendElements = wrapper.findAll('li');

      expect(friendElements.length)
        .toBe(friends.length - 1);

      expect(wrapper.text())
        .toContain(`Friends (${friends.length})`);

      friends.forEach(friend => {
        if (friend.profile?.image) {
          const imageElement = wrapper.find(`img[src="${friend.profile.image}"]`);
          expect(imageElement.exists())
            .toBe(true);
        }
      });

      if (friends.length > 5) {
        const linkElement = wrapper.find('[data-testid="friends-widget-more"]');
        expect(linkElement.exists())
          .toBe(true);
        expect(linkElement.text())
          .toBe(`+${friends.length - 5}`);
      } else {
        expect(wrapper.find('[data-testid="friends-widget-more"]')
          .exists())
          .toBe(false);
      }
    });
  });


  // ************************ //
  // InvitationsWidget states //
  // ************************ //
  describe('InvitationsWidget', async () => {
    it('renders the loading state for the InvitationsWidget', async () => {
      const wrapper = await mountSuspended(InvitationsWidget, {
        props: {
          data: [],
          loading: true,
        },
      });
      const skeleton = wrapper.findComponent({ name: 'GcSkeleton' });
      expect(skeleton.exists())
        .toBe(true);
    });

    it('renders the empty state for the InvitationsWidget', async () => {
      const wrapper = await mountSuspended(InvitationsWidget, {
        props: {
          data: [],
          loading: false,
        },
      });
      expect(wrapper.text())
        .toContain('You don\'t currently have any pending invitations.');
    });

    it('renders invitations correctly', async () => {
      const wrapper = await mountSuspended(InvitationsWidget, {
        props: {
          data: invitations,
          loading: false,
        },
      });

      const invitationElements = wrapper.findAll('li');

      expect(invitationElements.length)
        .toBe(invitations.length);

      expect(wrapper.text())
        .toContain(`Invitations (${invitations.length})`);
    });
  });

});
