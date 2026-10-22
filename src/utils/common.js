/**
 * Функция для получения случайного элемента массива
 * @param {Array} items Массив элементов
 * @returns {*} Случайный элемент массива
 */
export const getRandomArrayElement = (items) => items[Math.floor(Math.random() * items.length)];

/**
 * Функция для приведения слова к capitalized-виду
 * @param {string} word Слово
 * @returns {string} Слово с заглавной буквой
 */
export const capitalize = (word) => `${word.charAt(0).toUpperCase()}${word.slice(1)}`;

/**
 * Функция для замены элемента массива по его идентификатору
 * @param {Array} items Массив элементов
 * @param {object} updatedItem Обновлённый элемент
 * @returns {Array} Новый массив с обновлённым элементом
 */
export const updateItem = (items, updatedItem) => (
  items.map((item) => (item.id === updatedItem.id ? updatedItem : item))
);
