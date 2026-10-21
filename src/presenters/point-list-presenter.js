import { render } from '../framework/render.js';
import SortView from '../views/sorting-view.js';
import ListView from '../views/list-view.js';
import NoPointView from '../views/no-point-view.js';
import PointPresenter from './point-presenter.js';

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
    const points = this.#pointsModel.getPoints();

    if (points.length === 0) {
      render(new NoPointView(), this.#container);
      return;
    }

    render(new SortView(), this.#container);

    this.#listComponent = new ListView();
    render(this.#listComponent, this.#container);

    points.forEach((point) => {
      const pointPresenter = new PointPresenter({
        listContainer: this.#listComponent.element,
        offersModel: this.#offersModel,
        destinationsModel: this.#destinationsModel
      });

      pointPresenter.init(point);
    });
  }
}
