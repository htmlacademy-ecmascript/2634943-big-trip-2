import { render, replace } from '../framework/render.js';
import { POINT_TYPES } from '../const.js';
import PointView from '../views/point-view.js';
import EditFormView from '../views/edit-form-view.js';

export default class PointPresenter {
  /** @type {HTMLElement} Контейнер списка точек */
  #listContainer = null;

  /** @type {object|null} Модель опций */
  #offersModel = null;

  /** @type {object|null} Модель направлений */
  #destinationsModel = null;

  /** @type {PointView|null} Представление точки */
  #pointComponent = null;

  /** @type {EditFormView|null} Представление формы правки */
  #formComponent = null;

  #escDownHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#replaceFormToPoint();
    }
  };

  /**
   * @param {object} params Параметры презентера
   * @param {HTMLElement} params.listContainer Контейнер списка точек
   * @param {object} params.offersModel Модель опций
   * @param {object} params.destinationsModel Модель направлений
   */
  constructor({ listContainer, offersModel, destinationsModel }) {
    this.#listContainer = listContainer;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;
  }

  init(point) {
    const destination = this.#destinationsModel.getById(point.destination);
    const typeOffers = this.#offersModel.getByType(point.type);

    this.#pointComponent = new PointView({
      point,
      destination,
      typeOffers,
      onEditClick: () => this.#replacePointToForm()
    });

    this.#formComponent = new EditFormView({
      point,
      destination,
      typeOffers,
      destinations: this.#destinationsModel.getDestinations(),
      pointTypes: POINT_TYPES,
      onFormSubmit: () => this.#replaceFormToPoint(),
      onRollupClick: () => this.#replaceFormToPoint()
    });

    render(this.#pointComponent, this.#listContainer);
  }

  #replacePointToForm() {
    replace(this.#formComponent, this.#pointComponent);
    document.addEventListener('keydown', this.#escDownHandler);
  }

  #replaceFormToPoint() {
    if (!this.#formComponent.element.parentElement) {
      return;
    }

    replace(this.#pointComponent, this.#formComponent);
    document.removeEventListener('keydown', this.#escDownHandler);
  }
}
