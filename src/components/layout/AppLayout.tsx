import { NavLink, Outlet } from "react-router";
import { DoomsdayCountdown } from "./DoomsdayCountdown";

const navItems = [
  { to: "/movies", label: "Movies" },
  { to: "/rewatch", label: "Rewatch Plan" },
  { to: "/booking", label: "Booking" },
];

const linkClass = ({ isActive }: { isActive: boolean }): string =>
  `-mb-px border-b-[3px] pb-3 text-base font-medium motion-safe:transition-colors ${
    isActive
      ? "border-brass text-ink"
      : "border-transparent text-ink-soft hover:text-ink"
  }`;

export const AppLayout = () => (
  <div className="min-h-screen">
    <a
      href="#main"
      className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-10 focus:rounded-md focus:bg-ink focus:px-4 focus:py-2 focus:text-pale"
    >
      Skip to content
    </a>
    <header className="border-b border-line">
      <div className="mx-auto max-w-6xl px-4 pt-6">
        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
          <h1 className="font-display text-3xl font-bold leading-none tracking-tight">
            Doomsday Ready
          </h1>
          <DoomsdayCountdown />
        </div>
        <nav aria-label="Main" className="mt-5 flex gap-6">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} className={linkClass}>
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
    <main
      id="main"
      tabIndex={-1}
      className="mx-auto max-w-6xl px-4 py-10 focus:outline-none"
    >
      <Outlet />
    </main>
  </div>
);
