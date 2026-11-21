import { useState } from "react";
import { getMovies, updateMovie } from "../../api/movies.api";
import { ErrorMessage } from "../../components/ui/ErrorMessage";
import { PageHeader } from "../../components/ui/PageHeader";
import { Spinner } from "../../components/ui/Spinner";
import { useAsync } from "../../hooks/useAsync";
import { getErrorMessage } from "../../utils/getErrorMessage";
import { MovieList } from "./MovieList";
import type { Movie } from "./movie.interface";

export const MoviesPage = () => {
  const { data: movies, error, loading, reload, update } = useAsync(getMovies);
  const [pendingIds, setPendingIds] = useState<number[]>([]);
  const [actionError, setActionError] = useState<string | null>(null);

  const handleToggleWatched = async (movie: Movie) => {
    setActionError(null);
    setPendingIds((ids) => [...ids, movie.id]);
    try {
      const updated = await updateMovie(movie.id, { watched: !movie.watched });
      update((current) =>
        current.map((item) => (item.id === updated.id ? updated : item)),
      );
    } catch (err) {
      setActionError(getErrorMessage(err));
    } finally {
      setPendingIds((ids) => ids.filter((id) => id !== movie.id));
    }
  };

  const renderContent = () => {
    if (movies === null) {
      return loading ? (
        <Spinner label="Loading movies..." />
      ) : (
        <ErrorMessage
          message={error ?? "Could not load movies"}
          onRetry={reload}
        />
      );
    }
    return (
      <MovieList
        movies={movies}
        pendingIds={pendingIds}
        onToggleWatched={handleToggleWatched}
      />
    );
  };

  return (
    <section>
      <PageHeader
        title="Movies"
        description="Add movies, edit their prerequisites and tick them as watched."
      />
      {actionError && (
        <div className="mb-4">
          <ErrorMessage message={actionError} />
        </div>
      )}
      {renderContent()}
    </section>
  );
};
