import { render } from '../framework/render.js';
import FilterView from '../views/filter-view.js';
import SortView from '../views/sorting-view.js';
import ListView from '../views/list-view.js';
import PointPresenter from './point-presenter.js';

export default class TripPresenter {
  #listComponent = new ListView();

  #tripContainer = null;

  #filterContainer = null;

  #pointsModel = null;

  #tripPoints = [];

  constructor({ tripContainer, filterContainer, pointsModel }) {
    this.#tripContainer = tripContainer;
    this.#filterContainer = filterContainer;
    this.#pointsModel = pointsModel;
  }

  init() {
    this.#tripPoints = [...this.#pointsModel.getPoints()];

    render(new FilterView(), this.#filterContainer);
    render(new SortView(), this.#tripContainer);
    render(this.#listComponent, this.#tripContainer);

    this.#tripPoints.forEach((point) => {
      const pointPresenter = new PointPresenter({
        listContainer: this.#listComponent.element
      });

      pointPresenter.init(point);
    });
  }
}
