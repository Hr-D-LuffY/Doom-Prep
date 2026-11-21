import { Link } from "react-router";

export const NotFoundPage = () => (
  <section className="py-20">
    <p className="font-display text-7xl font-bold leading-none">404</p>
    <p className="mt-3 text-ink-soft">This page does not exist.</p>
    <Link
      to="/movies"
      className="mt-6 inline-block font-semibold underline underline-offset-4"
    >
      Back to movies
    </Link>
  </section>
);
