import { Loader2 } from "lucide-react";

export default function LoadMoreButton({ onLoadMore, isLoading, hasMore, loadedCount, total }) {
  if (!hasMore) return null;

  return (
    <div className="mt-8 flex flex-col items-center gap-2">
      <button
        onClick={onLoadMore}
        disabled={isLoading}
        aria-label="Load more Pokémon"
        className="inline-flex items-center gap-2 rounded-lg border border-[var(--color-pokedex-border)] bg-[var(--color-pokedex-panel)] px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-[var(--color-pokedex-text)] outline-none transition-all duration-150 hover:border-[var(--color-pokedex-subtle)] hover:bg-[var(--color-pokedex-surface)] active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-[var(--color-pokeball-red)]/40 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-[var(--color-pokedex-dark-border)] dark:bg-[var(--color-pokedex-dark-panel)] dark:text-[var(--color-pokedex-dark-text)] dark:hover:border-[var(--color-pokedex-dark-muted)] dark:hover:bg-[var(--color-pokedex-dark-surface)]"
      >
        {isLoading ? (
          <>
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            Loading…
          </>
        ) : (
          "Load More"
        )}
      </button>
      <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--color-pokedex-subtle)] dark:text-[var(--color-pokedex-dark-muted)]">
        {loadedCount} of {total}
      </p>
    </div>
  );
}
