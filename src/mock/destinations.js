/**
 * Функция для получения моковых направлений
 * @returns {Array} Массив направлений
 */
export const getMockDestinations = () => [
  {
    id: 'dest-1',
    name: 'Chamonix',
    description: 'Chamonix, is a beautiful valley near the junction of France, Switzerland and Italy.',
    pictures: [
      {
        src: 'img/photos/1.jpg',
        description: 'Chamonix mountains'
      }
    ]
  },
  {
    id: 'dest-2',
    name: 'Amsterdam',
    description: 'Amsterdam, lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    pictures: [
      {
        src: 'img/photos/2.jpg',
        description: 'Amsterdam canals'
      }
    ]
  },
  {
    id: 'dest-3',
    name: 'Geneva',
    description: 'Geneva, full of wonderful sights and park areas.',
    pictures: [
      {
        src: 'img/photos/3.jpg',
        description: 'Geneva lake'
      }
    ]
  },
  {
    id: 'dest-4',
    name: 'Kazan',
    description: '',
    pictures: []
  }
];
