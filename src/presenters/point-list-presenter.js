import { render } from '../framework/render.js';
import SortingView from '../views/sorting-view.js';
import ListView from '../views/list-view.js';
import NoPointView from '../views/no-point-view.js';
import PointPresenter from './point-presenter.js';
import { updateItem } from '../utils/common.js';
import { SortType } from '../const.js';
import { pointComparators } from '../utils/sorting.js';

export default class PointListPresenter {
  /** @type {HTMLElement} Контейнер списка точек */
  #container = null;

  /** @type {object} Модель точек маршрута */
  #pointsModel = null;

  /** @type {object} Модель опций */
  #offersModel = null;

  /** @type {object} Модель направлений */
  #destinationsModel = null;

  /** @type {SortingView|null} Представление формы сортировки */
  #sortingComponent = null;

  /** @type {ListView|null} Представление списка точек */
  #listComponent = null;

  /** @type {Array} Точки маршрута */
  #points = [];

  /** @type {string} Текущий тип сортировки */
  #currentSortType = SortType.DAY;

  /** @type {Map<string, PointPresenter>} Презентеры точек маршрута */
  #pointPresenters = new Map();

  /**
   * @param {object} params Параметры презентера
   * @param {HTMLElement} params.container Контейнер списка точек
   * @param {object} params.pointsModel Модель точек маршрута
   * @param {object} params.offersModel Модель опций
   * @param {object} params.destinationsModel Модель направлений
   */
  constructor({ container, pointsModel, offersModel, destinationsModel }) {
    this.#container = container;
    this.#pointsModel = pointsModel;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;
  }

  init() {
    this.#points = [...this.#pointsModel.getPoints()];

    this.#sortPoints(SortType.DAY);

    this.#renderList();
  }

  /** Метод отрисовки списка точек маршрута */
  #renderList() {
    if (this.#points.length === 0) {
      render(new NoPointView(), this.#container);
      return;
    }

    this.#renderSorting();

    this.#listComponent = new ListView();
    render(this.#listComponent, this.#container);

    this.#renderPoints();
  }

  /** Метод отрисовки формы сортировки */
  #renderSorting() {
    this.#sortingComponent = new SortingView({
      onSortTypeChange: this.#handleSortTypeChange
    });
    render(this.#sortingComponent, this.#container);
  }

  /** Метод отрисовки всех точек маршрута */
  #renderPoints() {
    this.#points.forEach((point) => this.#renderPoint(point));
  }

  /**
   * Метод отрисовки одной точки маршрута
   * @param {object} point Точка маршрута
   */
  #renderPoint(point) {
    const pointPresenter = new PointPresenter({
      listContainer: this.#listComponent.element,
      point,
      offersModel: this.#offersModel,
      destinationsModel: this.#destinationsModel,
      onDataChange: this.#handlePointChange,
      onBeforeEdit: this.#resetPointViews
    });

    pointPresenter.init();

    this.#pointPresenters.set(point.id, pointPresenter);
  }

  /**
   * Обработчик изменения данных точки маршрута
   * @param {object} updatedPoint Обновлённая точка маршрута
   */
  #handlePointChange = (updatedPoint) => {
    this.#points = updateItem(this.#points, updatedPoint);
    this.#pointPresenters.get(updatedPoint.id)?.update(updatedPoint);
  };

  /**
   * Обработчик изменения типа сортировки
   * @param {string} sortType Тип сортировки
   */
  #handleSortTypeChange = (sortType) => {
    if (!sortType || sortType === this.#currentSortType) {
      return;
    }

    this.#sortPoints(sortType);
    this.#clearPointList();
    this.#renderPoints();
  };

  /** Метод сброса представления у всех презентеров точек маршрута */
  #resetPointViews = () => {
    this.#pointPresenters.forEach((pointPresenter) => pointPresenter.resetView());
  };

  /**
   * Метод сортировки точек маршрута по типу
   * @param {string} sortType Тип сортировки
   */
  #sortPoints(sortType) {
    const comparator = pointComparators[sortType];

    if (!comparator) {
      return;
    }

    this.#points.sort(comparator);
    this.#currentSortType = sortType;
  }

  /** Метод очистки презентеров точек маршрута */
  #clearPointList() {
    this.#pointPresenters.forEach((pointPresenter) => pointPresenter.destroy());
    this.#pointPresenters.clear();
  }
}
