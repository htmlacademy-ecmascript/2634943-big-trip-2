import { capitalize } from '../utils/common.js';
import { formatFormDate } from '../utils/point.js';

/**
 * Функция для создания разметки радио-группы типов точки
 * @param {Array} pointTypes Список типов точки
 * @param {string} currentType Выбранный тип точки
 * @returns {string} Разметка радио-группы
 */
export const createPointTypesTemplate = (pointTypes, currentType) => (
  pointTypes.map((type) => {
    const checkedAttribute = type === currentType ? 'checked' : '';

    return `
      <div class="event__type-item">
        <input id="event-type-${type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}" ${checkedAttribute}>
        <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-1">${capitalize(type)}</label>
      </div>
    `;
  }).join('')
);

/**
 * Функция для создания разметки чекбоксов опций
 * @param {Array} offers Опции типа точки
 * @param {Array} selectedOfferIds Идентификаторы выбранных опций
 * @returns {string} Разметка чекбоксов опций
 */
export const createOffersTemplate = (offers, selectedOfferIds = []) => (
  offers.map((offer) => {
    const isChecked = selectedOfferIds.includes(offer.id) ? 'checked' : '';

    return `
      <div class="event__offer-selector">
        <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offer.id}" type="checkbox" name="event-offer-${offer.id}" ${isChecked}>
        <label class="event__offer-label" for="event-offer-${offer.id}">
          <span class="event__offer-title">${offer.title}</span>
          &plus;&euro;&nbsp;
          <span class="event__offer-price">${offer.price}</span>
        </label>
      </div>
    `;
  }).join('')
);

/**
 * Функция для создания разметки блока с направлением
 * @param {object} [destination] Направление
 * @returns {string} Разметка блока с направлением
 */
export const createDestinationTemplate = (destination) => {
  if (!destination) {
    return '';
  }

  const { description = '', pictures = [] } = destination;

  if (!description && pictures.length === 0) {
    return '';
  }

  const picturesTemplate = pictures.length > 0
    ? `<div class="event__photos-container">
         <div class="event__photos-tape">
           ${pictures.map((picture) => `<img class="event__photo" src="${picture.src}" alt="${picture.description}">`).join('')}
         </div>
       </div>`
    : '';

  return `
      <section class="event__section  event__section--destination">
        <h3 class="event__section-title  event__section-title--destination">Destination</h3>
        <p class="event__destination-description">${description}</p>
        ${picturesTemplate}
      </section>
    `;
};

/**
 * Функция для создания разметки формы точки
 * @param {object} params Параметры формы
 * @param {object} params.point Точка маршрута
 * @param {object} [params.destination] Направление точки
 * @param {Array} [params.typeOffers] Опции типа точки
 * @param {Array} [params.destinations] Все направления
 * @param {Array} [params.pointTypes] Список типов точки
 * @param {string} [params.mode] Режим формы: `create` или `edit`
 * @returns {string} Разметка формы
 */
export const createPointFormTemplate = ({
  point,
  destination = null,
  typeOffers = [],
  destinations = [],
  pointTypes = [],
  mode = 'create'
}) => {
  const { basePrice, dateFrom, dateTo, type } = point;

  const pointTypesTemplate = createPointTypesTemplate(pointTypes, type);

  const offersTemplate = typeOffers.length > 0
    ? `
      <section class="event__section  event__section--offers">
        <h3 class="event__section-title  event__section-title--offers">Offers</h3>

        <div class="event__available-offers">
          ${createOffersTemplate(typeOffers, point.offers)}
        </div>
      </section>
    `
    : '';

  const destinationTemplate = createDestinationTemplate(destination);

  const datalistTemplate = destinations.map((item) => `<option value="${item.name}"></option>`).join('');

  const dateTimeStart = formatFormDate(dateFrom);
  const dateTimeEnd = formatFormDate(dateTo);

  const buttonsTemplate = mode === 'edit'
    ? `
          <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
          <button class="event__reset-btn" type="reset">Delete</button>
          <button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Open event</span>
          </button>
        `
    : `
          <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
          <button class="event__reset-btn" type="reset">Cancel</button>
        `;

  return `
  <form class="event event--edit" action="#" method="post">
    <header class="event__header">
      <div class="event__type-wrapper">
        <label class="event__type  event__type-btn" for="event-type-toggle-1">
          <span class="visually-hidden">Choose event type</span>
          <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
        </label>
        <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

          <div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Event type</legend>
              ${pointTypesTemplate}
            </fieldset>
          </div>
      </div>

      <div class="event__field-group  event__field-group--destination">
        <label class="event__label  event__type-output" for="event-destination-1">
          ${capitalize(type)}
        </label>
        <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destination?.name ?? ''}" list="destination-list-1">
          <datalist id="destination-list-1">
            ${datalistTemplate}
          </datalist>
      </div>

      <div class="event__field-group  event__field-group--time">
        <label class="visually-hidden" for="event-start-time-1">From</label>
        <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${dateTimeStart}">
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">To</label>
          <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${dateTimeEnd}">
          </div>

          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-1">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${basePrice}">
          </div>

          ${buttonsTemplate}
        </header>
        <section class="event__details">
          ${offersTemplate}
          ${destinationTemplate}
        </section>
      </form>
      `;
};
