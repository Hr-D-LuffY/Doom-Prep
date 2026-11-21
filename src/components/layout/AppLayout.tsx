import { NavLink, Outlet } from "react-router";

const navItems = [
  { to: "/movies", label: "Movies" },
  { to: "/rewatch", label: "Rewatch Plan" },
  { to: "/booking", label: "Booking" },
];

const linkClass = ({ isActive }: { isActive: boolean }): string =>
  `rounded-md px-3 py-2 text-sm font-medium transition-colors ${
    isActive
      ? "bg-red-600 text-white"
      : "text-slate-300 hover:bg-slate-800 hover:text-white"
  }`;

export const AppLayout = () => (
  <div className="min-h-screen bg-slate-950 text-slate-100">
    <header className="border-b border-slate-800 bg-slate-900">
      <div className="mx-auto flex max-w-5xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-lg font-bold tracking-tight">
          Doomsday <span className="text-red-500">Ready</span>
        </h1>
        <nav className="flex gap-1">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} className={linkClass}>
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
    <main className="mx-auto max-w-5xl px-4 py-8">
      <Outlet />
    </main>
  </div>
);
