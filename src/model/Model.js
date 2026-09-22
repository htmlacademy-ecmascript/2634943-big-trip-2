import { generateRoutePoints, offersData } from './mock-data.js';

export default class Model {
  constructor() {
    this.points = generateRoutePoints();
  }

  getPoints() {
    return this.points;
  }

  getOffers(type) {
    return offersData[type] || [];
  }
}
