import { Link } from "react-router-dom";
import { Sun, Moon, Dices, Heart } from "lucide-react";
import useTheme from "../../hooks/useTheme";
import { cn } from "../../utils/cn";

export default function Header() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--color-pokedex-border)] bg-[var(--color-pokedex-panel)]/80 backdrop-blur-md dark:border-[var(--color-pokedex-dark-border)] dark:bg-[var(--color-pokedex-dark-surface)]/80">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between gap-4 px-4">
        <Link
          to="/"
          className="group flex items-center gap-2.5 transition-opacity hover:opacity-80"
        >
          <span className="relative flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-[var(--color-pokedex-text)] dark:border-[var(--color-pokedex-dark-text)]">
            <span className="absolute inset-x-0 top-0 h-1/2 bg-[var(--color-pokeball-red)]" />
            <span className="absolute inset-x-0 top-1/2 h-[2px] bg-[var(--color-pokedex-text)] dark:bg-[var(--color-pokedex-dark-text)]" />
            <span className="absolute inset-0 m-auto h-2 w-2 rounded-full border-2 border-[var(--color-pokedex-text)] bg-[var(--color-pokedex-panel)] dark:border-[var(--color-pokedex-dark-text)] dark:bg-[var(--color-pokedex-dark-surface)]" />
          </span>
          <span className="text-sm font-extrabold tracking-[0.2em] text-[var(--color-pokedex-text)] dark:text-[var(--color-pokedex-dark-text)]">
            POKEDEX
          </span>
        </Link>

        <nav className="hidden items-center gap-1 sm:flex" aria-label="Main navigation">
          <Link
            to="/"
            className={cn(
              "rounded-md px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors",
              "text-[var(--color-pokedex-muted)] hover:bg-[var(--color-pokedex-border)]/50 hover:text-[var(--color-pokedex-text)]",
              "dark:text-[var(--color-pokedex-dark-muted)] dark:hover:bg-[var(--color-pokedex-dark-border)]/50 dark:hover:text-[var(--color-pokedex-dark-text)]"
            )}
          >
            Pokédex
          </Link>
          <Link
            to="/collection"
            className={cn(
              "flex items-center gap-1 rounded-md px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors",
              "text-[var(--color-pokedex-muted)] hover:bg-[var(--color-pokedex-border)]/50 hover:text-[var(--color-pokedex-text)]",
              "dark:text-[var(--color-pokedex-dark-muted)] dark:hover:bg-[var(--color-pokedex-dark-border)]/50 dark:hover:text-[var(--color-pokedex-dark-text)]"
            )}
          >
            <Heart className="h-3 w-3" />
            Favorites
          </Link>
          <Link
            to="/battle-lab"
            className={cn(
              "flex items-center gap-1 rounded-md px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors",
              "text-[var(--color-pokedex-muted)] hover:bg-[var(--color-pokedex-border)]/50 hover:text-[var(--color-pokedex-text)]",
              "dark:text-[var(--color-pokedex-dark-muted)] dark:hover:bg-[var(--color-pokedex-dark-border)]/50 dark:hover:text-[var(--color-pokedex-dark-text)]"
            )}
          >
            <Dices className="h-3 w-3" />
            Battle Lab
          </Link>
        </nav>

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
    </header>
  );
}
