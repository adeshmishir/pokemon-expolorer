import { useCallback } from "react";
import { Search, X } from "lucide-react";

export default function SearchBar({ value, onChange, onSubmit, onClear }) {
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Escape" && value) {
        onClear();
      }
    },
    [value, onClear]
  );

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit();
  }

  return (
    <form onSubmit={handleSubmit} role="search" aria-label="Search Pokémon" className="w-full max-w-lg mx-auto mb-8">
      <div className="flex items-center gap-2 rounded-lg border border-[var(--color-pokedex-border)] bg-[var(--color-pokedex-panel)] px-4 py-2.5 transition-all focus-within:border-[var(--color-pokeball-red)]/40 focus-within:shadow-[0_0_0_3px_rgba(220,38,38,0.08)] dark:border-[var(--color-pokedex-dark-border)] dark:bg-[var(--color-pokedex-dark-panel)] dark:focus-within:border-[var(--color-pokeball-red)]/30 dark:focus-within:shadow-[0_0_0_3px_rgba(220,38,38,0.12)]">
        <Search className="h-4 w-4 shrink-0 text-[var(--color-pokedex-subtle)] dark:text-[var(--color-pokedex-dark-muted)]" />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search Pokémon by name..."
          aria-label="Search Pokémon by name"
          className="flex-1 bg-transparent text-sm text-[var(--color-pokedex-text)] placeholder-[var(--color-pokedex-subtle)] outline-none dark:text-[var(--color-pokedex-dark-text)] dark:placeholder-[var(--color-pokedex-dark-muted)]"
        />
        {value && (
          <button
            type="button"
            onClick={onClear}
            aria-label="Clear search"
            className="rounded-md p-1 text-[var(--color-pokedex-subtle)] transition-colors hover:bg-[var(--color-pokedex-border)]/50 hover:text-[var(--color-pokedex-text)] focus-visible:ring-2 focus-visible:ring-[var(--color-pokeball-red)]/50 dark:text-[var(--color-pokedex-dark-muted)] dark:hover:bg-[var(--color-pokedex-dark-border)]/50 dark:hover:text-[var(--color-pokedex-dark-text)]"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
        <button
          type="submit"
          aria-label="Search"
          className="rounded-md bg-[var(--color-pokedex-text)] px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[var(--color-pokedex-panel)] transition-all hover:opacity-90 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-pokeball-red)]/50 dark:bg-[var(--color-pokedex-dark-text)] dark:text-[var(--color-pokedex-dark-bg)]"
        >
          Search
        </button>
      </div>
    </form>
  );
}
