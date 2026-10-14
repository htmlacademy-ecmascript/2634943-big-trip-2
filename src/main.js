import PointsModel from './models/points-model.js';
import TripPresenter from './presenters/trip-presenter.js';

const headerFiltersElement = document.querySelector('.trip-controls__filters');
const mainEventsElement = document.querySelector('.trip-events');

const pointsModel = new PointsModel();
const tripPresenter = new TripPresenter({
  filterContainer: headerFiltersElement,
  tripContainer: mainEventsElement,
  pointsModel
});

tripPresenter.init();
