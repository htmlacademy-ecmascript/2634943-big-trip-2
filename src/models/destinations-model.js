import Observable from '../framework/observable.js';
import { UpdateType } from '../const.js';

export default class DestinationsModel extends Observable {
  /** @type {Array} Направления */
  #destinations = [];

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

  /** Асинхронная инициализация модели: загрузка направлений с сервера */
  async init() {
    try {
      this.#destinations = await this.#tripApiService.destinations;
      this._notify(UpdateType.INIT);
    } catch (err) {
      this._notify(UpdateType.FAILED);
    }
  }
}
