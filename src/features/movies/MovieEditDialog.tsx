import { useEffect, useId, useRef, useState } from "react";
import { ApiError } from "../../api/client";
import { deleteMovie, updateMovie } from "../../api/movies.api";
import { Button } from "../../components/ui/Button";
import { ErrorMessage } from "../../components/ui/ErrorMessage";
import { getErrorMessage } from "../../utils/getErrorMessage";
import type { Movie } from "./movie.interface";
import { PrerequisitePicker } from "./PrerequisitePicker";

interface MovieEditDialogProps {
  movie: Movie;
  movies: Movie[];
  onClose: () => void;
  onSaved: (movie: Movie) => void;
  onDeleted: (id: number) => void;
}

const hasSameIds = (a: number[], b: number[]): boolean =>
  a.length === b.length && a.every((id) => b.includes(id));

const getCircularMessage = (title: string): string =>
  `One of the movies you picked already needs “${title}”, directly or through other movies, so it cannot also come before it. Remove it from the list and try again.`;

const getDeleteWarning = (dependentsCount: number): string => {
  if (dependentsCount === 0) {
    return "This removes the movie from your list. It cannot be undone.";
  }
  const who =
    dependentsCount === 1
      ? "1 other movie lists"
      : `${dependentsCount} other movies list`;
  return `${who} it as a prerequisite and will lose it. This cannot be undone.`;
};

export const MovieEditDialog = ({
  movie,
  movies,
  onClose,
  onSaved,
  onDeleted,
}: MovieEditDialogProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  const [selectedIds, setSelectedIds] = useState<number[]>(movie.prerequisites);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const busy = saving || deleting;
  const hasChanged = !hasSameIds(selectedIds, movie.prerequisites);
  const otherMovies = movies.filter((item) => item.id !== movie.id);
  const dependentsCount = movies.filter((item) =>
    item.prerequisites.includes(movie.id),
  ).length;

  // open as a modal as soon as the dialog is on the page
  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) {
      dialog.showModal();
    }
  }, []);

  const handleSave = async () => {
    setError(null);
    setSaving(true);
    try {
      const updated = await updateMovie(movie.id, {
        prerequisites: selectedIds,
      });
      onSaved(updated);
      onClose();
    } catch (err) {
      // the server saves nothing on an error, so the list on screen stays correct
      setError(
        err instanceof ApiError && err.code === "CIRCULAR_DEPENDENCY"
          ? getCircularMessage(movie.title)
          : getErrorMessage(err),
      );
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setError(null);
    setDeleting(true);
    try {
      await deleteMovie(movie.id);
      onDeleted(movie.id);
      onClose();
    } catch (err) {
      setError(getErrorMessage(err));
      setDeleting(false);
    }
  };

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      onClose={onClose}
      onCancel={(event) => {
        // ignore Esc while a request is running
        if (busy) event.preventDefault();
      }}
      onClick={(event) => {
        // a click on the dialog element itself is a click on the backdrop
        if (event.target === event.currentTarget && !busy) onClose();
      }}
      className="m-auto max-h-[calc(100dvh-2rem)] w-[min(34rem,calc(100%-2rem))] overflow-y-auto rounded-lg border border-line bg-surface p-0 text-ink shadow-xl backdrop:bg-ink/60"
    >
      <div className="p-5 sm:p-6">
        {confirmingDelete ? (
          <>
            <h3
              id={titleId}
              className="font-display text-2xl font-semibold leading-none"
            >
              Delete {movie.title}?
            </h3>
            <p className="mt-3 text-sm text-ink-soft">
              {getDeleteWarning(dependentsCount)}
            </p>

            {error && (
              <div className="mt-4">
                <ErrorMessage message={error} />
              </div>
            )}

            <div className="mt-6 flex justify-end gap-3">
              <Button
                variant="ghost"
                onClick={() => {
                  setError(null);
                  setConfirmingDelete(false);
                }}
                disabled={deleting}
              >
                Keep movie
              </Button>
              <Button
                variant="danger"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? "Deleting..." : "Delete movie"}
              </Button>
            </div>
          </>
        ) : (
          <>
            <h3
              id={titleId}
              className="font-display text-2xl font-semibold leading-none"
            >
              Edit {movie.title}
            </h3>
            <p className="mt-3 text-sm text-ink-soft">
              Choose the movies to watch first. Saving replaces the current
              list.
            </p>

            <div className="mt-5">
              <PrerequisitePicker
                movies={otherMovies}
                selectedIds={selectedIds}
                onChange={(ids) => {
                  setError(null);
                  setSelectedIds(ids);
                }}
                disabled={busy}
              />
            </div>

            {error && (
              <div className="mt-4">
                <ErrorMessage message={error} />
              </div>
            )}

            <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
              <Button
                variant="dangerOutline"
                onClick={() => {
                  setError(null);
                  setConfirmingDelete(true);
                }}
                disabled={busy}
              >
                Delete movie
              </Button>
              <div className="flex gap-3">
                <Button variant="ghost" onClick={onClose} disabled={busy}>
                  Cancel
                </Button>
                <Button onClick={handleSave} disabled={busy || !hasChanged}>
                  {saving ? "Saving..." : "Save changes"}
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </dialog>
  );
};
