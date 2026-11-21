export const inputClass = (hasError: boolean): string =>
  `w-full rounded-md border bg-surface px-3 py-2 text-base placeholder:text-ink-soft/70 disabled:opacity-60 ${
    hasError ? "border-danger" : "border-edge"
  }`;
