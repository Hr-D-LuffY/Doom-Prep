import { useId, useState } from "react";
import type { Movie } from "./movie.interface";

interface PrerequisitePickerProps {
  movies: Movie[];
  selectedIds: number[];
  onChange: (ids: number[]) => void;
  disabled?: boolean;
}

export const PrerequisitePicker = ({
  movies,
  selectedIds,
  onChange,
  disabled = false,
}: PrerequisitePickerProps) => {
  const [query, setQuery] = useState("");
  const searchId = useId();

  const movieById = new Map(movies.map((movie) => [movie.id, movie]));
  const selectedMovies = selectedIds.flatMap((id) => {
    const movie = movieById.get(id);
    return movie ? [movie] : [];
  });

  const search = query.trim().toLowerCase();
  const visibleMovies =
    search === ""
      ? movies
      : movies.filter((movie) => movie.title.toLowerCase().includes(search));

  const toggle = (id: number) => {
    onChange(
      selectedIds.includes(id)
        ? selectedIds.filter((item) => item !== id)
        : [...selectedIds, id],
    );
  };

  return (
    <fieldset disabled={disabled} className="min-w-0">
      <legend className="mb-1.5 text-sm font-semibold">
        Watch first (optional)
      </legend>

      {selectedMovies.length > 0 && (
        <ul
          aria-label="Selected prerequisites"
          className="mb-2 flex flex-wrap gap-1.5"
        >
          {selectedMovies.map((movie) => (
            <li key={movie.id}>
              <button
                type="button"
                onClick={() => toggle(movie.id)}
                aria-label={`Remove ${movie.title}`}
                className="inline-flex items-center gap-1.5 rounded-full bg-reel py-1 pl-3 pr-2 text-xs font-medium text-pale hover:bg-reel-deep"
              >
                {movie.title}
                <span aria-hidden="true" className="text-base leading-none">
                  ×
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}

      {movies.length === 0 ? (
        <p className="rounded-md border border-dashed border-edge px-3 py-4 text-sm text-ink-soft">
          Add a movie first, then you can pick it here.
        </p>
      ) : (
        <div className="overflow-hidden rounded-md border border-edge bg-surface">
          <label htmlFor={searchId} className="sr-only">
            Search movies
          </label>
          <input
            id={searchId}
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search movies"
            autoComplete="off"
            className="w-full border-b border-line bg-transparent px-3 py-2 text-sm placeholder:text-ink-soft/70"
          />
          {visibleMovies.length === 0 ? (
            <p className="px-3 py-4 text-sm text-ink-soft">
              No movies match “{query.trim()}”.
            </p>
          ) : (
            <ul className="max-h-52 overflow-y-auto">
              {visibleMovies.map((movie) => (
                <li key={movie.id}>
                  <label className="flex cursor-pointer items-center gap-3 px-3 py-2 text-sm hover:bg-paper">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(movie.id)}
                      onChange={() => toggle(movie.id)}
                      className="h-4 w-4 shrink-0 accent-reel"
                    />
                    <span className="min-w-0 flex-1 truncate">
                      {movie.title}
                    </span>
                    <span className="text-xs tabular-nums text-ink-soft">
                      {movie.releaseYear}
                    </span>
                  </label>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </fieldset>
  );
};
