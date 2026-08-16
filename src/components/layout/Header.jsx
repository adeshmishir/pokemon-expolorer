import { Link, useLocation } from "react-router-dom";
import { Sun, Moon, Dices, Heart, Globe } from "lucide-react";
import useTheme from "../../hooks/useTheme";
import { cn } from "../../utils/cn";

const NAV_ITEMS = [
  { to: "/", label: "Pokédex", icon: Globe },
  { to: "/collection", label: "Favorites", icon: Heart },
  { to: "/battle-lab", label: "Battle Lab", icon: Dices },
];

export default function Header() {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--color-pokedex-border)] bg-[var(--color-pokedex-panel)]/80 backdrop-blur-md dark:border-[var(--color-pokedex-dark-border)] dark:bg-[var(--color-pokedex-dark-surface)]/80">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between gap-4 px-4">
        {/* Logo */}
        <Link
          to="/"
          className="group flex items-center gap-2.5 transition-opacity hover:opacity-80"
        >
          {/* Poké Ball icon */}
          <span className="relative flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-[var(--color-pokedex-text)] transition-transform group-hover:scale-110 dark:border-[var(--color-pokedex-dark-text)]">
            <span className="absolute inset-x-0 top-0 h-1/2 bg-[var(--color-pokeball-red)]" />
            <span className="absolute inset-x-0 top-1/2 h-[2px] bg-[var(--color-pokedex-text)] dark:bg-[var(--color-pokedex-dark-text)]" />
            <span className="absolute inset-0 m-auto h-2 w-2 rounded-full border-2 border-[var(--color-pokedex-text)] bg-[var(--color-pokedex-panel)] dark:border-[var(--color-pokedex-dark-text)] dark:bg-[var(--color-pokedex-dark-surface)]" />
          </span>
          <span className="text-sm font-extrabold tracking-[0.2em] text-[var(--color-pokedex-text)] dark:text-[var(--color-pokedex-dark-text)]">
            POKEDEX
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-1 sm:flex" aria-label="Main navigation">
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => {
            const isActive = location.pathname === to;
            return (
              <Link
                key={to}
                to={to}
                className={cn(
                  "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-all duration-150",
                  isActive
                    ? "bg-[var(--color-pokeball-red)]/10 text-[var(--color-pokeball-red)] dark:bg-[var(--color-pokeball-red)]/15 dark:text-red-400"
                    : "text-[var(--color-pokedex-muted)] hover:bg-[var(--color-pokedex-border)]/50 hover:text-[var(--color-pokedex-text)] dark:text-[var(--color-pokedex-dark-muted)] dark:hover:bg-[var(--color-pokedex-dark-border)]/50 dark:hover:text-[var(--color-pokedex-dark-text)]"
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          className="relative rounded-lg p-2 text-[var(--color-pokedex-muted)] transition-colors hover:bg-[var(--color-pokedex-border)]/50 hover:text-[var(--color-pokedex-text)] focus-visible:ring-2 focus-visible:ring-[var(--color-pokeball-red)]/50 focus-visible:ring-offset-2 dark:text-[var(--color-pokedex-dark-muted)] dark:hover:bg-[var(--color-pokedex-dark-border)]/50 dark:hover:text-[var(--color-pokedex-dark-text)]"
        >
          <span className="relative block h-5 w-5">
            <Sun
              className={cn(
                "absolute inset-0 h-5 w-5 transition-all duration-300",
                theme === "dark"
                  ? "rotate-0 scale-100 opacity-100"
                  : "rotate-90 scale-0 opacity-0"
              )}
            />
            <Moon
              className={cn(
                "absolute inset-0 h-5 w-5 transition-all duration-300",
                theme === "dark"
                  ? "-rotate-90 scale-0 opacity-0"
                  : "rotate-0 scale-100 opacity-100"
              )}
            />
          </span>
        </button>
      </div>

      {/* Mobile bottom nav */}
      <nav
        className="fixed bottom-0 inset-x-0 z-50 flex border-t border-[var(--color-pokedex-border)] bg-[var(--color-pokedex-panel)]/95 backdrop-blur-md sm:hidden dark:border-[var(--color-pokedex-dark-border)] dark:bg-[var(--color-pokedex-dark-surface)]/95"
        aria-label="Mobile navigation"
      >
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => {
          const isActive = location.pathname === to;
          return (
            <Link
              key={to}
              to={to}
              className={cn(
                "flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[10px] font-bold uppercase tracking-wider transition-colors",
                isActive
                  ? "text-[var(--color-pokeball-red)]"
                  : "text-[var(--color-pokedex-muted)] dark:text-[var(--color-pokedex-dark-muted)]"
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
