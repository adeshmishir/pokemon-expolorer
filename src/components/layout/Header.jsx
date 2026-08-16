import { Link } from "react-router-dom";
import { Sun, Moon } from "lucide-react";
import useTheme from "../../hooks/useTheme";

export default function Header() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur dark:border-slate-700 dark:bg-slate-900/80">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-4">
        <Link to="/" className="flex items-center gap-3 transition-opacity hover:opacity-80">
          <span className="relative block h-8 w-8 overflow-hidden rounded-full border-2 border-pokeball-dark bg-white dark:border-slate-600">
            <span className="absolute inset-x-0 top-0 h-1/2 bg-pokeball-red" />
            <span className="absolute inset-x-0 top-1/2 h-0.5 bg-pokeball-dark dark:bg-slate-600" />
          </span>
          <span className="text-base font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-lg">
            Pokémon Explorer
          </span>
        </Link>

        <button
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700 focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
        >
          {theme === "dark" ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </button>
      </div>
    </header>
  );
}
