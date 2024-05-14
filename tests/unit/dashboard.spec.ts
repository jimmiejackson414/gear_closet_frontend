import { mountSuspended } from '@nuxt/test-utils/runtime';
import { describe, expect, it, vi } from 'vitest';
import UpcomingTripsWidget from '@/components/dashboard/UpcomingTripsWidget.vue';
import FriendsWidget from '@/components/dashboard/FriendsWidget.vue';
import InvitationsWidget from '@/components/dashboard/InvitationsWidget.vue';
import { friends, invitations, upcomingTrips } from './mocks/dashboard.mock';

vi.mock('@/utils/helpers', () => {
  const buildImageSrc = vi.fn((url: string) => url);
  const mockInitials = vi.fn((user) => user ? `${user.first_name.charAt(0)}${user.last_name.charAt(0)}` : 'GC');

  return {
    buildImageSrc,
    initials: mockInitials,
  };
});

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

      const gcButton = wrapper.findComponent({ name: 'GcButton' });
      expect(wrapper.text())
        .toContain('You don\'t have any upcoming trips yet!');
      expect(gcButton.exists())
        .toBe(true);
      expect(gcButton.text())
        .toBe('Get Started');
      expect(gcButton.props('to'))
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

      expect(tripElements.length)
        .toBe(upcomingTrips.length);

      expect(wrapper.text())
        .toContain(`Upcoming Trips (${upcomingTrips.length})`);

      tripElements.forEach((tripElement, index) => {
        expect(tripElement.text())
          .toContain(upcomingTrips[index].name);
        expect(tripElement.text())
          .toContain(upcomingTrips[index].description);
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
      const gcButton = wrapper.findComponent({ name: 'GcButton' });
      expect(wrapper.text())
        .toContain('You haven\'t connected with any friends yet!');
      expect(gcButton.exists())
        .toBe(true);
      expect(gcButton.text())
        .toBe('Get Started');
      expect(gcButton.props('to'))
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