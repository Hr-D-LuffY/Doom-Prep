import type { ReactNode } from "react";

interface EmptyStateProps {
  children: ReactNode;
}

export const EmptyState = ({ children }: EmptyStateProps) => (
  <p className="rounded-lg border border-dashed border-edge px-4 py-12 text-center text-ink-soft">
    {children}
  </p>
);
