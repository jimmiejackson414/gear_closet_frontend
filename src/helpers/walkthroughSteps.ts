import type { StepEntity } from 'v-onboarding/src/types/StepEntity';

export const dashboardSteps = (callback: () => any): StepEntity[] => [
  {
    attachTo: {
      element: '.drawer-logo',
    },
    content: {
      title: 'Welcome!',
      description: "It looks like this is your first time using Gear Closet, so we'd like to show you around really quick.",
    },
  },
  {
    attachTo: {
      element: '#dashboard-link',
    },
    content: {
      title: 'Dashboard',
      description: 'The Dashboard gives you a quick overview of your upcoming trips and the latest news, among other things.',
    },
  },
  {
    attachTo: {
      element: '#closet-link',
    },
    content: {
      title: 'Closet',
      description: 'The Closet Page is where you\'ll keep track of all of your gear and build pack lists.',
    },
  },
  {
    attachTo: {
      element: '#planning-link',
    },
    content: {
      title: 'Planning',
      description: 'The Planning page is where you can plan your next adventure and invite friends!',
    },
  },
  {
    attachTo: {
      element: '#friends-link',
    },
    content: {
      title: 'Friends',
      description: 'The Friends page is where you can find all of your friends and their gear.',
    },
  },
  {
    attachTo: {
      element: '#forums-link',
    },
    content: {
      title: 'Forums',
      description: 'This members-only area is where you can discuss all things backpacking-related, including the buying and selling of gear.',
    },
  },
  {
    attachTo: {
      element: '#profile-link',
    },
    content: {
      title: 'Profile',
      description: 'Lastly, you\'ll be able to update your settings, change your avatar, and update your subscription on the Profile page.',
    },
    on: {
      afterStep: () => callback(),
    },
  },
];

export const closetSteps = (callback: () => any): StepEntity[] => [
  {
    attachTo: {
      element: '.page-title',
    },
    content: {
      title: 'Closet Page',
      description: 'Looks like this is your first time visiting this page! This is where you\'ll keep track of all of your gear and build pack lists.',
    },
    options: {
      popper: {
        placement: 'right-end',
      },
      overlay: {
        enabled: true,
        padding: 8,
        borderRadius: 32,
      },
    },
  },
  {
    attachTo: {
      element: '.actions-row',
    },
    content: {
      title: 'Actions',
      description: 'Choose which pack to work on, create a new one, share it with your friends, or even import your items from a CSV!',
    },
    options: {
      popper: {
        placement: 'bottom',
      },
      overlay: {
        enabled: true,
        padding: 8,
        borderRadius: 32,
      },
    },
    on: {
      afterStep: () => callback(),
    },
  },
];

export const planningSteps = (callback: () => any): StepEntity[] => [
  {
    attachTo: {
      element: '.page-title',
    },
    content: {
      title: 'Planning Page',
      description: 'Looks like this is your first time visiting this page. This is where you can plan your next adventure and invite friends!',
    },
    options: {
      popper: {
        placement: 'right-end',
      },
      overlay: {
        enabled: true,
        padding: 8,
        borderRadius: 32,
      },
    },
  },
  {
    attachTo: {
      element: '.select-row .inline-flex',
    },
    content: {
      title: 'Trips',
      description: 'Here you can select the trip you want to plan, or create a new one.',
    },
    options: {
      overlay: {
        enabled: true,
        padding: 8,
        borderRadius: 32,
      },
    },
  },
  {
    attachTo: {
      element: '#pack-widget',
    },
    content: {
      title: 'Selected Pack',
      description: 'This is the pack you\'ve selected to bring on your selected trip. Switch it out by clicking the settings icon in the top right.',
    },
    options: {
      overlay: {
        enabled: true,
        padding: 8,
        borderRadius: 32,
      },
    },
  },
  {
    attachTo: {
      element: '#friends-widget',
    },
    content: {
      title: 'Friends',
      description: 'Here is where you can see friends you\'ve invited to your trip. You can also invite new friends to your trip.',
    },
    options: {
      overlay: {
        enabled: true,
        padding: 8,
        borderRadius: 32,
      },
    },
  },
  {
    attachTo: {
      element: '#todos-widget',
    },
    content: {
      title: 'Todos',
      description: 'This is a great place to keep track of any tasks you need to do before hitting the trailhead.',
    },
    options: {
      overlay: {
        enabled: true,
        padding: 8,
        borderRadius: 32,
      },
    },
  },
  {
    attachTo: {
      element: '#shopping-widget',
    },
    content: {
      title: 'Shopping List',
      description: 'Similar to the todos, this is a list of items you need to buy before you can hit the trailhead.',
    },
    options: {
      overlay: {
        enabled: true,
        padding: 8,
        borderRadius: 32,
      },
    },
  },
  {
    attachTo: {
      element: '#hike-details-widget',
    },
    content: {
      title: 'Hike Details',
      description: 'This widget allows you to add information about the hike you\'re planning to do, such as how many miles it is or what its elevation gain is.',
    },
    options: {
      overlay: {
        enabled: true,
        padding: 8,
        borderRadius: 32,
      },
    },
  },
  {
    attachTo: {
      element: '#trip-details-widget',
    },
    content: {
      title: 'Trip Details',
      description: 'Similar to the Hike Details, this widget allows you to add information about the trip such as flight or hotel information.',
    },
    options: {
      overlay: {
        enabled: true,
        padding: 8,
        borderRadius: 32,
      },
    },
    on: {
      afterStep: () => callback(),
    },
  },
];
