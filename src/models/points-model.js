import { getMockPoints } from '../mock/points.js';

export default class PointsModel {
  /** @type {Array} Точки маршрута */
  #points = [];

  /**
   * @param {object} [params] Параметры модели
   * @param {Array} [params.points] Точки маршрута
   */
  constructor({ points = getMockPoints() } = {}) {
    this.#points = [...points];
  }

  /** @returns {Array} Точки маршрута */
  get points() {
    return this.#points;
  }

  /** @returns {Array} Точки маршрута */
  getPoints() {
    return this.#points;
  }
}
