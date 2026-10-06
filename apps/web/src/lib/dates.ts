// Calendar dates as `YYYY-MM-DD`, computed in the guest's local time zone.
// (`toISOString()` would shift to UTC and land on the previous day in IST before 05:30.)
const pad = (value: number) => String(value).padStart(2, "0");

export const localIsoDate = (date = new Date()) => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

export const addDays = (iso: string, days: number) => {
  const [year, month, day] = iso.split("-").map(Number);
  return localIsoDate(new Date(year, month - 1, day + days));
};

export const nightsBetween = (from: string, to: string) => {
  const [y1, m1, d1] = from.split("-").map(Number);
  const [y2, m2, d2] = to.split("-").map(Number);
  return Math.round((Date.UTC(y2, m2 - 1, d2) - Date.UTC(y1, m1 - 1, d1)) / 86_400_000);
};
