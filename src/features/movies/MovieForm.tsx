import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { ApiError } from "../../api/client";
import { createMovie } from "../../api/movies.api";
import { Button } from "../../components/ui/Button";
import { ErrorMessage } from "../../components/ui/ErrorMessage";
import { inputClass } from "../../components/ui/fieldStyles";
import { FormField } from "../../components/ui/FormField";
import { getErrorMessage } from "../../utils/getErrorMessage";
import type { FieldErrors, Movie, MovieFormValues } from "./movie.interface";
import { validateMovieForm } from "./movie.validation";
import { PrerequisitePicker } from "./PrerequisitePicker";

interface MovieFormProps {
  movies: Movie[];
  onCreated: (movie: Movie) => void;
}

type TextField = "title" | "releaseYear" | "runtime";

const emptyValues: MovieFormValues = {
  title: "",
  releaseYear: "",
  runtime: "",
  prerequisites: [],
};

export const MovieForm = ({ movies, onCreated }: MovieFormProps) => {
  const [values, setValues] = useState<MovieFormValues>(emptyValues);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [addedTitle, setAddedTitle] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const clearFeedback = () => {
    setFormError(null);
    setAddedTitle(null);
  };

  const handleTextChange =
    (field: TextField) => (event: ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;
      setValues((current) => ({ ...current, [field]: value }));
      setErrors((current) => ({ ...current, [field]: undefined }));
      clearFeedback();
    };

  const handlePrerequisitesChange = (ids: number[]) => {
    setValues((current) => ({ ...current, prerequisites: ids }));
    clearFeedback();
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    clearFeedback();

    const result = validateMovieForm(values);
    setErrors(result.errors);
    if (result.input === null) return;

    setSubmitting(true);
    try {
      const created = await createMovie(result.input);
      onCreated(created);
      setValues(emptyValues);
      setAddedTitle(created.title);
    } catch (error) {
      if (error instanceof ApiError && error.code === "DUPLICATE_TITLE") {
        setErrors({ title: "A movie with this title already exists." });
      } else {
        setFormError(getErrorMessage(error));
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="space-y-5 rounded-lg border border-line bg-surface p-5"
    >
      <div>
        <h3 className="font-display text-2xl font-semibold leading-none">
          Add a movie
        </h3>
        <p className="mt-2 text-sm text-ink-soft">
          Movies under “Watch first” come before this one in your rewatch plan.
        </p>
      </div>

      {formError && <ErrorMessage message={formError} />}

      <FormField id="movie-title" label="Title" error={errors.title}>
        <input
          id="movie-title"
          type="text"
          value={values.title}
          onChange={handleTextChange("title")}
          disabled={submitting}
          autoComplete="off"
          aria-invalid={Boolean(errors.title)}
          aria-describedby={errors.title ? "movie-title-error" : undefined}
          className={inputClass(Boolean(errors.title))}
        />
      </FormField>

      <div className="grid grid-cols-2 gap-4">
        <FormField
          id="movie-year"
          label="Release year"
          error={errors.releaseYear}
        >
          <input
            id="movie-year"
            type="text"
            inputMode="numeric"
            value={values.releaseYear}
            onChange={handleTextChange("releaseYear")}
            disabled={submitting}
            placeholder="2008"
            autoComplete="off"
            aria-invalid={Boolean(errors.releaseYear)}
            aria-describedby={
              errors.releaseYear ? "movie-year-error" : undefined
            }
            className={inputClass(Boolean(errors.releaseYear))}
          />
        </FormField>
        <FormField
          id="movie-runtime"
          label="Runtime (min)"
          error={errors.runtime}
        >
          <input
            id="movie-runtime"
            type="text"
            inputMode="numeric"
            value={values.runtime}
            onChange={handleTextChange("runtime")}
            disabled={submitting}
            placeholder="126"
            autoComplete="off"
            aria-invalid={Boolean(errors.runtime)}
            aria-describedby={
              errors.runtime ? "movie-runtime-error" : undefined
            }
            className={inputClass(Boolean(errors.runtime))}
          />
        </FormField>
      </div>

      <PrerequisitePicker
        movies={movies}
        selectedIds={values.prerequisites}
        onChange={handlePrerequisitesChange}
        disabled={submitting}
      />

      <Button type="submit" disabled={submitting} className="w-full">
        {submitting ? "Adding..." : "Add movie"}
      </Button>

      <p role="status" className="min-h-5 text-sm text-reel">
        {addedTitle ? `Added “${addedTitle}”.` : ""}
      </p>
    </form>
  );
};
