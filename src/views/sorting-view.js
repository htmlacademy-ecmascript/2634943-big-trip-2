import AbstractView from '../framework/view/abstract-view.js';
import { SortType } from '../const.js';

const createSortingTemplate = (sortType = SortType.DAY) => `
  <form class="trip-events__trip-sort  trip-sort" action="#" method="get">
    <div class="trip-sort__item  trip-sort__item--day">
      <input id="sort-day" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-day" data-sort-type="${SortType.DAY}" ${sortType === SortType.DAY ? 'checked' : ''}>
        <label class="trip-sort__btn" for="sort-day">Day</label>
    </div>

    <div class="trip-sort__item  trip-sort__item--event">
      <input id="sort-event" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-event" disabled>
        <label class="trip-sort__btn" for="sort-event">Event</label>
    </div>

    <div class="trip-sort__item  trip-sort__item--time">
      <input id="sort-time" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-time" data-sort-type="${SortType.TIME}" ${sortType === SortType.TIME ? 'checked' : ''}>
        <label class="trip-sort__btn" for="sort-time">Time</label>
    </div>

    <div class="trip-sort__item  trip-sort__item--price">
      <input id="sort-price" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-price" data-sort-type="${SortType.PRICE}" ${sortType === SortType.PRICE ? 'checked' : ''}>
        <label class="trip-sort__btn" for="sort-price">Price</label>
    </div>

    <div class="trip-sort__item  trip-sort__item--offer">
      <input id="sort-offer" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-offer" disabled>
        <label class="trip-sort__btn" for="sort-offer">Offers</label>
    </div>
  </form>
  `;

export default class SortingView extends AbstractView {
  /** @type {Function|null} Обработчик изменения типа сортировки */
  #handleSortTypeChange = null;

  /** @type {string} Текущий тип сортировки */
  #sortType = SortType.DAY;

  #sortTypeChangeHandler = (evt) => {
    this.#handleSortTypeChange?.(evt.target.dataset.sortType);
  };

  /**
   * @param {object} params Параметры представления
   * @param {Function} params.onSortTypeChange Обработчик изменения типа сортировки
   * @param {string} [params.sortType] Текущий тип сортировки
   */
  constructor({ onSortTypeChange, sortType = SortType.DAY } = {}) {
    super();
    this.#handleSortTypeChange = onSortTypeChange;
    this.#sortType = sortType;
    this.element.addEventListener('change', this.#sortTypeChangeHandler);
  }

  get template() {
    return createSortingTemplate(this.#sortType);
  }
}
