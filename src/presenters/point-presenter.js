import { render, replace, remove } from '../framework/render.js';
import PointView from '../views/point-view.js';
import FormView from '../views/form-view.js';

/** @enum {string} Режим отображения точки маршрута */
const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING'
};

export default class PointPresenter {
  /** @type {HTMLElement} Контейнер списка точек */
  #listContainer = null;

  /** @type {object} Точка маршрута */
  #point = null;

  /** @type {object|null} Модель опций */
  #offersModel = null;

  /** @type {object|null} Модель направлений */
  #destinationsModel = null;

  /** @type {PointView|null} Представление точки */
  #pointComponent = null;

  /** @type {FormView|null} Представление формы правки */
  #formComponent = null;

  /** @type {string} Текущий режим отображения точки */
  #mode = Mode.DEFAULT;

  /** @type {Function|null} Обработчик изменения данных точки */
  #handleDataChange = null;

  /** @type {Function|null} Обработчик, вызываемый перед открытием формы правки */
  #handleBeforeEdit = null;

  #escDownHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#replaceFormToPoint();
    }
  };

  /**
   * @param {object} params Параметры презентера
   * @param {HTMLElement} params.listContainer Контейнер списка точек
   * @param {object} params.point Точка маршрута
   * @param {object} params.offersModel Модель опций
   * @param {object} params.destinationsModel Модель направлений
   * @param {Function} [params.onDataChange] Обработчик изменения данных точки
   * @param {Function} [params.onBeforeEdit] Обработчик, вызываемый перед открытием формы правки
   */
  constructor({ listContainer, point, offersModel, destinationsModel, onDataChange, onBeforeEdit }) {
    this.#listContainer = listContainer;
    this.#point = point;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;
    this.#handleDataChange = onDataChange;
    this.#handleBeforeEdit = onBeforeEdit;
  }

  /** Метод инициализации: создаёт представления точки и формы и отрисовывает точку */
  init() {
    const destination = this.#destinationsModel.getById(this.#point.destination);
    const typeOffers = this.#offersModel.getByType(this.#point.type);

    this.#pointComponent = new PointView({
      point: this.#point,
      destination,
      typeOffers,
      onEditClick: this.#handleEditClick,
      onFavoriteClick: this.#handleFavoriteClick
    });

    this.#formComponent = new FormView({
      point: this.#point,
      offers: this.#offersModel.getOffers(),
      destinations: this.#destinationsModel.getDestinations(),
      onFormSubmit: this.#handleFormSubmit,
      onRollupClick: this.#handleRollupClick,
      mode: 'edit'
    });

    render(this.#pointComponent, this.#listContainer);
  }

  /**
   * Метод обновления точки: пересоздаёт представления с новыми данными и подменяет их в DOM
   * @param {object} point Обновлённая точка маршрута
   */
  update(point) {
    this.#point = point;

    const destination = this.#destinationsModel.getById(this.#point.destination);
    const typeOffers = this.#offersModel.getByType(this.#point.type);

    const prevPointComponent = this.#pointComponent;
    const prevFormComponent = this.#formComponent;

    this.#pointComponent = new PointView({
      point: this.#point,
      destination,
      typeOffers,
      onEditClick: this.#handleEditClick,
      onFavoriteClick: this.#handleFavoriteClick
    });

    this.#formComponent = new FormView({
      point: this.#point,
      offers: this.#offersModel.getOffers(),
      destinations: this.#destinationsModel.getDestinations(),
      onFormSubmit: this.#handleFormSubmit,
      onRollupClick: this.#handleRollupClick,
      mode: 'edit'
    });

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#pointComponent, prevPointComponent);
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#formComponent, prevFormComponent);
    }

    remove(prevPointComponent);
    remove(prevFormComponent);
  }

  /** Метод сброса представления: возвращает точку маршрута вместо формы правки */
  resetView() {
    if (this.#mode !== Mode.EDITING) {
      return;
    }

    this.#replaceFormToPoint();
  }

  /** Метод удаления представления точки маршрута */
  destroy() {
    if (!this.#pointComponent) {
      return;
    }

    remove(this.#pointComponent);
    remove(this.#formComponent);
    document.removeEventListener('keydown', this.#escDownHandler);
  }

  /** Метод подмены точки маршрута на форму её правки */
  #replacePointToForm() {
    this.#handleBeforeEdit?.();
    replace(this.#formComponent, this.#pointComponent);
    document.addEventListener('keydown', this.#escDownHandler);
    this.#mode = Mode.EDITING;
  }

  /** Метод подмены формы правки на точку маршрута */
  #replaceFormToPoint() {
    if (!this.#formComponent.element.parentElement) {
      return;
    }

    replace(this.#pointComponent, this.#formComponent);
    document.removeEventListener('keydown', this.#escDownHandler);
    this.#mode = Mode.DEFAULT;
  }

  #handleEditClick = () => {
    this.#replacePointToForm();
  };

  #handleFavoriteClick = () => {
    this.#handleDataChange?.({ ...this.#point, isFavorite: !this.#point.isFavorite });
  };

  #handleFormSubmit = () => {
    this.#replaceFormToPoint();
  };

  #handleRollupClick = () => {
    this.#replaceFormToPoint();
  };
}
