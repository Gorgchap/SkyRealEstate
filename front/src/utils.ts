export const distanceArray = [
  { label: 'до 5 мин', value: 5 },
  { label: 'до 10 мин', value: 10 },
  { label: 'до 15 мин', value: 15 },
  { label: 'до 20 мин', value: 20 },
  { label: 'до 30 мин', value: 30 },
];

export const gridProperties = {
  p: 3,
  xs: 12,
  sm: 10,
  md: 8,
  sx: { flexFlow: 'column nowrap', alignItems: 'center', margin: '0 auto', textAlign: 'center' },
};

export const materialArray = [
  { label: 'Кирпич', value: 'brick' },
  { label: 'Монолит', value: 'monolith' },
  { label: 'Панель', value: 'panel' },
];

export function pluralRus(count: number, ...variants: [string, string, string]): string {
  if (count % 10 === 1 && count % 100 !== 11) {
    return `${count} ${variants[0]}`;
  } else if (count % 10 > 1 && count % 10 < 5 && (count % 100 < 10 || count % 100 > 19)) {
    return `${count} ${variants[1]}`;
  } else {
    return `${count} ${variants[2]}`;
  }
}

export const roomsArray = [
  { label: 'Не указано', value: -1 },
  { label: 'Студия', value: 0 },
  { label: '1', value: 1 },
  { label: '2', value: 2 },
  { label: '3', value: 3 },
  { label: '4', value: 4 },
  { label: '5', value: 5 },
];

export const segmentArray = [
  { label: 'Новостройка', value: 'new' },
  { label: 'Современное жильё', value: 'modern' },
  { label: 'Старый жилой фонд', value: 'old' },
];
