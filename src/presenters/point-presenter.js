import { render, replace } from '../framework/render.js';
import PointView from '../views/point-view.js';
import EditFormView from '../views/edit-form-view.js';

export default class PointPresenter {
  #listContainer = null;

  #pointComponent = null;

  #formComponent = null;

  #escDownHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#replaceFormToPoint();
    }
  };

  constructor({ listContainer }) {
    this.#listContainer = listContainer;
  }

  init(point) {
    this.#pointComponent = new PointView({
      point,
      onEditClick: () => this.#replacePointToForm()
    });

    this.#formComponent = new EditFormView({
      point,
      onFormSubmit: () => this.#replaceFormToPoint(),
      onRollupClick: () => this.#replaceFormToPoint()
    });

    render(this.#pointComponent, this.#listContainer);
  }

  #replacePointToForm() {
    replace(this.#formComponent, this.#pointComponent);
    document.addEventListener('keydown', this.#escDownHandler);
  }

  #replaceFormToPoint() {
    if (!this.#formComponent.element.parentElement) {
      return;
    }

    replace(this.#pointComponent, this.#formComponent);
    document.removeEventListener('keydown', this.#escDownHandler);
  }
}
