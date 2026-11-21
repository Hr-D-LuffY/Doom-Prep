import type {
  CreateMovieInput,
  DeleteMovieResponse,
  Movie,
  UpdateMovieInput,
} from "../features/movies/movie.interface";
import type { RewatchPlan } from "../features/rewatch/rewatch.interface";
import { api } from "./client";

export const getMovies = (): Promise<Movie[]> => api.get<Movie[]>("/movies");

export const createMovie = (input: CreateMovieInput): Promise<Movie> =>
  api.post<Movie>("/movies", input);

export const updateMovie = (
  id: number,
  input: UpdateMovieInput,
): Promise<Movie> => api.patch<Movie>(`/movies/${id}`, input);

export const deleteMovie = (id: number): Promise<DeleteMovieResponse> =>
  api.delete<DeleteMovieResponse>(`/movies/${id}`);

export const getRewatchPlan = (id: number): Promise<RewatchPlan> =>
  api.get<RewatchPlan>(`/movies/${id}/rewatch-order`);
