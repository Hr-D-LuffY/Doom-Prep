interface SpinnerProps {
  label?: string;
}

export const Spinner = ({ label = "Loading..." }: SpinnerProps) => (
  <div
    role="status"
    className="flex items-center justify-center gap-3 py-12 text-slate-400"
  >
    <span className="h-5 w-5 animate-spin rounded-full border-2 border-slate-600 border-t-red-500" />
    <span className="text-sm">{label}</span>
  </div>
);
