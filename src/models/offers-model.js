import Observable from '../framework/observable.js';
import { UpdateType } from '../const.js';

export default class OffersModel extends Observable {
  /** @type {Array} Группы опций по типам точки */
  #offers = [];

  /** @type {object} Сервис для работы с API */
  #tripApiService = null;

  /**
   * @param {object} params Параметры модели
   * @param {object} params.tripApiService Сервис для работы с API
   */
  constructor({ tripApiService }) {
    super();
    this.#tripApiService = tripApiService;
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

  /** Асинхронная инициализация модели: загрузка опций с сервера */
  async init() {
    try {
      this.#offers = await this.#tripApiService.offers;
      this._notify(UpdateType.INIT);
    } catch (err) {
      this._notify(UpdateType.FAILED);
    }
  }
}
