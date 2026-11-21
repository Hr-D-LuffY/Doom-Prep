import type {
  CreateMovieInput,
  Movie,
  UpdateMovieInput,
} from "../features/movies/movie.interface";
import { api } from "./client";

export const getMovies = (): Promise<Movie[]> => api.get<Movie[]>("/movies");

export const createMovie = (input: CreateMovieInput): Promise<Movie> =>
  api.post<Movie>("/movies", input);

export const updateMovie = (
  id: number,
  input: UpdateMovieInput,
): Promise<Movie> => api.patch<Movie>(`/movies/${id}`, input);
