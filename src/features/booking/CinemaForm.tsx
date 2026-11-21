import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { ApiError } from "../../api/client";
import { createCinema } from "../../api/cinemas.api";
import { Button } from "../../components/ui/Button";
import { ErrorMessage } from "../../components/ui/ErrorMessage";
import { inputClass } from "../../components/ui/fieldStyles";
import { FormField } from "../../components/ui/FormField";
import { getErrorMessage } from "../../utils/getErrorMessage";
import type {
  Cinema,
  CinemaFieldErrors,
  CinemaFormValues,
} from "./cinema.interface";
import { validateCinemaForm } from "./cinema.validation";

interface CinemaFormProps {
  onCreated: (cinema: Cinema) => void;
}

type CinemaField = "name" | "bundleSizes";

const emptyValues: CinemaFormValues = { name: "", bundleSizes: "" };

export const CinemaForm = ({ onCreated }: CinemaFormProps) => {
  const [values, setValues] = useState<CinemaFormValues>(emptyValues);
  const [errors, setErrors] = useState<CinemaFieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [addedName, setAddedName] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const clearFeedback = () => {
    setFormError(null);
    setAddedName(null);
  };

  const handleChange =
    (field: CinemaField) => (event: ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;
      setValues((current) => ({ ...current, [field]: value }));
      setErrors((current) => ({ ...current, [field]: undefined }));
      clearFeedback();
    };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    clearFeedback();

    const result = validateCinemaForm(values);
    setErrors(result.errors);
    if (result.input === null) return;

    setSubmitting(true);
    try {
      const created = await createCinema(result.input);
      onCreated(created);
      setValues(emptyValues);
      setAddedName(created.name);
    } catch (error) {
      if (error instanceof ApiError && error.code === "DUPLICATE_NAME") {
        setErrors({ name: "A cinema with this name already exists." });
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
          Add a cinema
        </h3>
        <p className="mt-2 text-sm text-ink-soft">
          Cinemas sell opening-night seats in fixed bundles. Add the bundle
          sizes your cinema offers.
        </p>
      </div>

      {formError && <ErrorMessage message={formError} />}

      <FormField id="cinema-name" label="Cinema name" error={errors.name}>
        <input
          id="cinema-name"
          type="text"
          value={values.name}
          onChange={handleChange("name")}
          disabled={submitting}
          autoComplete="off"
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? "cinema-name-error" : undefined}
          className={inputClass(Boolean(errors.name))}
        />
      </FormField>

      <FormField
        id="cinema-sizes"
        label="Bundle sizes (seats)"
        hint="Separate sizes with commas. Up to 10 sizes, each from 1 to 500."
        error={errors.bundleSizes}
      >
        <input
          id="cinema-sizes"
          type="text"
          value={values.bundleSizes}
          onChange={handleChange("bundleSizes")}
          disabled={submitting}
          placeholder="2, 5"
          autoComplete="off"
          aria-invalid={Boolean(errors.bundleSizes)}
          aria-describedby={
            errors.bundleSizes ? "cinema-sizes-error" : "cinema-sizes-hint"
          }
          className={inputClass(Boolean(errors.bundleSizes))}
        />
      </FormField>

      <Button type="submit" disabled={submitting} className="w-full">
        {submitting ? "Adding..." : "Add cinema"}
      </Button>

      <p role="status" className="min-h-5 text-sm text-reel">
        {addedName ? `Added “${addedName}”.` : ""}
      </p>
    </form>
  );
};
