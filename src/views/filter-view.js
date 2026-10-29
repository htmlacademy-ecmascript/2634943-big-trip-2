import AbstractView from '../framework/view/abstract-view.js';
import { capitalize } from '../utils/common.js';

const createFilterItemTemplate = ({ type, count, isChecked }) => {
  const checkedAttribute = isChecked ? 'checked' : '';
  const disabledAttribute = count === 0 ? 'disabled' : '';

  return `
    <div class="trip-filters__filter">
      <input id="filter-${type}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${type}" ${checkedAttribute} ${disabledAttribute}>
      <label class="trip-filters__filter-label" for="filter-${type}">${capitalize(type)}</label>
    </div>
  `;
};

const createFilterTemplate = (filters) => {
  const filtersTemplate = filters.map((filter) => createFilterItemTemplate(filter)).join('');

  return `
  <form class="trip-filters" action="#" method="get">
    ${filtersTemplate}
    <button class="visually-hidden" type="submit">Accept filter</button>
  </form>
  `;
};

export default class FilterView extends AbstractView {
  /** @type {Array} Фильтры с количеством точек */
  #filters = [];

  /** @type {Function|null} Обработчик изменения фильтра */
  #handleFilterChange = null;

  #filterChangeHandler = (evt) => {
    if (evt.target.tagName !== 'INPUT') {
      return;
    }

    this.#handleFilterChange?.(evt.target.value);
  };

  /**
   * @param {object} params Параметры представления
   * @param {Array} params.filters Фильтры вида `[{ type, count, isChecked }]`
   * @param {Function} [params.onFilterChange] Обработчик изменения фильтра
   */
  constructor({ filters = [], onFilterChange }) {
    super();
    this.#filters = filters;
    this.#handleFilterChange = onFilterChange;

    this.element.addEventListener('change', this.#filterChangeHandler);
  }

  get template() {
    return createFilterTemplate(this.#filters);
  }
}
