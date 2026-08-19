import { useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import TypeFilter from "./TypeFilter";
import SortSelect from "./SortSelect";
import { cn } from "../../utils/cn";

export default function AdvancedSearch({
  selectedType,
  onTypeChange,
  sortBy,
  onSortChange,
  isTypeFiltering,
  hasPokemon,
}) {
  const [isOpen, setIsOpen] = useState(false);

  const hasActiveFilters = isTypeFiltering || sortBy !== "id-asc";
  const activeCount = (isTypeFiltering ? 1 : 0) + (sortBy !== "id-asc" ? 1 : 0);

  return (
    <div className="mb-6">
      {/* Toggle button */}
      <div className="flex justify-center">
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          aria-expanded={isOpen}
          aria-controls="advanced-search-panel"
          className={cn(
            "inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all duration-200",
            "focus-visible:ring-2 focus-visible:ring-[var(--color-pokeball-red)]/50 focus-visible:ring-offset-2",
            isOpen || hasActiveFilters
              ? "border-[var(--color-pokeball-red)]/30 bg-[var(--color-pokeball-red)]/5 text-[var(--color-pokeball-red)] dark:border-[var(--color-pokeball-red)]/30 dark:bg-[var(--color-pokeball-red)]/10 dark:text-red-400"
              : "border-[var(--color-pokedex-border)] bg-[var(--color-pokedex-panel)] text-[var(--color-pokedex-muted)] hover:border-[var(--color-pokedex-subtle)] hover:text-[var(--color-pokedex-text)] dark:border-[var(--color-pokedex-dark-border)] dark:bg-[var(--color-pokedex-dark-panel)] dark:text-[var(--color-pokedex-dark-muted)] dark:hover:border-[var(--color-pokedex-dark-muted)] dark:hover:text-[var(--color-pokedex-dark-text)]"
          )}
        >
          <SlidersHorizontal className="h-3.5 w-3.5" />
          Advanced Search
          {hasActiveFilters && !isOpen && (
            <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--color-pokeball-red)] px-1 text-[9px] font-bold text-white dark:bg-red-500">
              {activeCount}
            </span>
          )}
        </button>
      </div>

      {/* Collapsible panel */}
      {isOpen && (
        <div
          id="advanced-search-panel"
          className="animate-fade-in mt-4 rounded-xl border border-[var(--color-pokedex-border)] bg-[var(--color-pokedex-panel)] p-4 sm:p-5 dark:border-[var(--color-pokedex-dark-border)] dark:bg-[var(--color-pokedex-dark-panel)]"
        >
          {/* Panel header */}
          <div className="mb-4 flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-pokedex-subtle)] dark:text-[var(--color-pokedex-dark-muted)]">
              Filter & Sort
            </span>
            {(isTypeFiltering || sortBy !== "id-asc") && (
              <button
                onClick={() => {
                  onTypeChange("all");
                  onSortChange("id-asc");
                }}
                className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[var(--color-pokedex-subtle)] transition-colors hover:text-[var(--color-pokeball-red)] dark:text-[var(--color-pokedex-dark-muted)] dark:hover:text-red-400"
              >
                <X className="h-3 w-3" />
                Reset
              </button>
            )}
          </div>

          {/* Type filter */}
          <TypeFilter selectedType={selectedType} onTypeChange={onTypeChange} />

          {/* Sort — show when there are results */}
          {hasPokemon && (
            <SortSelect value={sortBy} onChange={onSortChange} />
          )}
        </div>
      )}
    </div>
  );
}
