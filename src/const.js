export const POINT = ['Taxi', 'Bus', 'Train', 'Ship', 'Drive', 'Flight', 'Check-in', 'Sightseeing', 'Restaurant'];

export const mockDestinations = [
  {
    id: 'dest-1',
    description: 'Chamonix, is a beautiful valley near the junction of France, Switzerland and Italy.',
    name: 'Chamonix',
    pictures: [
      {
        src: 'https://loremflickr.com/248/152?random=32',
        description: 'Chamonix mountains'
      }
    ]
  },
  {
    id: 'dest-2',
    description: 'Amsterdam, lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    name: 'Amsterdam',
    pictures: [
      {
        src: 'https://loremflickr.com/248/152?random=45',
        description: 'Amsterdam canals'
      }
    ]
  },
  {
    id: 'dest-3',
    description: 'Geneva, full of wonderful sights and park areas.',
    name: 'Geneva',
    pictures: [
      {
        src: 'https://loremflickr.com/248/152?random=21',
        description: 'Geneva lake'
      }
    ]
  },

  {
    id: 'dest-4',
    description: '',
    name: 'Kazan',
    pictures: []
  }
];

export const mockOffers = [
  {
    type: 'taxi',
    offers: [
      {
        id: 'offer-1',
        title: 'Order Uber',
        price: 20
      },
      {
        id: 'offer-2',
        title: 'Upgrade to business',
        price: 50
      }
    ]
  },
  {
    type: 'flight',
    offers: [
      {
        id: 'offer-3',
        title: 'Add luggage',
        price: 50
      },
      {
        id: 'offer-4',
        title: 'Switch to comfort',
        price: 80
      },
      {
        id: 'offer-5',
        title: 'Add meal',
        price: 15
      }
    ]
  },
  {
    type: 'train',
    offers: [
      {
        id: 'offer-6',
        title: 'Choose seats',
        price: 5
      }
    ]
  },

  {
    type: 'drive',
    offers: []
  },
  {
    type: 'check-in',
    offers: []
  }
];
