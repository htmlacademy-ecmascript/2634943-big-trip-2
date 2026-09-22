import {
  EVENT_ICONS,
  EVENT_TYPES,
  EVENT_TYPE_LABELS,
  DESTINATIONS,
  BLANK_POINT,
} from '../const.js';

function createTypeSelectorTemplate(type, id) {
  return EVENT_TYPES.map((eventType) => {
    const label = EVENT_TYPE_LABELS[eventType] || 'Flight';
    const isChecked = type === eventType ? 'checked' : '';
    return `
      <div class="event__type-item">
        <input id="event-type-${eventType}-${id}" class="event__type-input visually-hidden" type="radio" name="event-type" value="${eventType}" ${isChecked}>
        <label class="event__type-label event__type-label--${eventType}" for="event-type-${eventType}-${id}">${label}</label>
      </div>`;
  }).join('');
}

function createOffersTemplate(offers, selectedOffers, id) {
  if (!offers || offers.length === 0) {
    return '';
  }
  const offersHtml = offers.map((offer) => {
    const isSelected = selectedOffers.some(
      (so) => so.type === offer.type && so.name === offer.name,
    );
    const safeName = offer.name.replace(/\s+/g, '-').toLowerCase();
    return `
      <div class="event__offer-selector">
        <input class="event__offer-checkbox visually-hidden" id="event-offer-${offer.type}-${safeName}-${id}" type="checkbox" name="event-offer-${offer.type}" ${isSelected ? 'checked' : ''}>
        <label class="event__offer-label" for="event-offer-${offer.type}-${safeName}-${id}">
          <span class="event__offer-title">${offer.name}</span>
          &plus;&euro;&nbsp;
          <span class="event__offer-price">${offer.price}</span>
        </label>
      </div>`;
  }).join('');

  return `
    <section class="event__section event__section--offers">
      <h3 class="event__section-title event__section-title--offers">Offers</h3>
      <div class="event__available-offers">
        ${offersHtml}
      </div>
    </section>`;
}

function createDestinationTemplate(destination) {
  const description = destination && destination.description ? destination.description : '';

  const descriptionHtml = description
    ? `<p class="event__destination-description">${description}</p>`
    : '';

  return `
    <section class="event__section event__section--destination">
      <h3 class="event__section-title event__section-title--destination">Destination</h3>
      ${descriptionHtml}
    </section>`;
}

function formatDateTime(date) {
  if (!date) {
    return '';
  }
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = String(d.getFullYear()).slice(2);
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${day}/${month}/${year} ${hours}:${minutes}`;
}

export default class PointForm {
  constructor(options) {
    const defaults = BLANK_POINT;
    this.type = options.type || defaults.type;
    this.destination = options.destination || defaults.destination;
    this.dateFrom = options.dateFrom || defaults.dateFrom;
    this.dateTo = options.dateTo || defaults.dateTo;
    this.basePrice = options.basePrice || defaults.basePrice;
    this.offers = options.offers || defaults.offers;
    this.selectedOffers = options.selectedOffers || defaults.selectedOffers;
    this.id = options.id || defaults.id;
    this.isEdit = options.isEdit || false;
  }

  get template() {
    const iconSrc = EVENT_ICONS[this.type] || EVENT_ICONS['flight'];
    const typeLabel = EVENT_TYPE_LABELS[this.type] || 'Flight';
    const startDateTime = formatDateTime(this.dateFrom);
    const endDateTime = formatDateTime(this.dateTo);
    const typeSelector = createTypeSelectorTemplate(this.type, this.id);
    const offersSection = createOffersTemplate(this.offers, this.selectedOffers, this.id);
    const destinationSection = createDestinationTemplate(this.destination);
    const actionButtonText = this.isEdit ? 'Save' : 'Save';
    const resetButtonText = this.isEdit ? 'Delete' : 'Cancel';
    const resetButtonType = this.isEdit ? 'reset' : 'reset';

    const datalistOptions = DESTINATIONS.map((dest) => `<option value="${dest}"></option>`).join('');

    return `
      <form class="event event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type event__type-btn" for="event-type-toggle-${this.id}">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="${iconSrc}" alt="Event type icon">
            </label>
            <input class="event__type-toggle visually-hidden" id="event-type-toggle-${this.id}" type="checkbox">

            <div class="event__type-list">
              <fieldset class="event__type-group">
                <legend class="visually-hidden">Event type</legend>
                ${typeSelector}
              </fieldset>
            </div>
          </div>

          <div class="event__field-group event__field-group--destination">
            <label class="event__label event__type-output" for="event-destination-${this.id}">
              ${typeLabel}
            </label>
            <input class="event__input event__input--destination" id="event-destination-${this.id}" type="text" name="event-destination" value="${this.destination ? this.destination.name : ''}" list="destination-list-${this.id}" placeholder="Choose destination">
            <datalist id="destination-list-${this.id}">
              ${datalistOptions}
            </datalist>
          </div>

          <div class="event__field-group event__field-group--time">
            <label class="visually-hidden" for="event-start-time-${this.id}">From</label>
            <input class="event__input event__input--time" id="event-start-time-${this.id}" type="text" name="event-start-time" value="${startDateTime}" placeholder="18/03/19 12:25">
            &mdash;
            <label class="visually-hidden" for="event-end-time-${this.id}">To</label>
            <input class="event__input event__input--time" id="event-end-time-${this.id}" type="text" name="event-end-time" value="${endDateTime}" placeholder="18/03/19 13:35">
          </div>

          <div class="event__field-group event__field-group--price">
            <label class="event__label" for="event-price-${this.id}">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input class="event__input event__input--price" id="event-price-${this.id}" type="text" name="event-price" value="${this.basePrice || 0}" placeholder="160">
          </div>

          <button class="event__save-btn btn btn--blue" type="submit">${actionButtonText}</button>
          <button class="event__reset-btn" type="${resetButtonType}">${resetButtonText}</button>
          ${this.isEdit ? `
          <button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Open event</span>
          </button>` : ''}
        </header>
        <section class="event__details">
          ${offersSection}
          ${destinationSection}
        </section>
      </form>`;
  }

  getElement() {
    const container = document.createElement('div');
    container.innerHTML = this.template;
    return container.firstElementChild;
  }
}
