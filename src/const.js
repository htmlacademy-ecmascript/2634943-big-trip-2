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

/** @enum {string} Перечисление типов сортировки */
export const SortType = {
  DAY: 'day',
  TIME: 'time',
  PRICE: 'price'
};
