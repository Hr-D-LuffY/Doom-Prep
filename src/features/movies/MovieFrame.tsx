import type { Movie } from "./movie.interface";

interface MovieFrameProps {
  movie: Movie;
  prerequisiteTitles: string[];
  pending: boolean;
  onToggleWatched: (movie: Movie) => void;
  onEdit: (movie: Movie) => void;
}

// One frame of film: dark until watched, then "developed" (light)
export const MovieFrame = ({
  movie,
  prerequisiteTitles,
  pending,
  onToggleWatched,
  onEdit,
}: MovieFrameProps) => {
  const inputId = `watched-${movie.id}`;
  const subtle = movie.watched ? "text-ink-soft" : "text-reel-soft";

  return (
    <li
      className={`grid grid-cols-[auto_minmax(0,1fr)_auto_auto] items-center gap-x-3 rounded-md px-3 py-3 motion-safe:transition-colors sm:gap-x-4 sm:px-4 ${
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

      <button
        type="button"
        onClick={() => onEdit(movie)}
        aria-label={`Edit ${movie.title}`}
        className={`-mr-1 flex h-9 w-9 items-center justify-center rounded-md focus-visible:outline-current motion-safe:transition-colors ${
          movie.watched
            ? "text-ink-soft hover:bg-ink/10 hover:text-ink"
            : "text-reel-soft hover:bg-pale/10 hover:text-pale"
        }`}
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 20h9" />
          <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4Z" />
        </svg>
      </button>
    </li>
  );
};
