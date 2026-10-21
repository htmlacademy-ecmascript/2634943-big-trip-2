/**
 * Функция для получения моковых групп опций
 * @returns {Array} Массив групп опций по типам точки
 */
export const getMockOffers = () => [
  {
    type: 'taxi',
    offers: [
      {
        id: 'offer-1',
        title: 'Order Uber',
        price: 20
      },
      {
        id: 'offer-2',
        title: 'Upgrade to business',
        price: 50
      }
    ]
  },
  {
    type: 'bus',
    offers: [
      {
        id: 'offer-7',
        title: 'Travel by bus',
        price: 40
      }
    ]
  },
  {
    type: 'flight',
    offers: [
      {
        id: 'offer-3',
        title: 'Add luggage',
        price: 50
      },
      {
        id: 'offer-4',
        title: 'Switch to comfort',
        price: 80
      },
      {
        id: 'offer-5',
        title: 'Add meal',
        price: 15
      }
    ]
  },
  {
    type: 'train',
    offers: [
      {
        id: 'offer-6',
        title: 'Choose seats',
        price: 5
      }
    ]
  },
  {
    type: 'drive',
    offers: []
  },
  {
    type: 'check-in',
    offers: []
  }
];
