import dayjs from 'dayjs';

const humanizePointDateTime = (pointDate, format) =>
  pointDate ? dayjs(pointDate).format(format) : '';

const toIsoString = (date) => dayjs(date).toISOString();

const calcDuration = (from, to) => Math.ceil(to.diff(from, 'minutes', true));

const formatDuration = (diffMinutes) => {
  if (diffMinutes === 0) {
    return '0M';
  }

  const interval = dayjs.duration(diffMinutes, 'minutes');

  const DD = Math.floor(interval.asDays());
  const HH = interval.format('HH');
  const mm = interval.format('mm');

  let result = `${mm}M `;

  if (HH !== '00' || DD > 0) {
    result = `${HH}H ${result} `;
  }

  if (DD > 0) {
    result = `${DD < 10 ? '0' : ''}${DD}D ${result} `;
  }

  return result.slice(0, -1);
};

const isEmptyPoint = (point) => !Object.entries(point).length;
const isFuturePoint = (point) => dayjs(point.startDateTime).isAfter(dayjs());

const isPresentPoint = (point) => {
  const start = dayjs(point.startDateTime);
  const end = dayjs(point.endDateTime);
  return dayjs().isBetween(start, end, null, '[]');
};

const isPastPoint = (point) => dayjs(point.endDateTime).isBefore(dayjs());

const sortPointsByDate = (pointA, pointB) =>
  dayjs(pointA.startDateTime) - dayjs(pointB.startDateTime);

const sortPointsByTime = (pointA, pointB) => {
  const [durationA, durationB] = [pointA, pointB].map((point) =>
    calcDuration(dayjs(point.startDateTime), dayjs(point.endDateTime)),
  );

  return durationB - durationA;
};

const sortPointsByPrice = (pointA, pointB) => pointB.price - pointA.price;

export {
  humanizePointDateTime,
  toIsoString,
  calcDuration,
  formatDuration,
  isEmptyPoint,
  isFuturePoint,
  isPresentPoint,
  isPastPoint,
  sortPointsByDate,
  sortPointsByTime,
  sortPointsByPrice,
};
