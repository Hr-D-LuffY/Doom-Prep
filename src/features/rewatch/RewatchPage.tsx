import { useState } from "react";
import { Link } from "react-router";
import { getMovies } from "../../api/movies.api";
import { ErrorMessage } from "../../components/ui/ErrorMessage";
import { inputClass } from "../../components/ui/fieldStyles";
import { PageHeader } from "../../components/ui/PageHeader";
import { Spinner } from "../../components/ui/Spinner";
import { useAsync } from "../../hooks/useAsync";
import type { Movie } from "../movies/movie.interface";
import { RewatchPlanView } from "./RewatchPlanView";
import { EmptyState } from "../../components/ui/EmptyState";
const DEFAULT_TARGET_TITLE = "Avengers: Doomsday";

const getDefaultTargetId = (movies: Movie[]): number | null => {
  const doomsday = movies.find((movie) => movie.title === DEFAULT_TARGET_TITLE);
  return doomsday?.id ?? movies.at(-1)?.id ?? null;
};

export const RewatchPage = () => {
  const { data: movies, error, loading, reload } = useAsync(getMovies);
  const [selectedId, setSelectedId] = useState<number | null>(null);

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

    const targetId = selectedId ?? getDefaultTargetId(movies);
    if (targetId === null) {
      return (
        <EmptyState>
          You have no movies yet.{" "}
          <Link
            to="/movies"
            className="font-semibold text-ink underline underline-offset-4"
          >
            Add some on the Movies page
          </Link>{" "}
          to build a plan.
        </EmptyState>
      );
    }

    const sortedMovies = [...movies].sort(
      (a, b) => a.releaseYear - b.releaseYear || a.title.localeCompare(b.title),
    );

    return (
      <>
        <div className="mb-8 max-w-md">
          <label
            htmlFor="rewatch-target"
            className="mb-1.5 block text-sm font-semibold"
          >
            Movie you are preparing for
          </label>
          <select
            id="rewatch-target"
            value={targetId}
            onChange={(event) => setSelectedId(Number(event.target.value))}
            className={inputClass(false)}
          >
            {sortedMovies.map((movie) => (
              <option key={movie.id} value={movie.id}>
                {movie.title} ({movie.releaseYear})
              </option>
            ))}
          </select>
        </div>

        <div className="max-w-3xl">
          <RewatchPlanView key={targetId} targetId={targetId} />
        </div>
      </>
    );
  };

  return (
    <section>
      <PageHeader
        title="Rewatch Plan"
        description="Pick the movie you are preparing for and see what to watch first, in order."
      />
      {renderContent()}
    </section>
  );
};
