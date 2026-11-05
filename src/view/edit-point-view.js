import he from 'he';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import OffersPresenter from '../presenter/offers-presenter.js';
import DestinationPresenter from '../presenter/destination-presenter.js';
import { humanizePointDateTime, toIsoString } from '../utils/point.js';
import { EVENT_TYPES, DEFAULT_POINT } from '../const.js';

const DATE_TIME_FORMAT = 'DD/MM/YY HH:mm';

const createEventTypeListTemplate = (point) =>
  EVENT_TYPES.map(
    (type) =>
      `<div class="event__type-item">
        <input id="event-type-${type}-1"
               class="event__type-input  visually-hidden"
               type="radio"
               name="event-type"
               value="${type}"
               ${point.type === type ? 'checked' : ''}>
        <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-1">${type}</label>
      </div>`,
  ).join(' ');

const createOpenEventButtonTemplate = (isNewPoint) => {
  if (isNewPoint) {
    return '';
  }

  return `<button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Open event</span>
          </button>`;
};

const getResetButtonText = (isNewPoint, isDeleting) => {
  if (isNewPoint) {
    return 'Cancel';
  }

  return isDeleting ? 'Deleting...' : 'Delete';
};

const createEventTypeWrapperTemplate = (point, type, isDisabled) =>
  `<div class="event__type-wrapper">
    <label class="event__type  event__type-btn" for="event-type-toggle-1">
      <span class="visually-hidden">Choose event type</span>
      <img class="event__type-icon" width="17" height="17" src="img/icons/${he.encode(type)}.png" alt="Event type icon">
    </label>
    <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox" ${isDisabled ? 'disabled' : ''}>
    <div class="event__type-list">
      <fieldset class="event__type-group">
        <legend class="visually-hidden">Event type</legend>
        ${createEventTypeListTemplate(point)}
      </fieldset>
    </div>
  </div>`;

const createDestinationFieldGroupTemplate = (
  destinationsList,
  pointDestination,
  type,
  isDisabled,
) =>
  `<div class="event__field-group  event__field-group--destination">
    <label class="event__label  event__type-output" for="event-destination-1">
      ${he.encode(type)}
    </label>
    <input class="event__input  event__input--destination"
            id="event-destination-1"
            type="text"
            name="event-destination"
            value="${he.encode(pointDestination.title)}"
            list="destination-list-1"
            ${isDisabled ? 'disabled' : ''}>
    <datalist id="destination-list-1">
      ${destinationsList.map((dest) => `<option value="${he.encode(dest.title)}"></option>`).join('')}
    </datalist>
  </div>`;

const createTimeFieldGroupTemplate = (startDateTime, endDateTime, isDisabled) =>
  `<div class="event__field-group  event__field-group--time">
    <label class="visually-hidden" for="event-start-time-1">From</label>
    <input class="event__input  event__input--time"
            id="event-start-time-1"
            type="text"
            name="event-start-time"
            value="${he.encode(humanizePointDateTime(startDateTime, DATE_TIME_FORMAT))}"
            ${isDisabled ? 'disabled' : ''}>
    &mdash;
    <label class="visually-hidden" for="event-end-time-1">To</label>
    <input class="event__input  event__input--time"
            id="event-end-time-1"
            type="text"
            name="event-end-time"
            value="${he.encode(humanizePointDateTime(endDateTime, DATE_TIME_FORMAT))}"
            ${isDisabled ? 'disabled' : ''}>
  </div>`;

const createPriceFieldGroupTemplate = (price, isDisabled) =>
  `<div class="event__field-group  event__field-group--price">
    <label class="event__label" for="event-price-1">
      <span class="visually-hidden">Price</span>
      &euro;
    </label>
    <input class="event__input  event__input--price"
            id="event-price-1"
            type="text"
            name="event-price"
            value="${price}"
            ${isDisabled ? 'disabled' : ''}>
  </div>`;

const createButtonsTemplate = (isDisabled, isSaving, isDeleting, isNewPoint) =>
  `<button class="event__save-btn  btn  btn--blue" type="submit" ${isDisabled ? 'disabled' : ''}>${isSaving ? 'Saving...' : 'Save'}</button>
  <button class="event__reset-btn" type="reset">${getResetButtonText(isNewPoint, isDeleting)}</button>
  ${createOpenEventButtonTemplate(isNewPoint)}`;

const createEditPointTemplate = (point, destinations, isNewPoint) => {
  const {
    startDateTime,
    endDateTime,
    type,
    destination,
    isDisabled,
    isSaving,
    isDeleting,
  } = point;

  return `<li class="trip-events__item">
              <form class="event event--edit" action="#" method="post">
                <header class="event__header">
                  ${createEventTypeWrapperTemplate(point, type, isDisabled)}
                  ${createDestinationFieldGroupTemplate(destinations, destination, type, isDisabled)}
                  ${createTimeFieldGroupTemplate(startDateTime, endDateTime, isDisabled)}
                  ${createPriceFieldGroupTemplate(point.price, isDisabled)}
                  ${createButtonsTemplate(isDisabled, isSaving, isDeleting, isNewPoint)}
                </header>
                <section class="event__details">
                </section>
              </form>
            </li>`;
};

