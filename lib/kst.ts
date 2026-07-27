const KST_OFFSET_MS = 9 * 60 * 60 * 1000;

export function getKstDateKey(date = new Date()) {
  return new Date(date.getTime() + KST_OFFSET_MS).toISOString().slice(0, 10);
}

export function getKstWeekStartKey(date = new Date()) {
  const shifted = new Date(date.getTime() + KST_OFFSET_MS);
  const daysSinceMonday = (shifted.getUTCDay() + 6) % 7;
  shifted.setUTCDate(shifted.getUTCDate() - daysSinceMonday);
  return shifted.toISOString().slice(0, 10);
}

export function formatKstTimestamp(date = new Date()) {
  return new Intl.DateTimeFormat("ko-KR", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(date);
}

export function getNextKstMonday(date = new Date()) {
  const shifted = new Date(date.getTime() + KST_OFFSET_MS);
  const daysUntilNextMonday = ((8 - shifted.getUTCDay()) % 7) || 7;
  return new Date(
    Date.UTC(
      shifted.getUTCFullYear(),
      shifted.getUTCMonth(),
      shifted.getUTCDate() + daysUntilNextMonday,
    ) - KST_OFFSET_MS,
  );
}
