import { getMockPoints } from '../mock/points.js';
import Observable from '../framework/observable.js';

export default class PointsModel extends Observable {
  /** @type {Array} Точки маршрута */
  #points = [];

  /**
   * @param {object} [params] Параметры модели
   * @param {Array} [params.points] Точки маршрута
   */
  constructor({ points = getMockPoints() } = {}) {
    super();
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

  /**
   * @param {string} updateType Тип обновления
   * @param {object} update Обновлённая точка маршрута
   */
  updatePoint(updateType, update) {
    const index = this.#points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      return;
    }

    this.#points = [
      ...this.#points.slice(0, index),
      update,
      ...this.#points.slice(index + 1)
    ];

    this._notify(updateType, update);
  }

  /**
   * @param {string} updateType Тип обновления
   * @param {object} update Новая точка маршрута
   */
  addPoint(updateType, update) {
    this.#points = [update, ...this.#points];
    this._notify(updateType, update);
  }

  /**
   * @param {string} updateType Тип обновления
   * @param {object} update Точка маршрута для удаления
   */
  deletePoint(updateType, update) {
    const index = this.#points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      return;
    }

    this.#points = [
      ...this.#points.slice(0, index),
      ...this.#points.slice(index + 1)
    ];

    this._notify(updateType, update);
  }
}
