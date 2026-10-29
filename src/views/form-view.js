import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { BLANK_POINT, ButtonText } from '../const.js';
import { createPointFormTemplate } from './form-template.js';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

export default class FormView extends AbstractStatefulView {
  /** @type {Array} Все опции по типам */
  #offers = [];

  /** @type {Array} Все направления */
  #destinations = [];

  /** @type {Function|null} Обработчик отправки формы */
  #handleFormSubmit = null;

  /** @type {Function|null} Обработчик удаления точки */
  #handleDeleteClick = null;

  /** @type {Function|null} Обработчик сворачивания формы */
  #handleRollupClick = null;

  /** @type {Function|null} Обработчик сброса формы */
  #handleReset = null;

  /** @type {string} Режим формы */
  #mode = 'create';

  #datepickerFrom = null;

  #datepickerTo = null;

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#handleFormSubmit?.();
  };

  #rollupClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleRollupClick?.();
  };

  #resetHandler = (evt) => {
    evt.preventDefault();
    this.#handleReset?.();
  };

  #typeChangeHandler = (evt) => {
    this.updateElement({
      type: evt.target.value,
      offers: []
    });
  };

  #priceInputHandler = (evt) => {
    const input = evt.target;
    const value = input.value.replace(/\D/g, '');
    input.value = value;
    this._setState({ basePrice: Number(value) || 0 });
  };

  #destinationChangeHandler = (evt) => {
    const found = this.#destinations.find((destination) => destination.name === evt.target.value);

    if (!found) {
      return;
    }

    this.updateElement({ destination: found.id });
  };

  #deleteClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleDeleteClick?.();
  };

  #offersChangeHandler = () => {
    const checkedOffers = this.element.querySelectorAll('.event__offer-checkbox:checked');
    const selectedIds = Array.from(checkedOffers).map((element) => element.id.replace('event-offer-', ''));
    this._setState({ offers: selectedIds });
  };

  #dateFromChangeHandler = ([userDate]) => {
    this._setState({ dateFrom: userDate });

    if (this.#datepickerTo) {
      this.#datepickerTo.set('minDate', userDate);
    }
  };

  #dateToChangeHandler = ([userDate]) => {
    this._setState({ dateTo: userDate });
  };

  /**
   * @param {object} params Параметры представления
   * @param {object} [params.point] Точка маршрута
   * @param {Array} [params.offers] Все опции
   * @param {Array} [params.destinations] Все направления
   * @param {Function} [params.onFormSubmit] Обработчик отправки формы
   * @param {Function} [params.onReset] Обработчик сброса формы
   * @param {Function} [params.onDeleteClick] Обработчик удаления точки
   * @param {Function} [params.onRollupClick] Обработчик сворачивания формы
   * @param {string} [params.mode] Режим формы
   */
  constructor({
    point = BLANK_POINT,
    offers = [],
    destinations = [],
    onFormSubmit,
    onReset,
    onDeleteClick,
    onRollupClick,
    mode = 'create'
  }) {
    super();
    this.#offers = offers;
    this.#destinations = destinations;
    this.#handleFormSubmit = onFormSubmit;
    this.#handleReset = onReset;
    this.#handleDeleteClick = onDeleteClick;
    this.#handleRollupClick = onRollupClick;
    this.#mode = mode;

    this._setState(FormView.parsePointToState(point));
    this._restoreHandlers();
  }

  static parsePointToState(point) {
    return { ...point };
  }

  get template() {
    const typeOffers = this.#offers.find((offer) => offer.type === this._state.type)?.offers ?? [];
    const destination = this.#destinations.find((item) => item.id === this._state.destination) ?? null;

    return createPointFormTemplate({
      point: this._state,
      destination,
      typeOffers,
      destinations: this.#destinations,
      pointTypes: this.#offers.map((offer) => offer.type),
      mode: this.#mode
    });
  }

  _restoreHandlers() {
    this.element.addEventListener('submit', this.#formSubmitHandler);

    if (this.#mode === 'edit') {
      const rollupBtn = this.element.querySelector('.event__rollup-btn');
      if (rollupBtn) {
        rollupBtn.addEventListener('click', this.#rollupClickHandler);
      }

      const deleteBtn = this.element.querySelector('.event__reset-btn');
      if (deleteBtn) {
        deleteBtn.addEventListener('click', this.#deleteClickHandler);
      }
    } else {
      const resetBtn = this.element.querySelector('.event__reset-btn');
      if (resetBtn) {
        resetBtn.addEventListener('click', this.#resetHandler);
      }
    }

    const typeGroup = this.element.querySelector('.event__type-group');
    if (typeGroup) {
      typeGroup.addEventListener('change', this.#typeChangeHandler);
    }

    const priceInput = this.element.querySelector('.event__input--price');
    if (priceInput) {
      priceInput.addEventListener('input', this.#priceInputHandler);
    }

    const destinationInput = this.element.querySelector('.event__input--destination');
    if (destinationInput) {
      destinationInput.addEventListener('change', this.#destinationChangeHandler);
    }

    const offersContainer = this.element.querySelector('.event__available-offers');
    if (offersContainer) {
      offersContainer.addEventListener('change', this.#offersChangeHandler);
    }

    this.#setDatepickers();
  }

  #setDatepickers() {
    const dateFromInput = this.element.querySelector('#event-start-time-1');
    const dateToInput = this.element.querySelector('#event-end-time-1');

    if (this.#datepickerFrom) {
      this.#datepickerFrom.destroy();
    }

    if (this.#datepickerTo) {
      this.#datepickerTo.destroy();
    }

    this.#datepickerFrom = flatpickr(dateFromInput, {
      enableTime: true,
      dateFormat: 'd/m/y H:i',
      // eslint-disable-next-line camelcase
      time_24hr: true,
      defaultDate: this._state.dateFrom,
      onChange: this.#dateFromChangeHandler
    });

    this.#datepickerTo = flatpickr(dateToInput, {
      enableTime: true,
      dateFormat: 'd/m/y H:i',
      // eslint-disable-next-line camelcase
      time_24hr: true,
      defaultDate: this._state.dateTo,
      minDate: this._state.dateFrom,
      onChange: this.#dateToChangeHandler
    });
  }

  removeElement() {
    if (this.#datepickerFrom) {
      this.#datepickerFrom.destroy();
      this.#datepickerFrom = null;
    }

    if (this.#datepickerTo) {
      this.#datepickerTo.destroy();
      this.#datepickerTo = null;
    }

    super.removeElement();
  }

  reset(point) {
    this.updateElement(FormView.parsePointToState(point));
  }

  setSaving() {
    const saveBtn = this.element.querySelector('.event__save-btn');

    if (saveBtn) {
      saveBtn.textContent = ButtonText.SAVING;
      saveBtn.disabled = true;
    }
  }

  setDeleting() {
    const resetBtn = this.element.querySelector('.event__reset-btn');

    if (resetBtn) {
      resetBtn.textContent = ButtonText.DELETING;
      resetBtn.disabled = true;
    }
  }

  setDefault() {
    const saveBtn = this.element.querySelector('.event__save-btn');
    const resetBtn = this.element.querySelector('.event__reset-btn');

    if (saveBtn) {
      saveBtn.textContent = ButtonText.SAVE;
      saveBtn.disabled = false;
    }

    if (resetBtn) {
      resetBtn.textContent = this.#mode === 'edit' ? ButtonText.DELETE : ButtonText.CANCEL;
      resetBtn.disabled = false;
    }
  }

  setAborting() {
    this.shake(() => this.setDefault());
  }
}
