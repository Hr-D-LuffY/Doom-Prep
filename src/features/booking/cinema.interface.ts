export interface Cinema {
  id: number;
  name: string;
  bundleSizes: number[];
}

export interface CreateCinemaInput {
  name: string;
  bundleSizes: number[];
}

export interface BookingItem {
  size: number;
  count: number;
}

export interface BookingPossible {
  possible: true;
  groupSize: number;
  totalBundles: number;
  breakdown: BookingItem[];
}

export interface BookingImpossible {
  possible: false;
  groupSize: number;
}

export type BookingQuote = BookingPossible | BookingImpossible;

export interface CinemaFormValues {
  name: string;
  bundleSizes: string;
}

export type CinemaFieldErrors = Partial<Record<"name" | "bundleSizes", string>>;

export interface CinemaFormValidationResult {
  errors: CinemaFieldErrors;
  input: CreateCinemaInput | null;
}

export interface GroupSizeValidationResult {
  value: number | null;
  error?: string;
}
