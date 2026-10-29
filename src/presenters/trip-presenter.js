import { render, remove } from '../framework/render.js';
import FilterPresenter from './filter-presenter.js';
import PointListPresenter from './point-list-presenter.js';
import NewPointPresenter from './new-point-presenter.js';
import NewPointButtonView from '../views/new-point-button-view.js';
import MessageView from '../views/message-view.js';
import FilterModel from '../models/filter-model.js';
import UiBlocker from '../framework/ui-blocker.js';
import { FilterType, UpdateType } from '../const.js';

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

  /** @type {object} Модель фильтра */
  #filterModel = null;

  /** @type {FilterPresenter|null} Презентер фильтров */
  #filterPresenter = null;

  /** @type {PointListPresenter|null} Презентер списка точек */
  #pointListPresenter = null;

  /** @type {NewPointPresenter|null} Презентер создания точки */
  #newPointPresenter = null;

  /** @type {NewPointButtonView|null} Представление кнопки создания точки */
  #newPointButtonComponent = null;

  /** @type {MessageView|null} Представление сообщения о состоянии загрузки */
  #messageComponent = null;

  /** @type {UiBlocker|null} Блокировщик интерфейса */
  #uiBlocker = null;

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

  /** Асинхронная инициализация презентера: ожидает загрузки данных с сервера */
  async init() {
    this.#filterModel = new FilterModel();

    this.#filterPresenter = new FilterPresenter({
      container: this.#filterContainer,
      pointsModel: this.#pointsModel,
      filterModel: this.#filterModel
    });

    this.#uiBlocker = new UiBlocker();

    this.#pointListPresenter = new PointListPresenter({
      container: this.#tripContainer,
      pointsModel: this.#pointsModel,
      filterModel: this.#filterModel,
      offersModel: this.#offersModel,
      destinationsModel: this.#destinationsModel,
      uiBlocker: this.#uiBlocker,
      onModeChange: this.#handleModeChange
    });

    this.#newPointPresenter = new NewPointPresenter({
      container: this.#tripContainer,
      pointsModel: this.#pointsModel,
      offersModel: this.#offersModel,
      destinationsModel: this.#destinationsModel,
      uiBlocker: this.#uiBlocker,
      onModeChange: this.#handleModeChange,
      onClose: this.#handleNewPointClose
    });

    this.#pointsModel.addObserver(this.#handleModelEvent);

    this.#renderMessage('Loading...');

    await this.#pointsModel.init();
  }

  /** Метод отрисовки кнопки «New event» */
  #renderNewPointButton() {
    this.#newPointButtonComponent = new NewPointButtonView({
      onClick: this.#handleNewPointButtonClick
    });

    render(this.#newPointButtonComponent, this.#filterContainer.parentElement.parentElement);
  }

  /** Обработчик клика по кнопке «New event» */
  #handleNewPointButtonClick = () => {
    this.#pointListPresenter.resetView();
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.#newPointButtonComponent.disable();
    this.#newPointPresenter.openForm();
  };

  /** Обработчик смены режима отображения форм: закрывает формы других презентеров */
  #handleModeChange = () => {
    this.#newPointPresenter.closeForm();
  };

  /** Обработчик закрытия формы создания: разблокирует кнопку «New event» */
  #handleNewPointClose = () => {
    this.#newPointButtonComponent.enable();
  };

  /** Обработчик событий модели точек маршрута */
  #handleModelEvent = (updateType) => {
    switch (updateType) {
      case UpdateType.INIT:
        this.#removeMessage();
        this.#renderNewPointButton();
        this.#filterPresenter.init();
        this.#pointListPresenter.init();
        break;
      case UpdateType.FAILED:
        this.#removeMessage();
        this.#renderMessage('Failed to load latest route information');
        break;
      default:
        break;
    }
  };

  /** Метод отрисовки сообщения о состоянии загрузки */
  #renderMessage(message) {
    this.#messageComponent = new MessageView({ message });
    render(this.#messageComponent, this.#tripContainer);
  }

  /** Метод удаления сообщения о состоянии загрузки */
  #removeMessage() {
    remove(this.#messageComponent);
    this.#messageComponent = null;
  }
}
