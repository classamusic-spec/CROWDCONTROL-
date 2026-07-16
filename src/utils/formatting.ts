/** Small pure formatting helpers used across UI and share text. */

/** Format milliseconds as `M:SS` or `MM:SS`. */
export function formatTime(ms: number): string {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

/** Pluralize a noun by count (basic English). */
export function plural(count: number, singular: string, pluralForm?: string): string {
  if (count === 1) return `${count} ${singular}`;
  return `${count} ${pluralForm ?? `${singular}s`}`;
}

/** Clamp a number into [min, max]. */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}
