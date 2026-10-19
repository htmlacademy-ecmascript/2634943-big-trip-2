import { getRandomArrayElement } from '../utils.js';
import { mockDestinations, mockOffers, POINT } from '../const.js';

export const getRandomPoint = () => {
  const typePoint = getRandomArrayElement(POINT).toLowerCase();

  const destination = getRandomArrayElement(mockDestinations);

  const typeOffers = mockOffers.find((offer) => offer.type === typePoint);

  const offersIds = typeOffers ? typeOffers.offers.map((offer) => offer.id) : [];

  return {
    id: `point-${Math.floor(Math.random() * 1000)}`,
    basePrice: Math.floor(Math.random() * 500) + 20,
    dateFrom: '2026-03-18T10:30:00.000Z',
    dateTo: '2026-03-18T11:00:00.000Z',
    destination: destination.id,
    isFavorite: Math.random() > 0.5,
    offers: offersIds,
    type: typePoint
  };
};
