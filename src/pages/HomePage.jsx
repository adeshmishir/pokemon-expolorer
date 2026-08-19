import { useState, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Search, Heart, Swords } from "lucide-react";
import usePokemonDataset from "../hooks/usePokemonDataset";
import usePokemonSearch from "../hooks/usePokemonSearch";
import usePokemonByType from "../hooks/usePokemonByType";
import usePokemonList from "../hooks/usePokemonList";
import useFavorites from "../hooks/useFavorites";
import useCompare from "../hooks/useCompare";
import { sortPokemon } from "../components/pokemon/SortSelect";
import PokemonGrid from "../components/pokemon/PokemonGrid";
import PokemonSkeletonCard from "../components/pokemon/PokemonSkeletonCard";
import SearchBar from "../components/pokemon/SearchBar";
import AdvancedSearch from "../components/pokemon/AdvancedSearch";
import ComparePanel from "../components/pokemon/ComparePanel";
import LoadMoreButton from "../components/pokemon/LoadMoreButton";
import ErrorMessage from "../components/ui/ErrorMessage";
import EmptyState from "../components/ui/EmptyState";

export default function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const navigate = useNavigate();

  const [sortBy, setSortBy] = useState("id-asc");

  const { allPokemon, loading: datasetLoading, error: datasetError } = usePokemonDataset();
  const search = usePokemonSearch(allPokemon, initialQuery);
  const type = usePokemonByType();
  const { favorites, toggleFavorite, isFavorite } = useFavorites();
  const compare = useCompare();

  const processedList = useMemo(() => {
    if (datasetLoading || allPokemon.length === 0) return [];

    if (type.isTypeFiltering && type.typeNames.length === 0) return [];

    let result = allPokemon;

    if (search.isSearching && search.searchQuery.trim()) {
      const q = search.searchQuery.trim().toLowerCase();
      result = result.filter((p) => p.name.toLowerCase().includes(q));
    }

    if (type.isTypeFiltering && type.typeNames.length > 0) {
      const typeSet = new Set(type.typeNames.map((t) => t.name.toLowerCase()));
      result = result.filter((p) => typeSet.has(p.name.toLowerCase()));
    }

    result = sortPokemon(result, sortBy);

    return result;
  }, [allPokemon, search.searchQuery, search.isSearching, type.typeNames, type.isTypeFiltering, sortBy, datasetLoading]);

  const {
    pokemon,
    loading: listLoading,
    loadingMore,
    error: listError,
    loadMore,
    hasMore,
    total,
  } = usePokemonList(processedList, processedList.length);

  function handleSearch(query) {
    search.search(query);
    if (query) {
      setSearchParams({ q: query });
    } else {
      setSearchParams({});
    }
  }

  function handleClearSearch() {
    search.clearSearch();
    setSearchParams({});
  }

  function handleTypeChange(typeName) {
    type.changeType(typeName);
  }

  function handleCloseCompare() {
    compare.clearCompare();
  }

  function handleSearchChange(q) {
    if (q.trim() === "") {
      handleClearSearch();
    } else {
      search.setQuery(q);
      setSearchParams(q ? { q } : {});
    }
  }

  const sectionLabel = search.isSearching
    ? type.isTypeFiltering
      ? `${type.selectedType} Pokémon`
      : "Search Results"
    : type.isTypeFiltering
      ? type.typeLoading
        ? "Loading..."
        : `${type.selectedType} Pokémon`
      : "All Pokémon";

  const isInitialLoading = datasetLoading || (type.isTypeFiltering && type.typeNames.length === 0) || (listLoading && pokemon.length === 0);
  const isEmpty = !isInitialLoading && !datasetError && !listError && processedList.length === 0;
  const hasResults = !isInitialLoading && !datasetError && pokemon.length > 0;

  return (
    <div aria-busy={isInitialLoading}>
      <div className="relative">
        {/* ─── Hero Section ─── */}
        <div className="animate-fade-in-up mb-12 text-center">
          <div className="mb-6 flex justify-center">
            <div className="animate-float relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border-[3px] border-[var(--color-pokedex-text)] dark:border-[var(--color-pokedex-dark-text)]">
              <span className="absolute inset-x-0 top-0 h-1/2 bg-[var(--color-pokeball-red)]" />
              <span className="absolute inset-x-0 top-1/2 h-[3px] bg-[var(--color-pokedex-text)] dark:bg-[var(--color-pokedex-dark-text)]" />
              <span className="absolute inset-0 m-auto h-5 w-5 rounded-full border-[3px] border-[var(--color-pokedex-text)] bg-[var(--color-pokedex-panel)] dark:border-[var(--color-pokedex-dark-text)] dark:bg-[var(--color-pokedex-dark-surface)]" />
            </div>
          </div>

          <h1 className="text-3xl font-extrabold uppercase tracking-[0.15em] text-[var(--color-pokedex-text)] sm:text-4xl dark:text-[var(--color-pokedex-dark-text)]">
            Pokémon <span className="text-[var(--color-pokeball-red)]">Explorer</span>
          </h1>
          <p className="mt-3 text-sm font-medium text-[var(--color-pokedex-muted)] dark:text-[var(--color-pokedex-dark-muted)]">
            Discover, collect, and compare every Pokémon
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => {
                document.getElementById("search-input")?.focus();
              }}
              className="inline-flex items-center gap-2 rounded-xl border-2 border-[var(--color-pokedex-border)] bg-[var(--color-pokedex-panel)] px-5 py-2.5 text-xs font-extrabold uppercase tracking-wider text-[var(--color-pokedex-text)] transition-all duration-200 hover:border-[var(--color-pokeball-red)]/30 hover:bg-[var(--color-pokedex-surface)] hover:shadow-md active:scale-95 dark:border-[var(--color-pokedex-dark-border)] dark:bg-[var(--color-pokedex-dark-panel)] dark:text-[var(--color-pokedex-dark-text)] dark:hover:border-[var(--color-pokedex-dark-border)]"
            >
              <Search className="h-4 w-4" />
              Search
            </button>
            <button
              onClick={() => navigate("/collection")}
              className="inline-flex items-center gap-2 rounded-xl border-2 border-[var(--color-pokedex-border)] bg-[var(--color-pokedex-panel)] px-5 py-2.5 text-xs font-extrabold uppercase tracking-wider text-[var(--color-pokedex-text)] transition-all duration-200 hover:border-red-300 hover:bg-red-50/50 hover:shadow-md active:scale-95 dark:border-[var(--color-pokedex-dark-border)] dark:bg-[var(--color-pokedex-dark-panel)] dark:text-[var(--color-pokedex-dark-text)] dark:hover:border-red-500/30"
            >
              <Heart className="h-4 w-4" />
              My Collection
            </button>
            <button
              onClick={() => navigate("/battle-lab")}
              className="inline-flex items-center gap-2 rounded-xl border-2 border-[var(--color-pokedex-border)] bg-[var(--color-pokedex-panel)] px-5 py-2.5 text-xs font-extrabold uppercase tracking-wider text-[var(--color-pokedex-text)] transition-all duration-200 hover:border-blue-300 hover:bg-blue-50/50 hover:shadow-md active:scale-95 dark:border-[var(--color-pokedex-dark-border)] dark:bg-[var(--color-pokedex-dark-panel)] dark:text-[var(--color-pokedex-dark-text)] dark:hover:border-blue-500/30"
            >
              <Swords className="h-4 w-4" />
              Battle Lab
            </button>
          </div>
        </div>

        {/* ─── Search ─── */}
        <SearchBar
          value={search.searchQuery}
          onChange={handleSearchChange}
          onSubmit={() => handleSearch(search.searchQuery)}
          onClear={handleClearSearch}
          suggestions={allPokemon}
        />

        {/* ─── Section divider ─── */}
        <div className="mb-4 flex items-center gap-3">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[var(--color-pokedex-border)] to-transparent dark:from-transparent dark:via-[var(--color-pokedex-dark-border)] dark:to-transparent" />
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-pokedex-subtle)] dark:text-[var(--color-pokedex-dark-muted)]">
            {sectionLabel}
          </span>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[var(--color-pokedex-border)] to-transparent dark:from-transparent dark:via-[var(--color-pokedex-dark-border)] dark:to-transparent" />
        </div>

        {/* ─── Advanced Search ─── */}
        <AdvancedSearch
          selectedType={type.selectedType}
          onTypeChange={handleTypeChange}
          sortBy={sortBy}
          onSortChange={setSortBy}
          isTypeFiltering={type.isTypeFiltering}
          hasPokemon={allPokemon.length > 0}
        />

        {/* ─── Compare Panel ─── */}
        {compare.selected.length > 0 && (
          <ComparePanel pokemon={compare.selected} onClose={handleCloseCompare} />
        )}

        {/* ─── Error — Dataset ─── */}
        {datasetError && (
          <ErrorMessage
            title="Failed to load Pokémon"
            message={datasetError}
            onRetry={() => window.location.reload()}
          />
        )}

        {/* ─── Error — List ─── */}
        {listError && !datasetError && (
          <ErrorMessage
            title="Failed to load Pokémon"
            message={listError}
            onRetry={() => window.location.reload()}
          />
        )}

        {/* ─── Loading — Initial ─── */}
        {isInitialLoading && (
          <PokemonGrid>
            {Array.from({ length: 20 }, (_, i) => (
              <PokemonSkeletonCard key={i} />
            ))}
          </PokemonGrid>
        )}

        {/* ─── Results ─── */}
        {hasResults && (
          <>
            <PokemonGrid
              pokemon={pokemon}
              isFavorite={isFavorite}
              onToggleFavorite={toggleFavorite}
              isComparing={compare.isSelected}
              onToggleCompare={compare.toggleCompare}
            />
            <LoadMoreButton
              onLoadMore={loadMore}
              isLoading={loadingMore}
              hasMore={hasMore}
              loadedCount={pokemon.length}
              total={total}
            />
          </>
        )}

        {/* ─── Empty ─── */}
        {isEmpty && (
          <EmptyState
            icon={Search}
            title="No Pokémon found"
            description={
              search.isSearching
                ? "Try searching for another Pokémon."
                : type.isTypeFiltering
                  ? "There are no Pokémon available for this type."
                  : "The Pokédex came up empty."
            }
          />
        )}
      </div>
    </div>
  );
}
