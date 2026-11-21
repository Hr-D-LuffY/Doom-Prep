import type { Movie } from "./movie.interface";

interface MovieFrameProps {
  movie: Movie;
  prerequisiteTitles: string[];
  pending: boolean;
  onToggleWatched: (movie: Movie) => void;
}

export const MovieFrame = ({
  movie,
  prerequisiteTitles,
  pending,
  onToggleWatched,
}: MovieFrameProps) => {
  const inputId = `watched-${movie.id}`;
  const subtle = movie.watched ? "text-ink-soft" : "text-reel-soft";

  return (
    <li
      className={`grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-x-4 rounded-md px-4 py-3 motion-safe:transition-colors ${
        movie.watched ? "bg-frame text-ink" : "bg-reel-deep text-pale"
      }`}
    >
      <span className="relative flex h-7 w-7 shrink-0">
        <input
          id={inputId}
          type="checkbox"
          checked={movie.watched}
          disabled={pending}
          onChange={() => onToggleWatched(movie)}
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

      <div className="min-w-0">
        <label
          htmlFor={inputId}
          className="block cursor-pointer font-display text-xl font-semibold leading-tight"
        >
          {movie.title}
        </label>
        {prerequisiteTitles.length > 0 && (
          <p className={`mt-0.5 text-xs ${subtle}`}>
            Watch first: {prerequisiteTitles.join(", ")}
          </p>
        )}
      </div>

      <div className="text-right">
        <p className="font-display text-2xl font-semibold leading-none tabular-nums">
          {movie.releaseYear}
        </p>
        <p className={`mt-1 text-xs ${subtle}`}>{movie.runtime} min</p>
      </div>
    </li>
  );
};
