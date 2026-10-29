import AbstractView from '../framework/view/abstract-view.js';
import { buildRouteString, buildDatesString, calcTotalPrice } from '../utils/point.js';

const createTripInfoTemplate = (route, dates, cost) => `
  <section class="trip-main__trip-info  trip-info">
    <div class="trip-info__main">
      <h1 class="trip-info__title">${route}</h1>
      <p class="trip-info__dates">${dates}</p>
    </div>
    <p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">${cost}</span>
    </p>
  </section>
`;

const createEmptyTripInfoTemplate = () => `
  <section class="trip-main__trip-info  trip-info"></section>
`;

export default class TripInfoView extends AbstractView {
  /** @type {Array} Точки маршрута */
  #points = [];

  /** @type {object} Модель направлений */
  #destinationsModel = null;

  /** @type {object} Модель опций */
  #offersModel = null;

  /**
   * @param {object} [params] Параметры представления
   * @param {Array} [params.points] Точки маршрута
   * @param {object} [params.destinationsModel] Модель направлений
   * @param {object} [params.offersModel] Модель опций
   */
  constructor({ points = [], destinationsModel = null, offersModel = null } = {}) {
    super();
    this.#points = points;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
  }

  get template() {
    if (this.#points.length === 0) {
      return createEmptyTripInfoTemplate();
    }

    const route = buildRouteString(this.#points, this.#destinationsModel);
    const dates = buildDatesString(this.#points);
    const cost = calcTotalPrice(this.#points, this.#offersModel);

    return createTripInfoTemplate(route, dates, cost);
  }
}
