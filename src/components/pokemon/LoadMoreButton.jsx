import { Loader2 } from "lucide-react";

export default function LoadMoreButton({ onLoadMore, isLoading, hasMore, loadedCount, total }) {
  if (!hasMore) return null;

  return (
    <div className="mt-8 flex flex-col items-center gap-2">
      <button
        onClick={onLoadMore}
        disabled={isLoading}
        aria-label="Load more Pokémon"
        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-800 shadow-sm outline-none transition-all duration-150 hover:bg-slate-50 hover:shadow-md active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading…
          </>
        ) : (
          "Load More Pokémon"
        )}
      </button>
      <p className="text-xs text-slate-400">
        Showing {loadedCount} of {total}
      </p>
    </div>
  );
}
