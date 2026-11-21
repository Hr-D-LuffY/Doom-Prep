import { useState } from "react";
import { getMovies, updateMovie } from "../../api/movies.api";
import { ErrorMessage } from "../../components/ui/ErrorMessage";
import { PageHeader } from "../../components/ui/PageHeader";
import { Spinner } from "../../components/ui/Spinner";
import { useAsync } from "../../hooks/useAsync";
import { getErrorMessage } from "../../utils/getErrorMessage";
import { MovieEditDialog } from "./MovieEditDialog";
import { MovieForm } from "./MovieForm";
import { MovieList } from "./MovieList";
import type { Movie } from "./movie.interface";

export const MoviesPage = () => {
  const { data: movies, error, loading, reload, update } = useAsync(getMovies);
  const [pendingIds, setPendingIds] = useState<number[]>([]);
  const [actionError, setActionError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);

  const editingMovie = movies?.find((movie) => movie.id === editingId) ?? null;

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

  const handleCreated = (movie: Movie) => {
    update((current) => [...current, movie]);
  };

  const handleSaved = (saved: Movie) => {
    update((current) =>
      current.map((item) => (item.id === saved.id ? saved : item)),
    );
  };

  // the backend also removes the deleted movie from other movies' prerequisite lists
  const handleDeleted = (id: number) => {
    update((current) =>
      current
        .filter((item) => item.id !== id)
        .map((item) => ({
          ...item,
          prerequisites: item.prerequisites.filter(
            (prerequisiteId) => prerequisiteId !== id,
          ),
        })),
    );
  };

  const renderList = () => {
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
        onEdit={(movie) => setEditingId(movie.id)}
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
        <div className="mb-5">
          <ErrorMessage message={actionError} />
        </div>
      )}
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start">
        <div>{renderList()}</div>
        {movies !== null && (
          <aside className="lg:sticky lg:top-6">
            <MovieForm movies={movies} onCreated={handleCreated} />
          </aside>
        )}
      </div>

      {movies !== null && editingMovie && (
        <MovieEditDialog
          key={editingMovie.id}
          movie={editingMovie}
          movies={movies}
          onClose={() => setEditingId(null)}
          onSaved={handleSaved}
          onDeleted={handleDeleted}
        />
      )}
    </section>
  );
};
