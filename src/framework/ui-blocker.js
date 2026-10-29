import AbstractView from './view/abstract-view.js';
import { render, remove } from './render.js';
import './ui-blocker.css';

const createUiBlockerTemplate = () => `
  <section class="ui-blocker">
    <div class="ui-blocker__spinner"></div>
    <p class="ui-blocker__text">Loading...</p>
  </section>
`;

export default class UiBlocker extends AbstractView {
  #isBlocked = false;

  get template() {
    return createUiBlockerTemplate();
  }

  async block() {
    if (this.#isBlocked) {
      return;
    }

    this.#isBlocked = true;
    render(this, document.body);
  }

  unblock() {
    if (!this.#isBlocked) {
      return;
    }

    this.#isBlocked = false;
    remove(this);
  }
}
