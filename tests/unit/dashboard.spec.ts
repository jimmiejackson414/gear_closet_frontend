import { mountSuspended } from '@nuxt/test-utils/runtime';
import { afterEach, describe, expect, it, vi } from 'vitest';
import UpcomingTripsWidget from '@/components/dashboard/UpcomingTripsWidget.vue';
import FriendsWidget from '@/components/dashboard/FriendsWidget.vue';
import InvitationsWidget from '@/components/dashboard/InvitationsWidget.vue';
import { friends, upcomingTrips } from './mocks/dashboard.mock';

describe('Dashboard', async () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  // ************************** //
  // UpcomingTripsWidget states //
  // ************************** //
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

  // ******************** //
  // FriendsWidget states //
  // ******************** //
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
      .toBe(friends.length);

    expect(wrapper.text())
      .toContain(`Friends (${friends.length})`);

    // expect(mockBuildImageSrc)
    //   .toHaveBeenCalledTimes(friends.length);

    // const avatarComponents = wrapper.findAllComponents({ name: 'GcAvatar' });
    // const additionalFriendsLink = wrapper.findComponent({ name: 'NuxtLink' });

    // if (friends.length <= 5) {
    //   expect(avatarComponents.length)
    //     .toBe(friends.length);
    //   expect(additionalFriendsLink.exists())
    //     .toBe(false);
    // } else {
    //   expect(avatarComponents.length)
    //     .toBe(5);
    //   expect(additionalFriendsLink.exists())
    //     .toBe(true);
    //   expect(additionalFriendsLink.text())
    //     .toBe(`+${friends.length - 5}`);
    // }

    // avatarComponents.forEach((avatarComponent, index) => {
    //   expect(avatarComponent.props('profile'))
    //     .toBe(friends[index].friend);
    // });
  });

  // ************************ //
  // InvitationsWidget states //
  // ************************ //
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
});