export default class EditPointView extends AbstractStatefulView {
  #destinations = null;
  #offers = null;
  #defaultState = null;
  #onFormSubmit = null;
  #onCloseClick = null;
  #onDeleteClick = null;
  #startDatepicker = null;
  #endDatepicker = null;

  #isNewPoint = false;

  constructor({
    point,
    destinations,
    offers,
    onFormSubmit,
    onCloseClick,
    onDeleteClick,
    isNewPoint = false,
  }) {
    super();

    if (isNewPoint) {
      point = DEFAULT_POINT;
    }

    this._setState(EditPointView.parsePointToState(point));
    this.#defaultState = this._state;
    this.#destinations = destinations;
    this.#offers = offers;
    this.#onFormSubmit = onFormSubmit;
    this.#onCloseClick = onCloseClick;
    this.#onDeleteClick = onDeleteClick;
    this.#isNewPoint = isNewPoint;

    this._restoreHandlers();
  }

  get template() {
    return createEditPointTemplate(
      this._state,
      this.#destinations,
      this.#isNewPoint,
    );
  }

  get data() {
    return this._state;
  }

  get eventDetailsElement() {
    return this.element.querySelector('.event__details');
  }

  removeElement() {
    super.removeElement();

    if (this.#startDatepicker) {
      this.#startDatepicker.destroy();
      this.#startDatepicker = null;
    }

    if (this.#endDatepicker) {
      this.#endDatepicker.destroy();
      this.#endDatepicker = null;
    }
  }

  _restoreHandlers() {
    if (!this.#isNewPoint) {
      this.element
        .querySelector('.event__rollup-btn')
        .addEventListener('click', this.#closeClickHandler);
    }

    const formElement = this.element.querySelector('form');
    formElement.addEventListener('submit', this.#formSubmitHandler);
    formElement.addEventListener('change', this.#eventTypeToggleHandler);
    formElement.addEventListener('change', this.#offersChangeHandler);

    this.element
      .querySelector('[name="event-destination"]')
      .addEventListener('change', this.#destinatonChangeHandler);
    this.element
      .querySelector('#event-price-1')
      .addEventListener('input', this.#priceChangeHandler);
    this.element
      .querySelector('.event__reset-btn')
      .addEventListener('click', this.#formDeleteClickHandler);
  }

  setDatepicker() {
    if (this.#startDatepicker) {
      this.#startDatepicker.destroy();
      this.#startDatepicker = null;
    }

    if (this.#endDatepicker) {
      this.#endDatepicker.destroy();
      this.#endDatepicker = null;
    }

    const datepickerOptions = {
      enableTime: true,
      dateFormat: 'd/m/y H:i',
      onClose: this.#startDateChangeHandler,
    };

    datepickerOptions['time_24hr'] = true;

    this.#startDatepicker = flatpickr(
      this.element.querySelector('[name="event-start-time"]'),
      { ...datepickerOptions, defaultDate: this._state.startDateTime },
    );

    this.#endDatepicker = flatpickr(
      this.element.querySelector('[name="event-end-time"]'),
      {
        ...datepickerOptions,
        onClose: this.#endDateChangeHandler,
        defaultDate: this._state.endDateTime,
        minDate: this._state.startDateTime,
      },
    );
  }

  reset(point) {
    this.element.querySelectorAll('input').forEach((input) => input.blur());
    this.updateElement(EditPointView.parseStateToPoint(point));
  }

  #rerenderOffers() {
    const offersPresenter = new OffersPresenter({
      point: this,
      offers: this.#offers,
    });

    offersPresenter.init();
  }

  #rerenderDestination() {
    const destinationPresenter = new DestinationPresenter({
      point: this,
      destinations: this.#destinations,
    });

    destinationPresenter.init();
  }

  #updateView() {
    this.#rerenderOffers();
    this.#rerenderDestination();
    this.setDatepicker();
  }

  #startDateChangeHandler = ([userDate]) => {
    this._setState({ startDateTime: toIsoString(userDate) });
    this.#endDatepicker?.set('minDate', userDate);
  };

  #endDateChangeHandler = ([userDate]) => {
    this._setState({ endDateTime: toIsoString(userDate) });
    this.#startDatepicker?.set('maxDate', userDate);
  };

