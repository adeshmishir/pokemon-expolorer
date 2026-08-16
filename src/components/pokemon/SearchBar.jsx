import { Search, X } from "lucide-react";

export default function SearchBar({ value, onChange, onSubmit, onClear }) {
  function handleSubmit(e) {
    e.preventDefault();
    onSubmit();
  }

  return (
    <form onSubmit={handleSubmit} role="search" aria-label="Search Pokémon" className="w-full max-w-lg mx-auto mb-8">
      <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 shadow-sm transition-all focus-within:border-slate-400 focus-within:shadow-md">
        <Search className="h-5 w-5 shrink-0 text-slate-400" />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search Pokémon..."
          aria-label="Search Pokémon by name"
          className="flex-1 bg-transparent text-sm text-slate-900 placeholder-slate-400 outline-none"
        />
        {value && (
          <button
            type="button"
            onClick={onClear}
            aria-label="Clear search"
            className="rounded-full p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="h-4 w-4" />
          </button>
        )}
        <button
          type="submit"
          aria-label="Search"
          className="rounded-lg bg-slate-800 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2"
        >
          Search
        </button>
      </div>
    </form>
  );
}
