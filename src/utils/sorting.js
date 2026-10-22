import dayjs from 'dayjs';
import { SortType } from '../const.js';
import { getPointDurationInMinutes } from './point.js';

/**
 * @enum {Function} Компараторы точек маршрута для сортировки
 */
export const pointComparators = {
  [SortType.DAY]: (pointA, pointB) => dayjs(pointA.dateFrom).diff(dayjs(pointB.dateFrom)),
  [SortType.TIME]: (pointA, pointB) => (
    getPointDurationInMinutes(pointB.dateFrom, pointB.dateTo) -
    getPointDurationInMinutes(pointA.dateFrom, pointA.dateTo)
  ),
  [SortType.PRICE]: (pointA, pointB) => pointB.basePrice - pointA.basePrice
};
