export const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
export const mondayFirstDayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function toDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function todayKey() {
  return toDateKey(new Date());
}

export function addDays(dateKey: string, amount: number) {
  const date = parseDateKey(dateKey);
  date.setDate(date.getDate() + amount);
  return toDateKey(date);
}

export function addMonths(dateKey: string, amount: number) {
  const date = parseDateKey(dateKey);
  date.setMonth(date.getMonth() + amount);
  return toDateKey(date);
}

export function parseDateKey(dateKey: string) {
  const [year, month, day] = dateKey.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function daysBetween(startDate: string, endDate: string) {
  const start = parseDateKey(startDate);
  const end = parseDateKey(endDate);
  const msPerDay = 24 * 60 * 60 * 1000;
  return Math.floor((end.getTime() - start.getTime()) / msPerDay);
}

export function formatLongDate(dateKey: string) {
  return parseDateKey(dateKey).toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

export function formatShortDate(dateKey: string) {
  return parseDateKey(dateKey).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

export function formatMonthYear(dateKey: string) {
  return parseDateKey(dateKey).toLocaleDateString(undefined, {
    month: "long",
    year: "numeric",
  });
}

export function startOfWeek(dateKey: string) {
  const date = parseDateKey(dateKey);
  const day = date.getDay();
  const mondayOffset = day === 0 ? -6 : 1 - day;
  date.setDate(date.getDate() + mondayOffset);
  return toDateKey(date);
}

export function endOfWeek(dateKey: string) {
  return addDays(startOfWeek(dateKey), 6);
}

export function getWeekDays(dateKey: string) {
  const start = startOfWeek(dateKey);
  return Array.from({ length: 7 }, (_, index) => addDays(start, index));
}

export function getCalendarMonthDays(monthDateKey: string) {
  const monthDate = parseDateKey(monthDateKey);
  const firstOfMonth = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
  const lastOfMonth = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0);
  const firstKey = toDateKey(firstOfMonth);
  const lastKey = toDateKey(lastOfMonth);
  const calendarStart = startOfWeek(firstKey);
  const calendarEnd = endOfWeek(lastKey);
  const days: string[] = [];
  let cursor = calendarStart;

  while (cursor <= calendarEnd) {
    days.push(cursor);
    cursor = addDays(cursor, 1);
  }

  return days;
}

export function isSameMonth(dateKey: string, monthDateKey: string) {
  const date = parseDateKey(dateKey);
  const monthDate = parseDateKey(monthDateKey);
  return date.getFullYear() === monthDate.getFullYear() && date.getMonth() === monthDate.getMonth();
}
