const EVENT_TYPES = [
  'bus',
  'check-in',
  'drive',
  'flight',
  'restaurant',
  'ship',
  'sightseeing',
  'taxi',
  'train',
];

const DEFAULT_TYPE = 'flight';

const DEFAULT_POINT = {
  startDateTime: '',
  endDateTime: '',
  type: DEFAULT_TYPE,
  destinationId: null,
  destination: {
    id: null,
    title: '',
    description: '',
    photos: [],
  },
  price: 0,
  offersIds: [],
  offers: [],
  isFavorite: false,
};

const SortType = {
  DATE: 'day',
  EVENT: 'event',
  TIME: 'time',
  PRICE: 'price',
  OFFER: 'offer',
};

const FilterType = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PRESENT: 'present',
  PAST: 'past',
};

const UserAction = {
  UPDATE_POINT: 'UPDATE_POINT',
  ADD_POINT: 'ADD_POINT',
  DELETE_POINT: 'DELETE_POINT',
};

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT',
  FAILED: 'FAILED',
};

export {
  EVENT_TYPES,
  DEFAULT_TYPE,
  DEFAULT_POINT,
  FilterType,
  SortType,
  UserAction,
  UpdateType,
};
