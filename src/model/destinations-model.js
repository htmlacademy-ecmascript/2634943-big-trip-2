import Observable from '../framework/observable.js';

export default class DestinationsModel extends Observable {
  #tripApiService = null;
  #destinations = [];

  constructor({ tripApiService }) {
    super();
    this.#tripApiService = tripApiService;
  }

  get destinations() {
    return this.#destinations;
  }

  async init() {
    const destinations = await this.#tripApiService.destinations;
    this.#destinations = destinations.map((destination) =>
      this.#adaptToClient(destination),
    );
  }

  #adaptToClient(destination) {
    const adaptedDestination = {
      ...destination,
      title: destination['name'],
      photos: destination['pictures'],
    };

    delete adaptedDestination['name'];
    delete adaptedDestination['pictures'];

    return adaptedDestination;
  }
}
