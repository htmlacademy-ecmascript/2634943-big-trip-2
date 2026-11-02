import he from 'he';
import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { humanizePointDateTime } from '../utils/point.js';

const createRouteString = (points) => {
  const destinations = points.map((point) =>
    he.encode(point.destination.title),
  );

  if (destinations.length > 3) {
    return `${destinations[0]} &mdash; ... &mdash; ${destinations.at(-1)}`;
  }

  if (destinations.length > 1) {
    return destinations.join(' &mdash; ');
  }

  return destinations[0];
};

const createDatesString = (points) => {
  const start = humanizePointDateTime(points[0].startDateTime, 'DD MMM');
  const end = humanizePointDateTime(points.at(-1).endDateTime, 'DD MMM');

  const monthRegex = /[A-Za-z]{3}/;
  const startMonth = start.match(monthRegex)[0];
  const endMonth = end.match(monthRegex)[0];

  if (startMonth === endMonth) {
    start.replace(monthRegex, '');
  }

  return `${start.toUpperCase()}&nbsp;&mdash;&nbsp;${end.toUpperCase()}`;
};

const createTripInfoTemplate = (points) => {
  if (points.length === 0) {
    return '<section class="trip-main__trip-info  trip-info"></section>';
  }

  const totalPrice = points.reduce((sum, point) => {
    const offers = point.offers.reduce(
      (offersSum, offer) => offersSum + offer.price,
      0,
    );
    const total = offers + point.price;
    return sum + total;
  }, 0);

  return `<section class="trip-main__trip-info  trip-info">
            <div class="trip-info__main">
              <h1 class="trip-info__title">${createRouteString(points)}</h1>

              <p class="trip-info__dates">${createDatesString(points)}</p>
            </div>

            <p class="trip-info__cost">
              Total: &euro;&nbsp;<span class="trip-info__cost-value">${totalPrice}</span>
            </p>
          </section>`;
};

export default class TripInfoView extends AbstractStatefulView {
  #points = null;

  constructor({ points }) {
    super();
    this.#points = points;
  }

  get template() {
    return createTripInfoTemplate(this.#points);
  }
}
