/**
 * UTC date helpers for the daily challenge. Everything is computed against UTC
 * midnight so the "puzzle of the day" is identical worldwide and timezone-safe.
 */

/** Epoch the daily-puzzle numbering counts from (UTC). */
export const DAILY_EPOCH = '2025-01-01';

/** Format a Date as a UTC `YYYY-MM-DD` string. */
export function toUtcDateString(date: Date): string {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, '0');
  const d = String(date.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/** Parse a `YYYY-MM-DD` string to UTC-midnight epoch millis. */
export function utcDateStringToMs(dateString: string): number {
  const [y, m, d] = dateString.split('-').map((n) => parseInt(n, 10));
  return Date.UTC(y ?? 1970, (m ?? 1) - 1, d ?? 1);
}

const MS_PER_DAY = 86400000;

/** Whole UTC days between two `YYYY-MM-DD` strings (b - a). */
export function daysBetween(a: string, b: string): number {
  return Math.round((utcDateStringToMs(b) - utcDateStringToMs(a)) / MS_PER_DAY);
}

/** The daily puzzle number for a UTC date string (epoch date = #1). */
export function dailyNumber(dateString: string): number {
  return daysBetween(DAILY_EPOCH, dateString) + 1;
}

/** Today's UTC date string. */
export function todayUtc(now: Date = new Date()): string {
  return toUtcDateString(now);
}

/** The UTC date string N days before the given date string. */
export function addDays(dateString: string, delta: number): string {
  return toUtcDateString(new Date(utcDateStringToMs(dateString) + delta * MS_PER_DAY));
}
