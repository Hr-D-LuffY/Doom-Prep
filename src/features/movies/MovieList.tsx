import type { Movie } from "./movie.interface";

interface MovieListProps {
  movies: Movie[];
  pendingIds: number[];
  onToggleWatched: (movie: Movie) => void;
}

export const MovieList = ({
  movies,
  pendingIds,
  onToggleWatched,
}: MovieListProps) => {
  if (movies.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-slate-700 px-4 py-10 text-center text-sm text-slate-400">
        No movies yet.
      </p>
    );
  }

  const titleById = new Map(movies.map((movie) => [movie.id, movie.title]));
  const watchedCount = movies.filter((movie) => movie.watched).length;

  return (
    <div>
      <p className="mb-3 text-sm text-slate-400">
        {watchedCount} of {movies.length} watched
      </p>
      <ul className="divide-y divide-slate-800 overflow-hidden rounded-lg border border-slate-800 bg-slate-900">
        {movies.map((movie) => {
          const isPending = pendingIds.includes(movie.id);
          const prerequisiteTitles = movie.prerequisites.map(
            (id) => titleById.get(id) ?? `Movie #${id}`,
          );

          return (
            <li key={movie.id} className="flex items-start gap-4 px-4 py-3">
              <input
                type="checkbox"
                id={`watched-${movie.id}`}
                checked={movie.watched}
                disabled={isPending}
                onChange={() => onToggleWatched(movie)}
                className="mt-1 h-4 w-4 shrink-0 accent-red-600"
              />
              <div className="min-w-0 flex-1">
                <label
                  htmlFor={`watched-${movie.id}`}
                  className={`font-medium ${movie.watched ? "text-slate-400" : "text-slate-100"}`}
                >
                  {movie.title}
                </label>
                <p className="mt-0.5 text-xs text-slate-400">
                  {movie.releaseYear} · {movie.runtime} min
                </p>
                {prerequisiteTitles.length > 0 && (
                  <p className="mt-1 text-xs text-slate-500">
                    Watch first: {prerequisiteTitles.join(", ")}
                  </p>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
