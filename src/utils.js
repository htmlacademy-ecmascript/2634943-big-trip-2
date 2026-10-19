const MONTHS_SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

const pad = (value) => String(value).padStart(2, '0');

export const getRandomArrayElement = (items) => items[Math.floor(Math.random() * items.length)];

export const pointDate = (date) => {
  if (!date) {
    return '';
  }
  const value = new Date(date);
  return `${MONTHS_SHORT[value.getMonth()]} ${pad(value.getDate())}`;
};

export const pointTime = (date) => {
  if (!date) {
    return '';
  }
  const value = new Date(date);
  return `${pad(value.getHours())}:${pad(value.getMinutes())}`;
};

export const formDate = (date) => {
  if (!date) {
    return '';
  }
  const value = new Date(date);
  const year = String(value.getFullYear()).slice(2);
  return `${pad(value.getDate())}/${pad(value.getMonth() + 1)}/${year} ${pad(value.getHours())}:${pad(value.getMinutes())}`;
};

export const getPointDuration = (dateFrom, dateTo) => {
  const diffInMinutes = Math.floor((new Date(dateTo) - new Date(dateFrom)) / 60000);

  const hours = Math.floor(diffInMinutes / 60);
  const minutes = diffInMinutes % 60;

  return hours > 0
    ? `${pad(hours)}H ${pad(minutes)}M`
    : `${minutes}M`;
};
