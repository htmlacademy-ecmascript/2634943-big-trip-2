import he from 'he';
import AbstractView from '../framework/view/abstract-view.js';

const createEventPhotosContainer = (point) => {
  if (point.destination.photos.length === 0) {
    return '';
  }

  return `<div class="event__photos-container">
            <div class="event__photos-tape">
              ${point.destination.photos.map(({ src, description }) => `<img class="event__photo" src="${he.encode(src)}" alt="${he.encode(description)}">`).join('')}
            </div>
          </div>`;
};

const createPointDestinationTemplate = (point) => {
  if (
    point.destination.description === '' &&
    point.destination.photos.length === 0
  ) {
    return '<section class="visually-hidden"></section>';
  }

  return `<section class="event__section  event__section--destination">
            <h3 class="event__section-title  event__section-title--destination">Destination</h3>
            <p class="event__destination-description">${he.encode(point.destination.description)}</p>
            ${createEventPhotosContainer(point)}
          </section>`;
};

export default class PointDestinationView extends AbstractView {
  #point = null;

  constructor({ point }) {
    super();
    this.#point = point;
  }

  get template() {
    return createPointDestinationTemplate(this.#point);
  }
}
