// 410 -> "6h 50m", 120 -> "2h", 45 -> "45m", 0 -> "0m"
export const formatDuration = (totalMinutes: number): string => {
  const minutes = Math.max(0, Math.round(totalMinutes));
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;

  if (hours === 0) return `${rest}m`;
  if (rest === 0) return `${hours}h`;
  return `${hours}h ${rest}m`;
};
