import he from 'he';
import dayjs from 'dayjs';
import AbstractView from '../framework/view/abstract-view.js';
import {
  humanizePointDateTime,
  calcDuration,
  formatDuration,
} from '../utils/point.js';

const DATE_FORMAT = 'YYYY-MM-DD';
const SHORT_DATE_FORMAT = 'MMM DD';
const TIME_FORMAT = 'HH:mm';
const DATE_TIME_FORMAT = 'YYYY-MM-DDTHH:mm';

const createPointOffersTemplate = (point) =>
  point.offers
    .map(
      (offer) =>
        `<li class="event__offer">
        <span class="event__offer-title">${he.encode(offer.title)}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${offer.price}</span>
        </li>`,
    )
    .join('');

const createPointTemplate = (point) => {
  const { startDateTime, endDateTime, type, destination } = point;

  return `<li class="trip-events__item">
              <div class="event">
                <time class="event__date" datetime="${he.encode(humanizePointDateTime(startDateTime, DATE_FORMAT))}">
                  ${he.encode(humanizePointDateTime(startDateTime, SHORT_DATE_FORMAT))}
                </time>
                <div class="event__type">
                  <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
                </div>
                <h3 class="event__title">${he.encode(type)} ${he.encode(destination.title)}</h3>
                <div class="event__schedule">
                  <p class="event__time">
                    <time class="event__start-time" datetime="${he.encode(humanizePointDateTime(startDateTime, DATE_TIME_FORMAT))}">
                      ${he.encode(humanizePointDateTime(startDateTime, TIME_FORMAT))}
                    </time>
                    &mdash;
                    <time class="event__end-time" datetime="${he.encode(humanizePointDateTime(endDateTime, DATE_TIME_FORMAT))}">
                      ${he.encode(humanizePointDateTime(endDateTime, TIME_FORMAT))}
                    </time>
                  </p>
                  <p class="event__duration">${formatDuration(calcDuration(dayjs(startDateTime), dayjs(endDateTime)))}</p>
                </div>
                <p class="event__price">
                  &euro;&nbsp;<span class="event__price-value">${point.price}</span>
                </p>
                <h4 class="visually-hidden">Offers:</h4>
                <ul class="event__selected-offers">
                  ${createPointOffersTemplate(point)}
                </ul>
                <button class="event__favorite-btn ${point.isFavorite ? 'event__favorite-btn--active' : ''}" type="button">
                  <span class="visually-hidden">Add to favorite</span>
                  <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
                    <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
                  </svg>
                </button>
                <button class="event__rollup-btn" type="button">
                  <span class="visually-hidden">Open event</span>
                </button>
              </div>
            </li>`;
};

export default class PointView extends AbstractView {
  #point = null;
  #handleOpenClick = null;
  #handleFavoriteClick = null;

  constructor({ point, onOpenClick, onFavoriteClick }) {
    super();
    this.#point = point;
    this.#handleOpenClick = onOpenClick;
    this.#handleFavoriteClick = onFavoriteClick;

    this.element
      .querySelector('.event__rollup-btn')
      .addEventListener('click', this.#openClickHandler);
    this.element
      .querySelector('.event__favorite-btn')
      .addEventListener('click', this.#favoriteClickHandler);
  }

  get template() {
    return createPointTemplate(this.#point);
  }

  #openClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleOpenClick();
  };

  #favoriteClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleFavoriteClick();
  };
}
