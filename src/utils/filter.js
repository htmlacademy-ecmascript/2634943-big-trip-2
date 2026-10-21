import { FilterType } from '../const.js';
import { isPointFuture, isPointPast, isPointPresent } from './point.js';

/**
 * @enum {Function} Фильтры для отбора точек маршрута
 */
export const filterPoints = {
  [FilterType.EVERYTHING]: (points) => points,
  [FilterType.FUTURE]: (points) => points.filter((point) => isPointFuture(point)),
  [FilterType.PRESENT]: (points) => points.filter((point) => isPointPresent(point)),
  [FilterType.PAST]: (points) => points.filter((point) => isPointPast(point))
};
