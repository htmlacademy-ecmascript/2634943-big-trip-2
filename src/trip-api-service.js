import ApiService from './framework/api-service.js';

const END_POINT = 'https://22.objects.htmlacademy.pro/big-trip';
const AUTHORIZATION = 'Basic h3j9k2m8p4q6w1';

const Method = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  DELETE: 'DELETE',
};

export default class TripApiService extends ApiService {
  constructor() {
    super(END_POINT, AUTHORIZATION);
  }

  get points() {
    return this._load({ url: 'points' })
      .then(ApiService.parseResponse)
      .then((points) => points.map((point) => this.#adaptToClient(point)));
  }

  get offers() {
    return this._load({ url: 'offers' }).then(ApiService.parseResponse);
  }

  get destinations() {
    return this._load({ url: 'destinations' }).then(ApiService.parseResponse);
  }

  updatePoint(point) {
    return this._load({
      url: `points/${point.id}`,
      method: Method.PUT,
      body: JSON.stringify(this.#adaptToServer(point)),
      headers: new Headers({ 'Content-Type': 'application/json' }),
    })
      .then(ApiService.parseResponse)
      .then((updatedPoint) => this.#adaptToClient(updatedPoint));
  }

  addPoint(point) {
    return this._load({
      url: 'points',
      method: Method.POST,
      body: JSON.stringify(this.#adaptToServer(point)),
      headers: new Headers({ 'Content-Type': 'application/json' }),
    })
      .then(ApiService.parseResponse)
      .then((newPoint) => this.#adaptToClient(newPoint));
  }

  deletePoint(point) {
    return this._load({
      url: `points/${point.id}`,
      method: Method.DELETE,
    });
  }

  #adaptToServer(point) {
    return {
      id: point.id,
      // eslint-disable-next-line camelcase
      base_price: point.basePrice,
      // eslint-disable-next-line camelcase
      date_from: point.dateFrom,
      // eslint-disable-next-line camelcase
      date_to: point.dateTo,
      destination: point.destination,
      offers: point.offers,
      // eslint-disable-next-line camelcase
      is_favorite: point.isFavorite,
      type: point.type,
    };
  }

  #adaptToClient(point) {
    return {
      id: point.id,
      basePrice: point.base_price,
      dateFrom: point.date_from,
      dateTo: point.date_to,
      destination: point.destination,
      offers: point.offers,
      isFavorite: point.is_favorite,
      type: point.type,
    };
  }
}
