import { render } from '../render.js';
import PointView from '../views/point-view.js';
import EditFormView from '../views/edit-form-view.js';
import FilterView from '../views/filter-view.js';
import SortView from '../views/sorting-view.js';
import ListView from '../views/list-view.js';

export default class TripPresenter {
  listComponent = new ListView();

  constructor({ tripContainer, filterContainer, pointsModel }) {
    this.tripContainer = tripContainer;
    this.filterContainer = filterContainer;
    this.pointsModel = pointsModel;
  }

  init() {
    this.tripPoints = [...this.pointsModel.getPoints()];

    render(new FilterView(), this.filterContainer);
    render(new SortView(), this.tripContainer);
    render(this.listComponent, this.tripContainer);
    render(new EditFormView({ point: this.tripPoints[0] }), this.listComponent.getElement());

    for (let i = 1; i < this.tripPoints.length; i++) {
      render(
        new PointView({ point: this.tripPoints[i] }),
        this.listComponent.getElement()
      );
    }
  }
}
