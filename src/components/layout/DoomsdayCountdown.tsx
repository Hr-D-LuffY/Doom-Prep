const DOOMSDAY_RELEASE = new Date(2026, 11, 18); // December 18, 2026, local time
const MS_PER_DAY = 24 * 60 * 60 * 1000;

const getDaysUntil = (target: Date, now: Date): number => {
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.round((target.getTime() - today.getTime()) / MS_PER_DAY);
};

const getCountdownText = (days: number): string => {
  if (days > 1) return `${days} days to Doomsday`;
  if (days === 1) return "Doomsday opens tomorrow";
  if (days === 0) return "Doomsday opens today";
  return "Doomsday is in theaters";
};

export const DoomsdayCountdown = () => (
  <p className="font-display text-lg font-medium text-ink-soft">
    {getCountdownText(getDaysUntil(DOOMSDAY_RELEASE, new Date()))}
  </p>
);
