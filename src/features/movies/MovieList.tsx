import { MovieFrame } from "./MovieFrame";
import type { Movie } from "./movie.interface";

interface MovieListProps {
  movies: Movie[];
  pendingIds: number[];
  onToggleWatched: (movie: Movie) => void;
  onEdit: (movie: Movie) => void;
}

export const MovieList = ({
  movies,
  pendingIds,
  onToggleWatched,
  onEdit,
}: MovieListProps) => {
  if (movies.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-edge px-4 py-12 text-center text-ink-soft">
        No movies yet. Add the first one with the form.
      </p>
    );
  }

  const titleById = new Map(movies.map((movie) => [movie.id, movie.title]));
  const watchedCount = movies.filter((movie) => movie.watched).length;
  const percent = Math.round((watchedCount / movies.length) * 100);

  return (
    <div>
      <div className="mb-5">
        <p className="font-display text-3xl font-semibold leading-none">
          {watchedCount} of {movies.length} watched
        </p>
        <div
          role="progressbar"
          aria-label="Movies watched"
          aria-valuemin={0}
          aria-valuemax={movies.length}
          aria-valuenow={watchedCount}
          className="mt-3 h-1.5 overflow-hidden rounded-full bg-line"
        >
          <div
            className="h-full rounded-full bg-brass motion-safe:transition-[width] motion-safe:duration-300"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-[26px_minmax(0,1fr)] overflow-hidden rounded-xl bg-reel sm:grid-cols-[26px_minmax(0,1fr)_26px]">
        <div aria-hidden="true" className="sprockets" />
        <ul className="flex flex-col gap-1.5 py-2">
          {movies.map((movie) => (
            <MovieFrame
              key={movie.id}
              movie={movie}
              prerequisiteTitles={movie.prerequisites.map(
                (id) => titleById.get(id) ?? `Movie #${id}`,
              )}
              pending={pendingIds.includes(movie.id)}
              onToggleWatched={onToggleWatched}
              onEdit={onEdit}
            />
          ))}
        </ul>
        <div aria-hidden="true" className="sprockets hidden sm:block" />
      </div>
    </div>
  );
};
