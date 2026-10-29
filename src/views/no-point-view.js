import AbstractView from '../framework/view/abstract-view.js';
import { noPointsTextType } from '../const.js';

const createNoPointTemplate = (filterType) => `
  <p class="trip-events__msg">${noPointsTextType[filterType]}</p>
`;

export default class NoPointView extends AbstractView {
  /** @type {string} Тип фильтра */
  #filterType = '';

  /**
   * @param {object} [params] Параметры представления
   * @param {string} [params.filterType] Тип фильтра
   */
  constructor({ filterType = '' } = {}) {
    super();
    this.#filterType = filterType;
  }

  get template() {
    return createNoPointTemplate(this.#filterType);
  }
}
