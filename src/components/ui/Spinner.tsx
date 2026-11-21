interface SpinnerProps {
  label?: string;
}

export const Spinner = ({ label = "Loading..." }: SpinnerProps) => (
  <div
    role="status"
    className="flex items-center justify-center gap-3 py-16 text-ink-soft"
  >
    <span className="h-5 w-5 rounded-full border-2 border-line border-t-ink motion-safe:animate-spin" />
    <span className="text-sm">{label}</span>
  </div>
);
