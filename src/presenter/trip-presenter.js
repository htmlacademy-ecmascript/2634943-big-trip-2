import SortView from '../view/sort-view.js';
import TripListView from '../view/trip-list-view.js';
import MessageView from '../view/message-view.js';
import TripInfoView from '../view/trip-info-view.js';
import PointPresenter from './point-presenter.js';
import NewPointPresenter from './new-point-presenter.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';
import { render, RenderPosition, remove } from '../framework/render.js';
import { filter } from '../utils/filter.js';
import { SortType, UserAction, UpdateType, FilterType } from '../const.js';
import {
  sortPointsByDate,
  sortPointsByTime,
  sortPointsByPrice,
} from '../utils/point.js';

const TimeLimit = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000,
};

const noPointsTextType = {
  [FilterType.EVERYTHING]: 'Click New Event to create your first point',
  [FilterType.FUTURE]: 'There are no future events now',
  [FilterType.PAST]: 'There are no past events now',
  [FilterType.PRESENT]: 'There are no present events now',
};

export default class TripPresenter {
  #tripListComponent = new TripListView();
  #messageComponent = null;
  #sortComponent = null;
  #tripInfoComponent = null;
  #tripContainer = null;
  #pointsModel = null;
  #offersModel = null;
  #destinationsModel = null;
  #filterModel = null;
  #pointPresenters = new Map();
  #newPointPresenter = null;
  #currentSortType = SortType.DATE;
  #filterType = FilterType.EVERYTHING;
  #loadingComponent = new MessageView({ message: 'Loading...' });
  #failedComponent = new MessageView({
    message: 'Failed to load latest route information',
  });

  #isLoading = true;
  #isFailed = false;

  #uiBlocker = new UiBlocker({
    lowerLimit: TimeLimit.LOWER_LIMIT,
    upperLimit: TimeLimit.UPPER_LIMIT,
  });

  constructor({
    tripContainer,
    pointsModel,
    offersModel,
    destinationsModel,
    filterModel,
    onNewPointDestroy,
  }) {
    this.#tripContainer = tripContainer;
    this.#pointsModel = pointsModel;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;
    this.#filterModel = filterModel;

    this.#newPointPresenter = new NewPointPresenter({
      pointListContainer: this.#tripListComponent,
      offersList: this.offers,
      destinationsList: this.destinations,
      onDataChange: this.#handleViewAction,
      onDestroy: onNewPointDestroy,
    });

    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get points() {
    this.#filterType = this.#filterModel.filter;
    const points = this.#pointsModel.points;
    const filteredPoints = filter[this.#filterType](points);

    switch (this.#currentSortType) {
      case SortType.DATE:
        return filteredPoints.sort(sortPointsByDate);
      case SortType.TIME:
        return filteredPoints.sort(sortPointsByTime);
      case SortType.PRICE:
        return filteredPoints.sort(sortPointsByPrice);
    }

    return filteredPoints;
  }

  get offers() {
    return this.#offersModel.offers;
  }

  get destinations() {
    return this.#destinationsModel.destinations;
  }

  get isFailed() {
    return this.#isFailed;
  }

  init() {
    this.#renderTrip();
  }

  createPoint() {
    this.#currentSortType = SortType.DATE;
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);

    if (this.#messageComponent) {
      remove(this.#messageComponent);
    }

    this.#newPointPresenter.offersList = this.offers;
    this.#newPointPresenter.destinationsList = this.destinations;
    this.#newPointPresenter.init(() => {
      if (this.#messageComponent) {
        render(this.#messageComponent, this.#tripContainer);
      }
    });
  }

  #renderTrip() {
    render(this.#tripListComponent, this.#tripContainer);

    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }

    if (this.#isFailed) {
      this.#renderFailed();
      return;
    }

    const points = this.points;

    if (!points.length) {
      this.#renderNoPoints();
      return;
    }

    this.#renderSort();
    points.forEach((point) => this.#renderPoint(point));
    this.#renderTripInfo();
  }

  #renderPoint(point) {
    const pointPresenter = new PointPresenter({
      pointListContainer: this.#tripListComponent,
      offersList: this.offers,
      destinationsList: this.destinations,
      onDataChange: this.#handleViewAction,
      onModeChange: this.#handleModeChange,
    });

    pointPresenter.init(point);
    this.#pointPresenters.set(point.id, pointPresenter);
  }

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearTrip();
    this.#renderTrip();
  };

  #renderSort() {
    this.#sortComponent = new SortView({
      currentSortType: this.#currentSortType,
      onSortTypeChange: this.#handleSortTypeChange,
    });
    render(this.#sortComponent, this.#tripContainer, RenderPosition.AFTERBEGIN);
  }

  #renderLoading() {
    render(this.#loadingComponent, this.#tripContainer);
  }

  #renderFailed() {
    render(this.#failedComponent, this.#tripContainer);
  }

  #renderNoPoints() {
    const noPointsTextValue = noPointsTextType[this.#filterType];
    this.#messageComponent = new MessageView({
      message: noPointsTextValue,
    });

    render(this.#messageComponent, this.#tripContainer);
  }

  #renderTripInfo() {
    if (this.#tripInfoComponent) {
      remove(this.#tripInfoComponent);
    }

    this.#tripInfoComponent = new TripInfoView({
      points: this.#pointsModel.points.sort(sortPointsByDate),
    });

    render(
      this.#tripInfoComponent,
      document.querySelector('.trip-main'),
      RenderPosition.AFTERBEGIN,
    );
  }

  #handleViewAction = async (actionType, updateType, update) => {
    this.#uiBlocker.block();

    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointPresenters.get(update.id).setSaving();
        try {
          await this.#pointsModel.updatePoint(updateType, update);
        } catch (err) {
          this.#pointPresenters.get(update.id).setAborting();
        }
        break;
      case UserAction.ADD_POINT:
        this.#newPointPresenter.setSaving();
        try {
          await this.#pointsModel.addPoint(updateType, update);
        } catch (err) {
          this.#newPointPresenter.setAborting();
        }
        break;
      case UserAction.DELETE_POINT:
        this.#pointPresenters.get(update.id).setDeleting();
        try {
          await this.#pointsModel.deletePoint(updateType, update);
        } catch (err) {
          this.#pointPresenters.get(update.id).setAborting();
        }
        break;
    }

    this.#uiBlocker.unblock();
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#pointPresenters.get(data.id).init(data);
        this.#renderTripInfo();
        break;
      case UpdateType.MINOR:
        this.#clearTrip();
        this.#renderTrip();
        break;
      case UpdateType.MAJOR:
        this.#clearTrip({ resetSortType: true });
        this.#renderTrip();
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#renderTrip();
        break;
      case UpdateType.FAILED:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#isFailed = true;
        this.#renderTrip();
        break;
    }
  };

  #clearTrip = ({ resetSortType = false } = {}) => {
    this.#newPointPresenter.destroy();
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();

    remove(this.#sortComponent);
    remove(this.#loadingComponent);
    remove(this.#failedComponent);
    remove(this.#tripInfoComponent);

    if (this.#messageComponent) {
      remove(this.#messageComponent);
    }

    if (resetSortType) {
      this.#currentSortType = SortType.DATE;
    }
  };

  #handleModeChange = () => {
    this.#newPointPresenter.destroy();
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };
}
