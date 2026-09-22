import Offer from './Offer.js';
import Destination from './Destination.js';

export default class RoutePoint {
  constructor(options) {
    this.type = options.type;
    let destination = null;
    if (options.destination instanceof Destination) {
      destination = options.destination;
    } else if (options.destination) {
      destination = new Destination(options.destination);
    }
    this.destination = destination;
    this.offers = Array.isArray(options.offers)
      ? options.offers.map((offer) => offer instanceof Offer
        ? offer
        : new Offer(offer))
      : [];
    this.dateFrom = options.dateFrom;
    this.dateTo = options.dateTo;
    this.basePrice = options.basePrice;
    this.isFavorite = options.isFavorite;
    this.id = options.id;
  }
}
