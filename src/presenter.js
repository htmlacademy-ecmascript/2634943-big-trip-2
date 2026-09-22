import {render, RenderPosition} from './render.js';
import Filter from './view/Filter.js';
import Sort from './view/Sort.js';
import RoutePoint from './view/RoutePoint.js';
import PointForm from './view/PointForm.js';

export default class Presenter {
  constructor({model}) {
    this.model = model;
  }

  render() {
    document.addEventListener('DOMContentLoaded', () => {
      render(new Filter(), document.querySelector('.trip-controls__filters'));

      const points = this.model.getPoints();
      const firstPoint = points[0];

      if (firstPoint) {
        const allOffers = this.model.getOffers(firstPoint.type);
        const selectedOffers = firstPoint.offers || [];
        render(new PointForm({
          type: firstPoint.type,
          destination: firstPoint.destination,
          dateFrom: firstPoint.dateFrom,
          dateTo: firstPoint.dateTo,
          basePrice: firstPoint.basePrice,
          offers: allOffers,
          selectedOffers,
          id: firstPoint.id,
          isEdit: true,
        }), document.querySelector('.trip-events'), RenderPosition.AFTERBEGIN);
      } else {
        render(new PointForm({
          isEdit: false,
        }), document.querySelector('.trip-events'), RenderPosition.AFTERBEGIN);
      }

      render(new Sort(), document.querySelector('.trip-events'), RenderPosition.AFTERBEGIN);

      points.forEach((point) => {
        render(new RoutePoint(point), document.querySelector('.trip-events'));
      });
    });
  }
}
