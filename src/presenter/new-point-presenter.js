import { remove, render, RenderPosition } from '../framework/render.js';
import EditPointView from '../view/edit-point-view.js';
import OffersPresenter from './offers-presenter.js';
import DestinationPresenter from './destination-presenter.js';
import { UserAction, UpdateType } from '../const.js';

export default class NewPointPresenter {
  #pointListContainer = null;
  #offersList = null;
  #destinationsList = null;
  #offersPresenter = null;
  #destinationPresenter = null;

  #handleDataChange = null;
  #handleDestroy = null;
  #destroyCb = null;

  #editPointComponent = null;

  constructor({
    pointListContainer,
    offersList,
    destinationsList,
    onDataChange,
    onDestroy,
  }) {
    this.#pointListContainer = pointListContainer;
    this.#offersList = offersList;
    this.#destinationsList = destinationsList;
    this.#handleDataChange = onDataChange;
    this.#handleDestroy = onDestroy;
  }

  get offersList() {
    return this.#offersList;
  }

  set offersList(offers) {
    this.#offersList = offers;
  }

  get destinationsList() {
    return this.#destinationsList;
  }

  set destinationsList(destinations) {
    this.#destinationsList = destinations;
  }

  init(destroyCb) {
    this.#destroyCb = destroyCb;

    if (this.#editPointComponent !== null) {
      return;
    }

    this.#editPointComponent = new EditPointView({
      point: {},
      destinations: this.#destinationsList,
      offers: this.#offersList,
      onFormSubmit: this.#handleFormSubmit,
      onDeleteClick: this.#handleDeleteClick,
      isNewPoint: true,
    });

    this.#offersPresenter = new OffersPresenter({
      point: this.#editPointComponent,
      offers: this.#offersList,
    });

    this.#destinationPresenter = new DestinationPresenter({
      point: this.#editPointComponent,
    });

    render(
      this.#editPointComponent,
      this.#pointListContainer.element,
      RenderPosition.AFTERBEGIN,
    );

    this.#offersPresenter.init();
    this.#destinationPresenter.init();
    this.#editPointComponent.setDatepicker();

    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  destroy() {
    if (this.#editPointComponent === null) {
      return;
    }

    this.#handleDestroy();

    remove(this.#editPointComponent);
    this.#editPointComponent = null;

    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#destroyCb();
  }

  setSaving() {
    this.#editPointComponent.updateElement({
      isDisabled: true,
      isSaving: true,
    });
  }

  setAborting() {
    const resetFormState = () => {
      this.#editPointComponent.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    this.#editPointComponent.shake(resetFormState);
  }

  #handleFormSubmit = (point) => {
    this.#handleDataChange(UserAction.ADD_POINT, UpdateType.MINOR, point);
  };

  #handleDeleteClick = () => {
    this.destroy();
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.destroy();
    }
  };
}
