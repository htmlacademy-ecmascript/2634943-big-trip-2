import AbstractView from '../framework/view/abstract-view.js';

const createNewPointButtonTemplate = () => `
  <button class="trip-main__event-add-btn  btn  btn--big  btn--yellow" type="button">New event</button>
`;

export default class NewPointButtonView extends AbstractView {
  /** @type {Function|null} Обработчик клика по кнопке */
  #handleClick = null;

  #clickHandler = (evt) => {
    evt.preventDefault();
    this.#handleClick?.();
  };

  /**
   * @param {object} params Параметры представления
   * @param {Function} params.onClick Обработчик клика по кнопке
   */
  constructor({ onClick }) {
    super();
    this.#handleClick = onClick;

    this.element.addEventListener('click', this.#clickHandler);
  }

  get template() {
    return createNewPointButtonTemplate();
  }

  /** Блокирует кнопку */
  disable() {
    if (this.element) {
      this.element.disabled = true;
    }
  }

  /** Разблокирует кнопку */
  enable() {
    if (this.element) {
      this.element.disabled = false;
    }
  }
}
