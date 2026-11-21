interface WatchToggleProps {
  id: string;
  checked: boolean;
  disabled?: boolean;
  onChange: () => void;
}

export const WatchToggle = ({
  id,
  checked,
  disabled = false,
  onChange,
}: WatchToggleProps) => (
  <span className="relative flex h-7 w-7 shrink-0">
    <input
      id={id}
      type="checkbox"
      checked={checked}
      disabled={disabled}
      onChange={onChange}
      className="peer sr-only"
    />
    <span
      aria-hidden="true"
      className="h-7 w-7 rounded-full border-2 border-brass-light peer-checked:border-ink peer-checked:bg-brass peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-current peer-disabled:opacity-50"
    />
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      className="pointer-events-none absolute inset-0 m-auto h-4 w-4 text-ink opacity-0 peer-checked:opacity-100"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 10.5l4 4 8-9" />
    </svg>
  </span>
);
