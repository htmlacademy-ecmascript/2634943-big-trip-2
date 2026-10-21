import PointsModel from './models/points-model.js';
import DestinationsModel from './models/destinations-model.js';
import OffersModel from './models/offers-model.js';
import TripPresenter from './presenters/trip-presenter.js';

const headerFiltersElement = document.querySelector('.trip-controls__filters');
const mainEventsElement = document.querySelector('.trip-events');

const pointsModel = new PointsModel();
const destinationsModel = new DestinationsModel();
const offersModel = new OffersModel();

const tripPresenter = new TripPresenter({
  filterContainer: headerFiltersElement,
  tripContainer: mainEventsElement,
  pointsModel,
  offersModel,
  destinationsModel
});

tripPresenter.init();
