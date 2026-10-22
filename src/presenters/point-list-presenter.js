import { render } from '../framework/render.js';
import SortingView from '../views/sorting-view.js';
import ListView from '../views/list-view.js';
import NoPointView from '../views/no-point-view.js';
import PointPresenter from './point-presenter.js';
import { updateItem } from '../utils/common.js';

export default class PointListPresenter {
  /** @type {HTMLElement} Контейнер списка точек */
  #container = null;

  /** @type {object} Модель точек маршрута */
  #pointsModel = null;

  /** @type {object} Модель опций */
  #offersModel = null;

  /** @type {object} Модель направлений */
  #destinationsModel = null;

  /** @type {ListView|null} Представление списка точек */
  #listComponent = null;

  /** @type {Array} Точки маршрута */
  #points = [];

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

    this.#renderList();
  }

  /** Метод отрисовки списка точек маршрута */
  #renderList() {
    if (this.#points.length === 0) {
      render(new NoPointView(), this.#container);
      return;
    }

    render(new SortingView(), this.#container);

    this.#listComponent = new ListView();
    render(this.#listComponent, this.#container);

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

  /** Метод сброса представления у всех презентеров точек маршрута */
  #resetPointViews = () => {
    this.#pointPresenters.forEach((pointPresenter) => pointPresenter.resetView());
  };
}
