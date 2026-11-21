import type {
  BookingQuote,
  Cinema,
  CreateCinemaInput,
} from "../features/booking/cinema.interface";
import { api } from "./client";

export const getCinemas = (): Promise<Cinema[]> =>
  api.get<Cinema[]>("/cinemas");

export const createCinema = (input: CreateCinemaInput): Promise<Cinema> =>
  api.post<Cinema>("/cinemas", input);

export const getBookingQuote = (
  cinemaId: number,
  groupSize: number,
): Promise<BookingQuote> =>
  api.get<BookingQuote>(`/cinemas/${cinemaId}/booking?groupSize=${groupSize}`);
