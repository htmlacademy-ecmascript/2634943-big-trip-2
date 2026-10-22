import dayjs from 'dayjs';

/** @const {string} Формат даты точки в списке */
const POINT_DATE_FORMAT = 'MMM DD';

/** @const {string} Формат времени точки в списке */
const POINT_TIME_FORMAT = 'HH:mm';

/** @const {string} Формат даты и времени в форме */
const FORM_DATE_FORMAT = 'DD/MM/YY HH:mm';

/**
 * Функция для дополнения числа ведущим нулём
 * @param {number} value Число
 * @returns {string} Строка из двух символов
 */
const pad = (value) => String(value).padStart(2, '0');

/**
 * Функция для форматирования даты точки
 * @param {string|Date} [date] Дата
 * @returns {string} Дата в формате `Mar 18`
 */
export const formatPointDate = (date) => (date ? dayjs(date).format(POINT_DATE_FORMAT) : '');

/**
 * Функция для форматирования времени точки
 * @param {string|Date} [date] Дата
 * @returns {string} Время в формате `10:30`
 */
export const formatPointTime = (date) => (date ? dayjs(date).format(POINT_TIME_FORMAT) : '');

/**
 * Функция для форматирования даты и времени в форме
 * @param {string|Date} [date] Дата
 * @returns {string} Дата и время в формате `18/03/19 10:30`
 */
export const formatFormDate = (date) => (date ? dayjs(date).format(FORM_DATE_FORMAT) : '');

/**
 * Функция для вычисления длительности точки в минутах
 * @param {string|Date} dateFrom Начало
 * @param {string|Date} dateTo Окончание
 * @returns {number} Длительность в минутах
 */
export const getPointDurationInMinutes = (dateFrom, dateTo) => dayjs(dateTo).diff(dayjs(dateFrom), 'minute');

/**
 * Функция для вычисления длительности точки
 * @param {string|Date} dateFrom Начало
 * @param {string|Date} dateTo Окончание
 * @returns {string} Длительность в формате `01H 30M`
 */
export const getPointDuration = (dateFrom, dateTo) => {
  if (!dateFrom || !dateTo) {
    return '';
  }

  const diffInMinutes = getPointDurationInMinutes(dateFrom, dateTo);
  const days = Math.floor(diffInMinutes / (24 * 60));
  const hours = Math.floor((diffInMinutes % (24 * 60)) / 60);
  const minutes = diffInMinutes % 60;

  if (days > 0) {
    return `${days}D ${pad(hours)}H ${pad(minutes)}M`;
  }

  return hours > 0
    ? `${pad(hours)}H ${pad(minutes)}M`
    : `${minutes}M`;
};

/**
 * Функция для проверки, что точка находится в будущем
 * @param {object} point Точка маршрута
 * @returns {boolean} Начало точки позже текущего момента
 */
export const isPointFuture = (point) => dayjs(point.dateFrom).isAfter(dayjs());

/**
 * Функция для проверки, что точка находится в прошлом
 * @param {object} point Точка маршрута
 * @returns {boolean} Окончание точки раньше текущего момента
 */
export const isPointPast = (point) => dayjs(point.dateTo).isBefore(dayjs());

/**
 * Функция для проверки, что точка происходит сейчас
 * @param {object} point Точка маршрута
 * @returns {boolean} Точка не в прошлом и не в будущем
 */
export const isPointPresent = (point) => !isPointFuture(point) && !isPointPast(point);
