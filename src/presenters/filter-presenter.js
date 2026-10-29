import { render, replace } from '../framework/render.js';
import { FilterType, UpdateType } from '../const.js';
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

  /** @type {object} Модель фильтра */
  #filterModel = null;

  /** @type {FilterView|null} Представление фильтров */
  #filterComponent = null;

  /**
   * @param {object} params Параметры презентера
   * @param {HTMLElement} params.container Контейнер фильтров
   * @param {object} params.pointsModel Модель точек маршрута
   * @param {object} params.filterModel Модель фильтра
   */
  constructor({ container, pointsModel, filterModel }) {
    this.#container = container;
    this.#pointsModel = pointsModel;
    this.#filterModel = filterModel;
  }

  init() {
    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
    this.#renderFilters();
  }

  /**
   * Обработчик изменения моделей: перерисовывает фильтры с актуальными количествами
   */
  #handleModelEvent = () => {
    this.#renderFilters();
  };

  /** Метод отрисовки фильтров */
  #renderFilters() {
    const points = this.#pointsModel.getPoints();

    const filters = FILTER_ORDER.map((type) => ({
      type,
      count: filterPoints[type](points).length,
      isChecked: type === this.#filterModel.filter
    }));

    const newComponent = new FilterView({
      filters,
      onFilterChange: this.#handleFilterChange
    });

    if (this.#filterComponent === null) {
      render(newComponent, this.#container);
    } else {
      replace(newComponent, this.#filterComponent);
    }

    this.#filterComponent = newComponent;
  }

  /** Обработчик изменения фильтра пользователем */
  #handleFilterChange = (filterType) => {
    this.#filterModel.setFilter(UpdateType.MAJOR, filterType);
  };
}
