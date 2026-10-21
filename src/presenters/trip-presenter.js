import FilterPresenter from './filter-presenter.js';
import PointListPresenter from './point-list-presenter.js';

export default class TripPresenter {
  /** @type {HTMLElement} Контейнер списка точек */
  #tripContainer = null;

  /** @type {HTMLElement} Контейнер фильтров */
  #filterContainer = null;

  /** @type {object} Модель точек маршрута */
  #pointsModel = null;

  /** @type {object} Модель опций */
  #offersModel = null;

  /** @type {object} Модель направлений */
  #destinationsModel = null;

  /**
   * @param {object} params Параметры презентера
   * @param {HTMLElement} params.tripContainer Контейнер списка точек
   * @param {HTMLElement} params.filterContainer Контейнер фильтров
   * @param {object} params.pointsModel Модель точек маршрута
   * @param {object} params.offersModel Модель опций
   * @param {object} params.destinationsModel Модель направлений
   */
  constructor({ tripContainer, filterContainer, pointsModel, offersModel, destinationsModel }) {
    this.#tripContainer = tripContainer;
    this.#filterContainer = filterContainer;
    this.#pointsModel = pointsModel;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;
  }

  init() {
    const filterPresenter = new FilterPresenter({
      container: this.#filterContainer,
      pointsModel: this.#pointsModel
    });

    const pointListPresenter = new PointListPresenter({
      container: this.#tripContainer,
      pointsModel: this.#pointsModel,
      offersModel: this.#offersModel,
      destinationsModel: this.#destinationsModel
    });

    filterPresenter.init();
    pointListPresenter.init();
  }
}
