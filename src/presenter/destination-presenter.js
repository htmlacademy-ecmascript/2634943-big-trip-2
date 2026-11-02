import PointDestinationView from '../view/point-destination-view.js';
import { render } from '../framework/render.js';

export default class DestinationPresenter {
  #point = null;
  #destinationComponent = null;

  constructor({ point }) {
    this.#point = point;
  }

  init() {
    if (!this.#destinationComponent) {
      this.#destinationComponent = new PointDestinationView({
        point: this.#point.data,
      });
    }

    render(this.#destinationComponent, this.#point.eventDetailsElement);
  }
}
