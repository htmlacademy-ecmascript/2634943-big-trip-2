import {EVENT_ICONS} from '../const.js';

export default class RoutePoint {
  constructor(options) {
    this.type = options.type;
    this.destination = options.destination;
    this.dateFrom = options.dateFrom;
    this.dateTo = options.dateTo;
    this.basePrice = options.basePrice;
    this.offers = options.offers || [];
    this.isFavorite = options.isFavorite;
  }

  get template() {
    const dateFrom = new Date(this.dateFrom);
    const dateTo = new Date(this.dateTo);
    const startHours = String(dateFrom.getHours()).padStart(2, '0');
    const startMinutes = String(dateFrom.getMinutes()).padStart(2, '0');
    const endHours = String(dateTo.getHours()).padStart(2, '0');
    const endMinutes = String(dateTo.getMinutes()).padStart(2, '0');

    const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    const month = monthNames[dateFrom.getMonth()];
    const day = dateFrom.getDate();

    const durationMs = dateTo - dateFrom;
    const durationMinutes = Math.floor(durationMs / 60000);
    const durationHours = Math.floor(durationMinutes / 60);
    const durationDays = Math.floor(durationHours / 24);
    const remainingHours = durationHours % 24;
    const remainingMinutes = durationMinutes % 60;

    let duration = '';
    if (durationDays > 0) {
      duration = `${durationDays}D ${String(remainingHours).padStart(2, '0')}H ${String(remainingMinutes).padStart(2, '0')}M`;
    } else if (durationHours > 0) {
      duration = `${String(durationHours).padStart(2, '0')}H ${String(remainingMinutes).padStart(2, '0')}M`;
    } else {
      duration = `${durationMinutes}M`;
    }

    const iconSrc = EVENT_ICONS[this.type] || EVENT_ICONS['flight'];
    const typeCapitalized = this.type.charAt(0).toUpperCase() + this.type.slice(1);
    const title = this.destination ? `${typeCapitalized} ${this.destination.name}` : `${typeCapitalized}`;
    const favoriteClass = this.isFavorite ? 'event__favorite-btn--active' : '';

    const offersList = this.offers.map((offer) => `
      <li class="event__offer">
        <span class="event__offer-title">${offer.name}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${offer.price}</span>
      </li>`).join('');

    return `
      <li class="trip-events__item">
        <div class="event">
          <time class="event__date" datetime="${dateFrom.toISOString()}">${month} ${day}</time>
          <div class="event__type">
            <img class="event__type-icon" width="42" height="42" src="${iconSrc}" alt="Event type icon">
          </div>
          <h3 class="event__title">${title}</h3>
          <div class="event__schedule">
            <p class="event__time">
              <time class="event__start-time" datetime="${dateFrom.toISOString()}">${startHours}:${startMinutes}</time>
              &mdash;
              <time class="event__end-time" datetime="${dateTo.toISOString()}">${endHours}:${endMinutes}</time>
            </p>
            <p class="event__duration">${duration}</p>
          </div>
          <p class="event__price">
            &euro;&nbsp;<span class="event__price-value">${this.basePrice}</span>
          </p>
          <h4 class="visually-hidden">Offers:</h4>
          <ul class="event__selected-offers">
            ${offersList}
          </ul>
          <button class="event__favorite-btn ${favoriteClass}" type="button">
            <span class="visually-hidden">Add to favorite</span>
            <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
              <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
            </svg>
          </button>
          <button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Open event</span>
          </button>
        </div>
      </li>`;
  }

  getElement() {
    const container = document.createElement('div');
    container.innerHTML = this.template;
    return container.firstElementChild;
  }
}