  #getFormPoint() {
    const form = this.element.querySelector('form');
    const typeInput = form.querySelector('input[name="event-type"]:checked');
    const destinationInput = form.querySelector('[name="event-destination"]');
    const priceInput = form.querySelector('[name="event-price"]');
    const startDateInput = form.querySelector('[name="event-start-time"]');
    const endDateInput = form.querySelector('[name="event-end-time"]');

    const type = typeInput?.value || this._state.type;

    const destinationTitle = destinationInput.value.trim();
    const destination =
      this.#destinations.find((dest) => dest.title === destinationTitle) ||
      this._state.destination;
    const destinationId = destination?.id ?? null;

    const typeOffers = this.#offers.find((offer) => offer.type === type);
    const availableOffers = typeOffers ? typeOffers.offers : [];
    const offers = [];
    const offersIds = [];

    availableOffers.forEach((offer) => {
      const inputName = `event-offer-${he.encode(offer.title).replaceAll(' ', '-').toLowerCase()}`;
      const checkbox = form.querySelector(`#${inputName}-1`);
      if (checkbox?.checked) {
        offers.push(offer);
        offersIds.push(offer.id);
      }
    });

    const startDate = this.#startDatepicker?.selectedDates[0];
    const endDate = this.#endDatepicker?.selectedDates[0];
    const now = toIsoString(new Date());
    const oneHourLater = toIsoString(new Date(Date.now() + 3600000));
    let startDateTime;
    if (startDate) {
      startDateTime = toIsoString(startDate);
    } else if (startDateInput.value) {
      startDateTime = toIsoString(this.#parseFlatpickrDateTime(startDateInput.value));
    } else {
      startDateTime = this._state.startDateTime || now;
    }
    let endDateTime;
    if (endDate) {
      endDateTime = toIsoString(endDate);
    } else if (endDateInput.value) {
      endDateTime = toIsoString(this.#parseFlatpickrDateTime(endDateInput.value));
    } else {
      endDateTime = this._state.endDateTime || oneHourLater;
    }

    const price = priceInput ? Number(priceInput.value) || 0 : this._state.price;

    return {
      id: this._state.id,
      startDateTime,
      endDateTime,
      type,
      destinationId,
      destination,
      price,
      offersIds,
      offers,
      isFavorite: this._state.isFavorite,
    };
  }

  #parseFlatpickrDateTime(dateTimeStr) {
    const match = dateTimeStr.match(/^(\d{2})\/(\d{2})\/(\d{2})\s+(\d{2}):(\d{2})$/);
    if (!match) {
      return null;
    }
    const [, day, month, year, hours, minutes] = match;
    return new Date(`20${year}-${month}-${day}T${hours}:${minutes}:00`);
  }

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#onFormSubmit(this.#getFormPoint());
  };

  #closeClickHandler = (evt) => {
    evt.preventDefault();
    this.reset(this.#defaultState);
    this.#onCloseClick();
  };

  #eventTypeToggleHandler = (evt) => {
    if (evt.target.name === 'event-type') {
      evt.preventDefault();
      this.updateElement({ type: evt.target.value, offers: [], offersIds: [] });
      this.#updateView();
    }
  };

  #destinatonChangeHandler = (evt) => {
    evt.preventDefault();
    const newDestination = this.#destinations.find(
      (dest) => evt.target.value === dest.title,
    );

    if (newDestination) {
      this.updateElement({
        destination: newDestination,
        destinationId: newDestination.id,
      });

      this.#updateView();
    }
  };

  #priceChangeHandler = (evt) => {
    evt.preventDefault();
    const value = evt.target.value;

    if (/^[0-9]+$/.test(value)) {
      this.updateElement({ price: value });
      this.#updateView();
      const priceElement = this.element.querySelector('#event-price-1');
      priceElement.focus();
      priceElement.setSelectionRange(value.length, value.length);
    }
  };

  #offersChangeHandler = (evt) => {
    if (evt.target.id.includes('event-offer')) {
      const offerTitle = this.element.querySelector(
        `label[for="${evt.target.id}"] span`,
      ).textContent;

      const offer = this.#offers
        .find((offers) => offers.type === this._state.type)
        .offers.find((item) => item.title === offerTitle);

      if (evt.target.checked) {
        this._state.offers.push(offer);
        this._state.offersIds.push(offer.id);
      } else {
        this._state.offers = this._state.offers.filter(
          (item) => item.id !== offer.id,
        );
        this._state.offersIds = this._state.offersIds.filter(
          (id) => id !== offer.id,
        );
      }
    }
  };

  #formDeleteClickHandler = (evt) => {
    evt.preventDefault();
    this.#onDeleteClick(EditPointView.parseStateToPoint(this._state));
  };

  static parsePointToState(point) {
    return { ...point, isDisabled: false, isSaving: false, isDeleting: false };
  }

  static parseStateToPoint(state) {
    const point = { ...state };

    delete point.isDisabled;
    delete point.isSaving;
    delete point.isDeleting;

    return point;
  }
}
