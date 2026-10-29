import { FilterType } from '../const.js';
import Observable from '../framework/observable.js';

export default class FilterModel extends Observable {
  /** @type {string} Текущий тип фильтра */
  #filter = FilterType.EVERYTHING;

  /** @returns {string} Текущий тип фильтра */
  get filter() {
    return this.#filter;
  }

  /**
   * @param {string} updateType Тип обновления
   * @param {string} filter Новый тип фильтра
   */
  setFilter(updateType, filter) {
    this.#filter = filter;
    this._notify(updateType, filter);
  }
}
