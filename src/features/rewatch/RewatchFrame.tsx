import { WatchToggle } from "../../components/ui/WatchToggle";
import { formatDuration } from "../../utils/formatDuration";
import type { RewatchItem } from "./rewatch.interface";

interface RewatchFrameProps {
  position: number;
  item: RewatchItem;
  pending: boolean;
  onToggleWatched: (item: RewatchItem) => void;
}

export const RewatchFrame = ({
  position,
  item,
  pending,
  onToggleWatched,
}: RewatchFrameProps) => {
  const inputId = `rewatch-${item.id}`;
  const subtle = item.watched ? "text-ink-soft" : "text-reel-soft";

  return (
    <li
      className={`grid grid-cols-[1.75rem_auto_minmax(0,1fr)_auto] items-center gap-x-3 rounded-md px-3 py-3 motion-safe:transition-colors sm:gap-x-4 sm:px-4 ${
        item.watched ? "bg-frame text-ink" : "bg-reel-deep text-pale"
      }`}
    >
      {}
      <span
        aria-hidden="true"
        className={`font-display text-2xl font-semibold leading-none tabular-nums ${subtle}`}
      >
        {position}
      </span>
      <WatchToggle
        id={inputId}
        checked={item.watched}
        disabled={pending}
        onChange={() => onToggleWatched(item)}
      />
      <label
        htmlFor={inputId}
        className="min-w-0 cursor-pointer font-display text-xl font-semibold leading-tight"
      >
        {item.title}
      </label>
      <p className={`text-sm tabular-nums ${subtle}`}>
        {formatDuration(item.runtime)}
      </p>
    </li>
  );
};
