import { Link } from "react-router";

export const NotFoundPage = () => (
  <section className="py-16 text-center">
    <p className="text-5xl font-bold text-red-500">404</p>
    <p className="mt-2 text-slate-400">This page does not exist.</p>
    <Link
      to="/movies"
      className="mt-6 inline-block text-sm font-medium text-red-400 hover:text-red-300"
    >
      Back to movies
    </Link>
  </section>
);
