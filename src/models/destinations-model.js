import { getMockDestinations } from '../mock/destinations.js';

export default class DestinationsModel {
  /** @type {Array} Направления */
  #destinations = [];

  /**
   * @param {object} [params] Параметры модели
   * @param {Array} [params.destinations] Направления
   */
  constructor({ destinations = getMockDestinations() } = {}) {
    this.#destinations = [...destinations];
  }

  /** @returns {Array} Направления */
  get destinations() {
    return this.#destinations;
  }

  /** @returns {Array} Направления */
  getDestinations() {
    return this.#destinations;
  }

  /**
   * @param {string} id Идентификатор направления
   * @returns {object|null} Направление или `null`, если направление не найдено
   */
  getById(id) {
    return this.#destinations.find((destination) => destination.id === id) ?? null;
  }
}
