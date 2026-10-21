import { getMockOffers } from '../mock/offers.js';

export default class OffersModel {
  /** @type {Array} Группы опций по типам точки */
  #offers = [];

  /**
   * @param {object} [params] Параметры модели
   * @param {Array} [params.offers] Группы опций по типам точки
   */
  constructor({ offers = getMockOffers() } = {}) {
    this.#offers = [...offers];
  }

  /** @returns {Array} Группы опций по типам точки */
  get offers() {
    return this.#offers;
  }

  /** @returns {Array} Группы опций по типам точки */
  getOffers() {
    return this.#offers;
  }

  /**
   * @param {string} type Тип точки
   * @returns {Array} Опции указанного типа или пустой массив
   */
  getByType(type) {
    return this.#offers.find((group) => group.type === type)?.offers ?? [];
  }
}
