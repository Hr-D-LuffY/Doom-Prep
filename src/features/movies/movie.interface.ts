export interface Movie {
  id: number;
  title: string;
  releaseYear: number;
  runtime: number;
  watched: boolean;
  prerequisites: number[];
}

export interface UpdateMovieInput {
  title?: string;
  releaseYear?: number;
  runtime?: number;
  watched?: boolean;
  prerequisites?: number[];
}

export interface CreateMovieInput {
  title: string;
  releaseYear: number;
  runtime: number;
  prerequisites: number[];
}

export interface MovieFormValues {
  title: string;
  releaseYear: string;
  runtime: string;
  prerequisites: number[];
}

export type FieldErrors = Partial<
  Record<"title" | "releaseYear" | "runtime", string>
>;

export interface FormValidationResult {
  errors: FieldErrors;
  input: CreateMovieInput | null;
}
