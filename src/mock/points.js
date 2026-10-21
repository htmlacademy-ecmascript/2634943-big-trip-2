import dayjs from 'dayjs';
import { POINT_TYPES } from '../const.js';
import { getRandomArrayElement } from '../utils/common.js';
import { getMockDestinations } from './destinations.js';
import { getMockOffers } from './offers.js';

/** @const {number[]} Смещения точек относительно текущего момента, в часах */
const POINT_OFFSETS_IN_HOURS = [-48, 0, 48, 72];

/** @const {number} Длительность точки маршрута, в часах */
const POINT_DURATION_IN_HOURS = 1;

/** @const {number} Счётчик для генерации идентификаторов точек */
let pointIdCounter = 0;

/**
 * Функция для получения моковой точки маршрута
 * @param {number} [offsetInHours] Смещение относительно текущего момента, в часах
 * @returns {object} Точка маршрута
 */
export const getMockPoint = (offsetInHours = 0) => {
  const type = getRandomArrayElement(POINT_TYPES);
  const destination = getRandomArrayElement(getMockDestinations());
  const typeOffers = getMockOffers().find((group) => group.type === type);
  const offers = typeOffers ? typeOffers.offers.map((offer) => offer.id) : [];

  const dateFrom = dayjs().add(offsetInHours, 'hour');
  const dateTo = dateFrom.add(POINT_DURATION_IN_HOURS, 'hour');

  pointIdCounter += 1;

  return {
    id: `point-${pointIdCounter}`,
    basePrice: Math.floor(Math.random() * 500) + 20,
    dateFrom: dateFrom.toISOString(),
    dateTo: dateTo.toISOString(),
    destination: destination.id,
    isFavorite: Math.random() > 0.5,
    offers,
    type
  };
};

/**
 * Функция для получения набора моковых точек маршрута
 * @param {number} [count] Количество точек
 * @returns {Array} Массив точек маршрута
 */
export const getMockPoints = (count = POINT_OFFSETS_IN_HOURS.length) => (
  Array.from({ length: count }, (_, index) => getMockPoint(POINT_OFFSETS_IN_HOURS[index % POINT_OFFSETS_IN_HOURS.length]))
);
