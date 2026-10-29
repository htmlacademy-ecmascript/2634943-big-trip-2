/** @enum {string[]} Список типов точки маршрута */
export const POINT_TYPES = [
  'taxi',
  'bus',
  'train',
  'ship',
  'drive',
  'flight',
  'check-in',
  'sightseeing',
  'restaurant'
];

/** @const {object} Заготовка точки маршрута для формы создания */
export const BLANK_POINT = {
  basePrice: 0,
  dateFrom: null,
  dateTo: null,
  destination: null,
  id: String(Date.now() + Math.random()),
  isFavorite: false,
  offers: [],
  type: 'flight'
};

/** @enum {string} Перечисление типов фильтров */
export const FilterType = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PRESENT: 'present',
  PAST: 'past'
};

/** @enum {string} Перечисление действий пользователя */
export const UserAction = {
  UPDATE_POINT: 'UPDATE_POINT',
  ADD_POINT: 'ADD_POINT',
  DELETE_POINT: 'DELETE_POINT'
};

/** @enum {string} Перечисление типов обновления */
export const UpdateType = {
  INIT: 'INIT',
  FAILED: 'FAILED',
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR'
};

/** @const {Object} Тексты заглушки для каждого типа фильтра */
export const noPointsTextType = {
  [FilterType.EVERYTHING]: 'Click New Event to create your first point',
  [FilterType.FUTURE]: 'There are no future events now',
  [FilterType.PRESENT]: 'There are no present events now',
  [FilterType.PAST]: 'There are no past events now'
};

/** @enum {string} Перечисление типов сортировки */
export const SortType = {
  DAY: 'day',
  TIME: 'time',
  PRICE: 'price'
};

/** @enum {string} Тексты кнопок формы */
export const ButtonText = {
  SAVE: 'Save',
  DELETE: 'Delete',
  CANCEL: 'Cancel',
  SAVING: 'Saving...',
  DELETING: 'Deleting...'
};
