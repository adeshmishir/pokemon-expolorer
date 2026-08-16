import { useCallback, useState, useRef, useEffect } from "react";
import { Search, X } from "lucide-react";
import { Link } from "react-router-dom";

export default function SearchBar({ value, onChange, onSubmit, onClear, suggestions = [] }) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const inputRef = useRef(null);
  const wrapperRef = useRef(null);

  const filtered = value.trim().length > 0
    ? suggestions.filter((p) =>
        p.name.toLowerCase().includes(value.trim().toLowerCase())
      ).slice(0, 6)
    : [];

  useEffect(() => {
    setHighlightIndex(-1);
  }, [value]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Escape") {
        if (value) {
          onClear();
        }
        setShowSuggestions(false);
        inputRef.current?.blur();
        return;
      }

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setHighlightIndex((prev) => (prev < filtered.length - 1 ? prev + 1 : 0));
        return;
      }

      if (e.key === "ArrowUp") {
        e.preventDefault();
        setHighlightIndex((prev) => (prev > 0 ? prev - 1 : filtered.length - 1));
        return;
      }

      if (e.key === "Enter") {
        e.preventDefault();
        if (highlightIndex >= 0 && filtered[highlightIndex]) {
          setShowSuggestions(false);
          inputRef.current?.blur();
          // Link handles navigation, but we also clear search state
          return;
        }
        onSubmit();
        setShowSuggestions(false);
      }
    },
    [value, onClear, onSubmit, highlightIndex, filtered]
  );

  function handleSubmit(e) {
    e.preventDefault();
    setShowSuggestions(false);
    onSubmit();
  }

  function handleInputChange(e) {
    onChange(e.target.value);
    setShowSuggestions(true);
  }

  function handleFocus() {
    if (value.trim().length > 0 && filtered.length > 0) {
      setShowSuggestions(true);
    }
  }

  return (
    <div ref={wrapperRef} className="relative w-full max-w-lg mx-auto mb-8">
      <form onSubmit={handleSubmit} role="search" aria-label="Search Pokémon">
        <div className="flex items-center gap-2 rounded-lg border border-[var(--color-pokedex-border)] bg-[var(--color-pokedex-panel)] px-4 py-2.5 transition-all focus-within:border-[var(--color-pokeball-red)]/40 focus-within:shadow-[0_0_0_3px_rgba(220,38,38,0.08)] dark:border-[var(--color-pokedex-dark-border)] dark:bg-[var(--color-pokedex-dark-panel)] dark:focus-within:border-[var(--color-pokeball-red)]/30 dark:focus-within:shadow-[0_0_0_3px_rgba(220,38,38,0.12)]">
          <Search className="h-4 w-4 shrink-0 text-[var(--color-pokedex-subtle)] dark:text-[var(--color-pokedex-dark-muted)]" />
          <input
            ref={inputRef}
            id="search-input"
            type="text"
            value={value}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={handleFocus}
            placeholder="Search Pokémon by name..."
            aria-label="Search Pokémon by name"
            aria-autocomplete="list"
            aria-expanded={showSuggestions && filtered.length > 0}
            aria-controls="search-suggestions"
            aria-activedescendant={highlightIndex >= 0 ? `suggestion-${highlightIndex}` : undefined}
            className="flex-1 bg-transparent text-sm text-[var(--color-pokedex-text)] placeholder-[var(--color-pokedex-subtle)] outline-none dark:text-[var(--color-pokedex-dark-text)] dark:placeholder-[var(--color-pokedex-dark-muted)]"
          />
          {value && (
            <button
              type="button"
              onClick={() => { onClear(); setShowSuggestions(false); }}
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

      {/* Suggestions dropdown */}
      {showSuggestions && filtered.length > 0 && (
        <ul
          id="search-suggestions"
          role="listbox"
          aria-label="Pokémon suggestions"
          className="animate-fade-in absolute z-50 mt-1 w-full overflow-hidden rounded-xl border border-[var(--color-pokedex-border)] bg-[var(--color-pokedex-panel)] shadow-xl dark:border-[var(--color-pokedex-dark-border)] dark:bg-[var(--color-pokedex-dark-panel)]"
        >
          {filtered.map((pokemon, i) => {
            const formattedId = `#${String(pokemon.id).padStart(3, "0")}`;
            return (
              <li
                key={pokemon.id}
                id={`suggestion-${i}`}
                role="option"
                aria-selected={i === highlightIndex}
              >
                <Link
                  to={`/pokemon/${pokemon.name}`}
                  onClick={() => { setShowSuggestions(false); }}
                  className={`flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                    i === highlightIndex
                      ? "bg-[var(--color-pokedex-surface)] dark:bg-[var(--color-pokedex-dark-bg)]"
                      : "hover:bg-[var(--color-pokedex-surface)] dark:hover:bg-[var(--color-pokedex-dark-bg)]"
                  }`}
                >
                  <span className="text-[10px] font-bold tracking-wider text-[var(--color-pokedex-subtle)] dark:text-[var(--color-pokedex-dark-muted)]">
                    {formattedId}
                  </span>
                  <span className="font-semibold capitalize text-[var(--color-pokedex-text)] dark:text-[var(--color-pokedex-dark-text)]">
                    {pokemon.name.replace(/-/g, " ")}
                  </span>
                  {pokemon.types && (
                    <span className="ml-auto flex gap-1">
                      {pokemon.types.slice(0, 2).map((t) => (
                        <span key={t} className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-pokedex-subtle)] dark:text-[var(--color-pokedex-dark-muted)]">
                          {t}
                        </span>
                      ))}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
