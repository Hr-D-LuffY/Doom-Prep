import type { ReactNode } from "react";

interface FilmStripProps {
  ordered?: boolean;
  children: ReactNode;
}

export const FilmStrip = ({ ordered = false, children }: FilmStripProps) => {
  const List = ordered ? "ol" : "ul";

  return (
    <div className="grid grid-cols-[26px_minmax(0,1fr)] overflow-hidden rounded-xl bg-reel sm:grid-cols-[26px_minmax(0,1fr)_26px]">
      <div aria-hidden="true" className="sprockets" />
      <List className="flex flex-col gap-1.5 py-2">{children}</List>
      <div aria-hidden="true" className="sprockets hidden sm:block" />
    </div>
  );
};
