import { Navigate, Route, Routes } from "react-router";
import { AppLayout } from "./components/layout/AppLayout";
import { BookingPage } from "./features/booking/BookingPage";
import { MoviesPage } from "./features/movies/MoviesPage";
import { RewatchPage } from "./features/rewatch/RewatchPage";
import { NotFoundPage } from "./pages/NotFoundPage";

export const App = () => (
  <Routes>
    <Route element={<AppLayout />}>
      <Route index element={<Navigate to="/movies" replace />} />
      <Route path="movies" element={<MoviesPage />} />
      <Route path="rewatch" element={<RewatchPage />} />
      <Route path="booking" element={<BookingPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Route>
  </Routes>
);
