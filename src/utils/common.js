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
