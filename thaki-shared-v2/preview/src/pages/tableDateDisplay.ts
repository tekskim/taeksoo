/** Strip time portion from TDS-style datetime strings for table cells (e.g. "Jul 25, 2025 10:32:16" → "Jul 25, 2025"). */
export function stripTimeFromTableDate(value: string): string {
  if (!value || value === '-') return value;
  const trimmed = value.trim();
  const match = /^(.+\d{4})\s+\d{1,2}:\d{2}(:\d{2})?$/.exec(trimmed);
  return match ? match[1].trim() : trimmed;
}
