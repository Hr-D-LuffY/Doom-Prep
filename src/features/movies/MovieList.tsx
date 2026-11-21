import { FilmStrip } from "../../components/ui/FilmStrip";
import { ProgressBar } from "../../components/ui/ProgressBar";
import { MovieFrame } from "./MovieFrame";
import type { Movie } from "./movie.interface";
import { EmptyState } from "../../components/ui/EmptyState";

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
      <EmptyState>No movies yet. Add the first one with the form.</EmptyState>
    );
  }

  const titleById = new Map(movies.map((movie) => [movie.id, movie.title]));
  const watchedCount = movies.filter((movie) => movie.watched).length;

  return (
    <div>
      <div className="mb-5">
        <p className="font-display text-3xl font-semibold leading-none">
          {watchedCount} of {movies.length} watched
        </p>
        <div className="mt-3">
          <ProgressBar
            value={watchedCount}
            max={movies.length}
            label="Movies watched"
          />
        </div>
      </div>

      <FilmStrip>
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
      </FilmStrip>
    </div>
  );
};
