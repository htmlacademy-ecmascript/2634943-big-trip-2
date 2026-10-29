import { render, remove } from '../framework/render.js';
import SortingView from '../views/sorting-view.js';
import ListView from '../views/list-view.js';
import NoPointView from '../views/no-point-view.js';
import PointPresenter from './point-presenter.js';
import { SortType, UpdateType } from '../const.js';
import { filterPoints } from '../utils/filter.js';
import { pointComparators } from '../utils/sorting.js';

export default class PointListPresenter {
  /** @type {HTMLElement} Контейнер списка точек */
  #container = null;

  /** @type {object} Модель точек маршрута */
  #pointsModel = null;

  /** @type {object} Модель фильтра */
  #filterModel = null;

  /** @type {object} Модель опций */
  #offersModel = null;

  /** @type {object} Модель направлений */
  #destinationsModel = null;

  /** @type {Function|null} Обработчик смены режима отображения форм */
  #onModeChange = null;

  /** @type {SortingView|null} Представление формы сортировки */
  #sortingComponent = null;

  /** @type {ListView|null} Представление списка точек */
  #listComponent = null;

  /** @type {NoPointView|null} Представление заглушки */
  #noPointComponent = null;

  /** @type {Array} Отфильтрованные и отсортированные точки маршрута */
  #points = [];

  /** @type {string} Текущий тип сортировки */
  #currentSortType = SortType.DAY;

  /** @type {Map<string, PointPresenter>} Презентеры точек маршрута */
  #pointPresenters = new Map();

  /** @type {object|null} Блокировщик интерфейса */
  #uiBlocker = null;

  /**
   * @param {object} params Параметры презентера
   * @param {HTMLElement} params.container Контейнер списка точек
   * @param {object} params.pointsModel Модель точек маршрута
   * @param {object} params.filterModel Модель фильтра
   * @param {object} params.offersModel Модель опций
   * @param {object} params.destinationsModel Модель направлений
   * @param {object} params.uiBlocker Блокировщик интерфейса
   * @param {Function} [params.onModeChange] Обработчик смены режима отображения форм
   */
  constructor({ container, pointsModel, filterModel, offersModel, destinationsModel, uiBlocker, onModeChange }) {
    this.#container = container;
    this.#pointsModel = pointsModel;
    this.#filterModel = filterModel;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;
    this.#uiBlocker = uiBlocker;
    this.#onModeChange = onModeChange;
  }

  init() {
    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);

    this.#renderList();
  }

  /** Метод отрисовки списка точек маршрута */
  #renderList() {
    this.#clearContainer();

    const points = this.#getPoints();

    if (points.length === 0) {
      this.#noPointComponent = new NoPointView({ filterType: this.#filterModel.filter });
      render(this.#noPointComponent, this.#container);
      return;
    }

    this.#renderSorting();

    this.#listComponent = new ListView();
    render(this.#listComponent, this.#container);

    this.#renderPoints(points);
  }

  /** Возвращает отфильтрованные и отсортированные точки маршрута */
  #getPoints() {
    const points = this.#pointsModel.getPoints();
    const filteredPoints = filterPoints[this.#filterModel.filter](points);

    return [...filteredPoints].sort(pointComparators[this.#currentSortType]);
  }

  /** Метод отрисовки формы сортировки */
  #renderSorting() {
    this.#sortingComponent = new SortingView({
      onSortTypeChange: this.#handleSortTypeChange,
      sortType: this.#currentSortType
    });
    render(this.#sortingComponent, this.#container);
  }

  /** Метод отрисовки всех точек маршрута */
  #renderPoints(points) {
    points.forEach((point) => this.#renderPoint(point));
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
      pointsModel: this.#pointsModel,
      uiBlocker: this.#uiBlocker,
      onDataChange: this.#handlePointChange,
      onDeleteClick: this.#handlePointDelete,
      onBeforeEdit: this.#resetPointViews
    });

    pointPresenter.init();

    this.#pointPresenters.set(point.id, pointPresenter);
  }

  /**
   * Обработчик изменения данных точки маршрута
   * @param {object} updatedPoint Обновлённая точка маршрута
   */
  #handlePointChange = async (updatedPoint) => {
    await this.#pointsModel.updatePoint(updatedPoint);
  };

  /**
   * Обработчик удаления точки маршрута
   * @param {object} point Точка маршрута для удаления
   */
  #handlePointDelete = async (point) => {
    await this.#pointsModel.deletePoint(UpdateType.MAJOR, point);
  };

  /**
   * Обработчик изменения данных моделей
   * @param {string} updateType Тип обновления
   * @param {object} update Данные обновления
   */
  #handleModelEvent = (updateType, update) => {
    if (typeof update === 'string') {
      this.#currentSortType = SortType.DAY;
    }

    this.#renderList();
  };

  /** Обработчик изменения типа сортировки */
  #handleSortTypeChange = (sortType) => {
    if (!sortType || sortType === this.#currentSortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#renderList();
  };

  /** Метод сброса представления у всех презентеров точек маршрута */
  resetView() {
    this.#resetPointViews();
  }

  /** Метод сброса типа сортировки */
  resetSorting() {
    this.#currentSortType = SortType.DAY;
  }

  #resetPointViews = () => {
    this.#pointPresenters.forEach((pointPresenter) => pointPresenter.resetView());
    this.#onModeChange?.();
  };

  /** Метод очистки контейнера от представлений списка */
  #clearContainer() {
    remove(this.#sortingComponent);
    remove(this.#listComponent);
    remove(this.#noPointComponent);

    this.#sortingComponent = null;
    this.#listComponent = null;
    this.#noPointComponent = null;

    this.#clearPointList();
  }

  /** Метод очистки презентеров точек маршрута */
  #clearPointList() {
    this.#pointPresenters.forEach((pointPresenter) => pointPresenter.destroy());
    this.#pointPresenters.clear();
  }
}
