import AbstractView from '../framework/view/abstract-view.js';

const createMessageTemplate = (message) => `
  <p class="trip-events__msg">${message}</p>
`;

export default class MessageView extends AbstractView {
  /** @type {string} Текст сообщения */
  #message = '';

  /**
   * @param {object} [params] Параметры представления
   * @param {string} [params.message] Текст сообщения
   */
  constructor({ message = '' } = {}) {
    super();
    this.#message = message;
  }

  get template() {
    return createMessageTemplate(this.#message);
  }
}
