import { render } from '../framework/render.js';
import { FilterType } from '../const.js';
import { filterPoints } from '../utils/filter.js';
import FilterView from '../views/filter-view.js';

/** @const {string[]} Порядок отображения фильтров */
const FILTER_ORDER = [
  FilterType.EVERYTHING,
  FilterType.FUTURE,
  FilterType.PRESENT,
  FilterType.PAST
];

export default class FilterPresenter {
  /** @type {HTMLElement} Контейнер фильтров */
  #container = null;

  /** @type {object} Модель точек маршрута */
  #pointsModel = null;

  /**
   * @param {object} params Параметры презентера
   * @param {HTMLElement} params.container Контейнер фильтров
   * @param {object} params.pointsModel Модель точек маршрута
   */
  constructor({ container, pointsModel }) {
    this.#container = container;
    this.#pointsModel = pointsModel;
  }

  init() {
    const points = this.#pointsModel.getPoints();

    const filters = FILTER_ORDER.map((type) => ({
      type,
      count: filterPoints[type](points).length
    }));

    render(new FilterView({ filters }), this.#container);
  }
}
