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

/** @const {string} Формат даты в блоке информации о поездке */
const TRIP_INFO_DATE_FORMAT = 'DD MMM';

/**
 * Функция для сортировки точек по дате начала
 * @param {object} a Первая точка
 * @param {object} b Вторая точка
 * @returns {number} Результат сравнения дат
 */
const sortPointsByDate = (a, b) => dayjs(a.dateFrom).diff(dayjs(b.dateFrom));

/**
 * Функция для формирования строки маршрута
 * @param {Array} points Точки маршрута
 * @param {object} destinationsModel Модель направлений
 * @returns {string} Строка маршрута
 */
export const buildRouteString = (points, destinationsModel) => {
  const sortedPoints = [...points].sort(sortPointsByDate);
  const cities = sortedPoints.map((point) => destinationsModel.getById(point.destination)?.name ?? '');

  if (cities.length > 3) {
    return `${cities[0]} &mdash; ... &mdash; ${cities[cities.length - 1]}`;
  }

  return cities.join(' &mdash; ');
};

/**
 * Функция для формирования строки дат по первой и последней точке
 * @param {Array} points Точки маршрута
 * @returns {string} Строка дат
 */
export const buildDatesString = (points) => {
  const sortedPoints = [...points].sort(sortPointsByDate);
  const firstDate = dayjs(sortedPoints[0].dateFrom);
  const lastDate = dayjs(sortedPoints[sortedPoints.length - 1].dateTo);

  const formatDate = (date) => date.format(TRIP_INFO_DATE_FORMAT).toUpperCase();

  const start = formatDate(firstDate);
  const end = formatDate(lastDate);

  if (firstDate.isSame(lastDate, 'month')) {
    const startDay = start.slice(0, start.indexOf(' '));
    return `${startDay}–${end}`;
  }

  return `${start} – ${end}`;
};

/**
 * Функция для вычисления стоимости опций точки
 * @param {object} point Точка маршрута
 * @param {object} offersModel Модель опций
 * @returns {number} Стоимость опций точки
 */
const calcOffersPrice = (point, offersModel) => {
  const offers = offersModel.getByType(point.type);

  return point.offers.reduce(
    (sum, offerId) => sum + (offers.find((item) => item.id === offerId)?.price ?? 0),
    0
  );
};

/**
 * Функция для вычисления общей стоимости поездки
 * @param {Array} points Точки маршрута
 * @param {object} offersModel Модель опций
 * @returns {number} Общая стоимость
 */
export const calcTotalPrice = (points, offersModel) =>
  points.reduce(
    (total, point) => total + point.basePrice + calcOffersPrice(point, offersModel),
    0
  );
