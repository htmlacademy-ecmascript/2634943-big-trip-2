import { FilterType } from '../const.js';
import { isFuturePoint, isPresentPoint, isPastPoint } from './point.js';

const filter = {
  [FilterType.EVERYTHING]: (points) => points,
  [FilterType.FUTURE]: (points) =>
    points.filter((point) => isFuturePoint(point)),
  [FilterType.PRESENT]: (points) =>
    points.filter((point) => isPresentPoint(point)),
  [FilterType.PAST]: (points) => points.filter((point) => isPastPoint(point)),
};

export { filter };
