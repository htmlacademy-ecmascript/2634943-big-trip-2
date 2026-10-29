import PointsModel from './models/points-model.js';
import DestinationsModel from './models/destinations-model.js';
import OffersModel from './models/offers-model.js';
import TripPresenter from './presenters/trip-presenter.js';
import TripApiService from './trip-api-service.js';

const headerFiltersElement = document.querySelector('.trip-controls__filters');
const mainEventsElement = document.querySelector('.trip-events');

const tripApiService = new TripApiService();

const destinationsModel = new DestinationsModel({ tripApiService });
const offersModel = new OffersModel({ tripApiService });
const pointsModel = new PointsModel({ tripApiService, destinationsModel, offersModel });

const tripPresenter = new TripPresenter({
  filterContainer: headerFiltersElement,
  tripContainer: mainEventsElement,
  pointsModel,
  offersModel,
  destinationsModel
});

tripPresenter.init();
