import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration.js';
import isBetween from 'dayjs/plugin/isBetween.js';
import TripPresenter from './presenter/trip-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import PointsModel from './model/points-model.js';
import OffersModel from './model/offers-model.js';
import DestinationsModel from './model/destinations-model.js';
import FilterModel from './model/filter-model.js';
import NewPointButtonView from './view/new-point-button-view.js';
import { render } from './framework/render.js';
import TripApiService from './trip-api-service.js';
dayjs.extend(duration);
dayjs.extend(isBetween);

const AUTHORIZATION = 'Basic kjuf56yu9nbv34w';
const END_POINT = 'https://22.objects.htmlacademy.pro/big-trip';

const tripApiService = new TripApiService(END_POINT, AUTHORIZATION);

const siteHeaderElement = document.querySelector('.trip-main');
const filterElement = siteHeaderElement.querySelector(
  '.trip-controls__filters',
);
const tripEventsElement = document.querySelector('.trip-events');

const offersModel = new OffersModel({ tripApiService: tripApiService });
const destinationsModel = new DestinationsModel({
  tripApiService: tripApiService,
});

const pointsModel = new PointsModel({
  tripApiService,
  offersModel,
  destinationsModel,
});

const filterModel = new FilterModel();

const tripPresenter = new TripPresenter({
  tripContainer: tripEventsElement,
  pointsModel,
  offersModel,
  destinationsModel,
  filterModel,
  onNewPointDestroy: handleNewPointFormClose,
});

const filterPresenter = new FilterPresenter({
  filterContainer: filterElement,
  filterModel,
  pointsModel,
});

const newPointButtonComponent = new NewPointButtonView({
  onClick: handleNewPointButtonClick,
});

function handleNewPointFormClose() {
  newPointButtonComponent.element.disabled = false;
}

function handleNewPointButtonClick() {
  tripPresenter.createPoint();
  newPointButtonComponent.element.disabled = true;
}

filterPresenter.init();
tripPresenter.init();
pointsModel.init().finally(() => {
  render(newPointButtonComponent, siteHeaderElement);
  if (tripPresenter.isFailed) {
    newPointButtonComponent.element.disabled = true;
  }
});
