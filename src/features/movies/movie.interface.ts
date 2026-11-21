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
