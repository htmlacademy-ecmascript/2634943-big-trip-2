export const EVENT_ICONS = {
  'taxi': 'img/icons/taxi.png',
  'bus': 'img/icons/bus.png',
  'train': 'img/icons/train.png',
  'ship': 'img/icons/ship.png',
  'drive': 'img/icons/drive.png',
  'flight': 'img/icons/flight.png',
  'check-in': 'img/icons/check-in.png',
  'sightseeing': 'img/icons/sightseeing.png',
  'restaurant': 'img/icons/restaurant.png',
};

export const EVENT_TYPES = [
  'taxi',
  'bus',
  'train',
  'ship',
  'drive',
  'flight',
  'check-in',
  'sightseeing',
  'restaurant',
];

export const EVENT_TYPE_LABELS = {
  'taxi': 'Taxi',
  'bus': 'Bus',
  'train': 'Train',
  'ship': 'Ship',
  'drive': 'Drive',
  'flight': 'Flight',
  'check-in': 'Check-in',
  'sightseeing': 'Sightseeing',
  'restaurant': 'Restaurant',
};

export const DESTINATIONS = [
  'Amsterdam',
  'Geneva',
  'Chamonix',
  'Paris',
];

export const BLANK_POINT = {
  type: 'flight',
  destination: null,
  dateFrom: null,
  dateTo: null,
  basePrice: 0,
  offers: [],
  selectedOffers: [],
  id: 'new',
};
