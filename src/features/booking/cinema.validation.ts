import type {
  CinemaFieldErrors,
  CinemaFormValidationResult,
  CinemaFormValues,
  GroupSizeValidationResult,
} from "./cinema.interface";

const MAX_NAME_LENGTH = 100;
const MAX_BUNDLE_TYPES = 10;
const MIN_BUNDLE_SIZE = 1;
const MAX_BUNDLE_SIZE = 500;
const MIN_GROUP_SIZE = 1;
const MAX_GROUP_SIZE = 10000;

interface ParsedSizes {
  sizes: number[] | null;
  error?: string;
}

const parseBundleSizes = (raw: string): ParsedSizes => {
  const tokens = raw.split(/[\s,]+/).filter((token) => token.length > 0);

  if (tokens.length === 0) {
    return { sizes: null, error: "Enter at least one bundle size, like 2, 5." };
  }
  if (tokens.some((token) => !/^\d+$/.test(token))) {
    return {
      sizes: null,
      error: "Use whole numbers separated by commas, like 2, 5, 10.",
    };
  }

  const sizes = tokens.map(Number);
  if (sizes.some((size) => size < MIN_BUNDLE_SIZE || size > MAX_BUNDLE_SIZE)) {
    return {
      sizes: null,
      error: `Each size must be from ${MIN_BUNDLE_SIZE} to ${MAX_BUNDLE_SIZE}.`,
    };
  }
  if (new Set(sizes).size !== sizes.length) {
    return { sizes: null, error: "Each size can appear only once." };
  }
  if (sizes.length > MAX_BUNDLE_TYPES) {
    return {
      sizes: null,
      error: `A cinema can sell up to ${MAX_BUNDLE_TYPES} different sizes.`,
    };
  }
  return { sizes };
};

export const validateCinemaForm = (
  values: CinemaFormValues,
): CinemaFormValidationResult => {
  const errors: CinemaFieldErrors = {};

  const name = values.name.trim();
  if (name.length === 0) {
    errors.name = "Enter the cinema name.";
  } else if (name.length > MAX_NAME_LENGTH) {
    errors.name = `Keep the name under ${MAX_NAME_LENGTH} characters.`;
  }

  const parsed = parseBundleSizes(values.bundleSizes);
  if (parsed.error) {
    errors.bundleSizes = parsed.error;
  }

  if (Object.keys(errors).length > 0 || parsed.sizes === null) {
    return { errors, input: null };
  }
  return { errors, input: { name, bundleSizes: parsed.sizes } };
};

export const validateGroupSize = (raw: string): GroupSizeValidationResult => {
  const message = `Enter the number of people, from ${MIN_GROUP_SIZE} to ${MAX_GROUP_SIZE.toLocaleString("en-US")}.`;
  const text = raw.trim();

  if (!/^\d+$/.test(text)) {
    return { value: null, error: message };
  }
  const value = Number(text);
  if (value < MIN_GROUP_SIZE || value > MAX_GROUP_SIZE) {
    return { value: null, error: message };
  }
  return { value };
};
