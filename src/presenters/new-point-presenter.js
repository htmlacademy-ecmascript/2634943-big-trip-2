import { render, remove, RenderPosition } from '../framework/render.js';
import { BLANK_POINT, UpdateType } from '../const.js';
import FormView from '../views/form-view.js';

export default class NewPointPresenter {
  /** @type {HTMLElement} Контейнер для формы создания */
  #container = null;

  /** @type {object} Модель точек маршрута */
  #pointsModel = null;

  /** @type {object} Модель опций */
  #offersModel = null;

  /** @type {object} Модель направлений */
  #destinationsModel = null;

  /** @type {Function|null} Обработчик смены режима отображения форм */
  #onModeChange = null;

  /** @type {Function|null} Обработчик закрытия формы создания */
  #onClose = null;

  /** @type {FormView|null} Представление формы создания */
  #formComponent = null;

  /** @type {boolean} Открыта ли форма создания */
  #isFormOpen = false;

  #escDownHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.closeForm();
    }
  };

  /**
   * @param {object} params Параметры презентера
   * @param {HTMLElement} params.container Контейнер для формы создания
   * @param {object} params.pointsModel Модель точек маршрута
   * @param {object} params.offersModel Модель опций
   * @param {object} params.destinationsModel Модель направлений
   * @param {Function} [params.onModeChange] Обработчик смены режима отображения форм
   * @param {Function} [params.onClose] Обработчик закрытия формы создания
   */
  constructor({ container, pointsModel, offersModel, destinationsModel, onModeChange, onClose }) {
    this.#container = container;
    this.#pointsModel = pointsModel;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;
    this.#onModeChange = onModeChange;
    this.#onClose = onClose;
  }

  /** Метод открытия формы создания точки */
  openForm() {
    if (this.#isFormOpen) {
      return;
    }

    this.#isFormOpen = true;

    this.#formComponent = new FormView({
      point: BLANK_POINT,
      offers: this.#offersModel.getOffers(),
      destinations: this.#destinationsModel.getDestinations(),
      onFormSubmit: this.#handleFormSubmit,
      onReset: this.closeForm.bind(this),
      onDeleteClick: null,
      onRollupClick: this.closeForm.bind(this),
      mode: 'create'
    });

    render(this.#formComponent, this.#container, RenderPosition.AFTERBEGIN);
    document.addEventListener('keydown', this.#escDownHandler);
  }

  /** Метод закрытия формы создания без сохранения */
  closeForm() {
    if (!this.#isFormOpen) {
      return;
    }

    remove(this.#formComponent);
    this.#formComponent = null;
    document.removeEventListener('keydown', this.#escDownHandler);
    this.#isFormOpen = false;
    this.#onClose?.();
  }

  /** Обработчик отправки формы создания */
  #handleFormSubmit = () => {
    const state = this.#formComponent._state;

    const newPoint = {
      id: String(Date.now() + Math.random()),
      basePrice: state.basePrice,
      dateFrom: state.dateFrom instanceof Date ? state.dateFrom.toISOString() : state.dateFrom,
      dateTo: state.dateTo instanceof Date ? state.dateTo.toISOString() : state.dateTo,
      destination: state.destination,
      isFavorite: state.isFavorite ?? false,
      offers: state.offers ?? [],
      type: state.type
    };

    this.#pointsModel.addPoint(UpdateType.MAJOR, newPoint);
    this.closeForm();
  };
}
