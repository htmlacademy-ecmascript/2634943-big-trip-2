import he from 'he';
import AbstractView from '../framework/view/abstract-view.js';
import { isEmptyPoint } from '../utils/point.js';
import { DEFAULT_TYPE } from '../const.js';

const createPointOffersTemplate = (point, offers) => {
  const availableOffers = offers.find(
    ({ type }) => type === (isEmptyPoint(point) ? DEFAULT_TYPE : point.type),
  ).offers;

  if (!availableOffers.length) {
    return '<section class="visually-hidden"></section>';
  }

  const offersList = availableOffers
    .map(({ title, price }) => {
      const inputName = `event-offer-${he.encode(title).replaceAll(' ', '-').toLowerCase()}`;
      const checkedOffer = isEmptyPoint(point)
        ? null
        : point.offers.find((offer) => offer.title === title);

      return `<div class="event__offer-selector">
                <input class="event__offer-checkbox  visually-hidden"
                       id="${inputName}-1"
                       type="checkbox"
                       name="${inputName}"
                       ${checkedOffer ? 'checked' : ''}>
                <label class="event__offer-label" for="${inputName}-1">
                  <span class="event__offer-title">${he.encode(title)}</span>
                  &plus;&euro;&nbsp;
                  <span class="event__offer-price">${price}</span>
                </label>
              </div>`;
    })
    .join(' ');

  return `<section class="event__section  event__section--offers">
            <h3 class="event__section-title  event__section-title--offers">Offers</h3>
            <div class="event__available-offers">${offersList}</div>
          </section>`;
};

export default class PointOffersView extends AbstractView {
  #point = null;
  #offers = null;
  constructor({ point, offers }) {
    super();
    this.#point = point;
    this.#offers = offers;
  }

  get template() {
    return createPointOffersTemplate(this.#point, this.#offers);
  }
}
