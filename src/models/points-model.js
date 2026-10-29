import Observable from '../framework/observable.js';
import { UpdateType } from '../const.js';

export default class PointsModel extends Observable {
  /** @type {Array} Точки маршрута */
  #points = [];

  /** @type {object} Сервис для работы с API */
  #tripApiService = null;

  /** @type {object} Модель направлений */
  #destinationsModel = null;

  /** @type {object} Модель опций */
  #offersModel = null;

  /**
   * @param {object} params Параметры модели
   * @param {object} params.tripApiService Сервис для работы с API
   * @param {object} params.destinationsModel Модель направлений
   * @param {object} params.offersModel Модель опций
   */
  constructor({ tripApiService, destinationsModel, offersModel }) {
    super();
    this.#tripApiService = tripApiService;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
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
   * Асинхронная инициализация модели: загрузка точек маршрута с сервера.
   * Сначала загружаются направления и опции, затем сами точки.
   */
  async init() {
    try {
      await this.#destinationsModel.init();
      await this.#offersModel.init();

      this.#points = await this.#tripApiService.points;
      this._notify(UpdateType.INIT);
    } catch (err) {
      this._notify(UpdateType.FAILED);
    }
  }

  /**
   * Отправляет обновлённую точку на сервер и только после успеха обновляет локальные данные
   * @param {object} update Обновлённая точка маршрута
   * @returns {Promise<object>} Обновлённая точка маршрута
   */
  async updatePoint(update) {
    const updatedPoint = await this.#tripApiService.updatePoint(update);

    const index = this.#points.findIndex((point) => point.id === updatedPoint.id);

    if (index === -1) {
      return;
    }

    this.#points = [
      ...this.#points.slice(0, index),
      updatedPoint,
      ...this.#points.slice(index + 1)
    ];

    this._notify(UpdateType.MINOR, updatedPoint);
  }

  /**
   * Отправляет новую точку на сервер и только после успеха добавляет её локально
   * @param {string} updateType Тип обновления
   * @param {object} update Новая точка маршрута
   * @returns {Promise<object>} Созданная точка маршрута
   */
  async addPoint(updateType, update) {
    const newPoint = await this.#tripApiService.addPoint(update);

    this.#points = [newPoint, ...this.#points];
    this._notify(updateType, newPoint);

    return newPoint;
  }

  /**
   * Отправляет запрос на удаление точки на сервер и только после успеха удаляет её локально
   * @param {string} updateType Тип обновления
   * @param {object} update Точка маршрута для удаления
   */
  async deletePoint(updateType, update) {
    await this.#tripApiService.deletePoint(update);

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
