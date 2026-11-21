interface ProgressBarProps {
  value: number;
  max: number;
  label: string;
}

export const ProgressBar = ({ value, max, label }: ProgressBarProps) => {
  const percent = max === 0 ? 0 : Math.round((value / max) * 100);

  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={value}
      className="h-1.5 overflow-hidden rounded-full bg-line"
    >
      <div
        className="h-full rounded-full bg-brass motion-safe:transition-[width] motion-safe:duration-300"
        style={{ width: `${percent}%` }}
      />
    </div>
  );
};
