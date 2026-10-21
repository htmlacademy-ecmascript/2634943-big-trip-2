import AbstractView from '../framework/view/abstract-view.js';
import { BLANK_POINT } from '../const.js';
import { createPointFormTemplate } from './form-template.js';

export default class FormCreationView extends AbstractView {
  /** @type {object} Точка маршрута */
  #point = BLANK_POINT;

  /** @type {object|null} Направление */
  #destination = null;

  /** @type {Array} Опции типа точки */
  #typeOffers = [];

  /** @type {Array} Все направления */
  #destinations = [];

  /** @type {Array} Список типов точки */
  #pointTypes = [];

  /** @type {Function|null} Обработчик отправки формы */
  #handleFormSubmit = null;

  /** @type {Function|null} Обработчик сброса формы */
  #handleReset = null;

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#handleFormSubmit?.();
  };

  #resetHandler = (evt) => {
    evt.preventDefault();
    this.#handleReset?.();
  };

  /**
   * @param {object} params Параметры представления
   * @param {object} [params.point] Точка маршрута
   * @param {object} [params.destination] Направление точки
   * @param {Array} [params.typeOffers] Опции типа точки
   * @param {Array} [params.destinations] Все направления
   * @param {Array} [params.pointTypes] Список типов точки
   * @param {Function} [params.onFormSubmit] Обработчик отправки формы
   * @param {Function} [params.onReset] Обработчик сброса формы
   */
  constructor({
    point = BLANK_POINT,
    destination = null,
    typeOffers = [],
    destinations = [],
    pointTypes = [],
    onFormSubmit,
    onReset
  }) {
    super();
    this.#point = point;
    this.#destination = destination;
    this.#typeOffers = typeOffers;
    this.#destinations = destinations;
    this.#pointTypes = pointTypes;
    this.#handleFormSubmit = onFormSubmit;
    this.#handleReset = onReset;

    this.element.addEventListener('submit', this.#formSubmitHandler);
    this.element
      .querySelector('.event__reset-btn')
      .addEventListener('click', this.#resetHandler);
  }

  get template() {
    return createPointFormTemplate({
      point: this.#point,
      destination: this.#destination,
      typeOffers: this.#typeOffers,
      destinations: this.#destinations,
      pointTypes: this.#pointTypes,
      mode: 'create'
    });
  }
}
