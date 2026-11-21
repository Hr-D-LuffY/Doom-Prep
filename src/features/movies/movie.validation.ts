import type { FormValidationResult, MovieFormValues } from "./movie.interface";

const MIN_RELEASE_YEAR = 1900;
const MAX_RELEASE_YEAR = 2100;
const MIN_RUNTIME = 1;
const MAX_RUNTIME = 300;
const MAX_TITLE_LENGTH = 200;

const parseWholeNumber = (raw: string): number | null => {
  const text = raw.trim();
  return /^\d+$/.test(text) ? Number(text) : null;
};

export const validateMovieForm = (
  values: MovieFormValues,
): FormValidationResult => {
  const errors: FormValidationResult["errors"] = {};

  const title = values.title.trim();
  if (title.length === 0) {
    errors.title = "Enter a title.";
  } else if (title.length > MAX_TITLE_LENGTH) {
    errors.title = `Keep the title under ${MAX_TITLE_LENGTH} characters.`;
  }

  const releaseYear = parseWholeNumber(values.releaseYear);
  if (
    releaseYear === null ||
    releaseYear < MIN_RELEASE_YEAR ||
    releaseYear > MAX_RELEASE_YEAR
  ) {
    errors.releaseYear = `Enter a year from ${MIN_RELEASE_YEAR} to ${MAX_RELEASE_YEAR}.`;
  }

  const runtime = parseWholeNumber(values.runtime);
  if (runtime === null || runtime < MIN_RUNTIME || runtime > MAX_RUNTIME) {
    errors.runtime = `Enter minutes from ${MIN_RUNTIME} to ${MAX_RUNTIME}.`;
  }

  if (
    Object.keys(errors).length > 0 ||
    releaseYear === null ||
    runtime === null
  ) {
    return { errors, input: null };
  }

  return {
    errors,
    input: { title, releaseYear, runtime, prerequisites: values.prerequisites },
  };
};
