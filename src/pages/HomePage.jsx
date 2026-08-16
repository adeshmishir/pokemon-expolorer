import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search } from "lucide-react";
import usePokemonList from "../hooks/usePokemonList";
import usePokemonSearch from "../hooks/usePokemonSearch";
import usePokemonByType from "../hooks/usePokemonByType";
import useFavorites from "../hooks/useFavorites";
import useCompare from "../hooks/useCompare";
import { sortPokemon } from "../components/pokemon/SortSelect";
import PokemonGrid from "../components/pokemon/PokemonGrid";
import PokemonSkeletonCard from "../components/pokemon/PokemonSkeletonCard";
import SearchBar from "../components/pokemon/SearchBar";
import TypeFilter from "../components/pokemon/TypeFilter";
import SortSelect from "../components/pokemon/SortSelect";
import ComparePanel from "../components/pokemon/ComparePanel";
import LoadMoreButton from "../components/pokemon/LoadMoreButton";
import ErrorMessage from "../components/ui/ErrorMessage";
import EmptyState from "../components/ui/EmptyState";

export default function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  const [sortBy, setSortBy] = useState("default");

  const list = usePokemonList();
  const search = usePokemonSearch(initialQuery);
  const type = usePokemonByType();
  const { favorites, toggleFavorite, isFavorite } = useFavorites();
  const compare = useCompare();

  function handleSearch(query) {
    search.search(query);
    type.changeType("all");
    if (query) {
      setSearchParams({ q: query });
    } else {
      setSearchParams({});
    }
  }

  function handleClearSearch() {
    search.clearSearch();
    type.changeType("all");
    setSearchParams({});
  }

  function handleTypeChange(typeName) {
    type.changeType(typeName);
    search.clearSearch();
    setSearchParams({});
  }

  function handleCloseCompare() {
    compare.clearCompare();
  }

  const displayPokemon =
    search.isSearching
      ? []
      : type.isTypeFiltering
        ? sortPokemon(type.typePokemon, sortBy)
        : sortPokemon(list.pokemon, sortBy);

  return (
    <div aria-busy={list.loading || search.searchLoading || type.typeLoading}>
      {/* Hero Section — Pokédex Scanner */}
      <div className="animate-fade-in-up mb-10 text-center">
        <div className="mb-4 flex items-center justify-center gap-2">
          <span className="relative flex h-6 w-6 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-[var(--color-pokedex-text)] dark:border-[var(--color-pokedex-dark-text)]">
            <span className="absolute inset-x-0 top-0 h-1/2 bg-[var(--color-pokeball-red)]" />
            <span className="absolute inset-x-0 top-1/2 h-[1.5px] bg-[var(--color-pokedex-text)] dark:bg-[var(--color-pokedex-dark-text)]" />
            <span className="absolute inset-0 m-auto h-1.5 w-1.5 rounded-full border-[1.5px] border-[var(--color-pokedex-text)] bg-[var(--color-pokedex-panel)] dark:border-[var(--color-pokedex-dark-text)] dark:bg-[var(--color-pokedex-dark-surface)]" />
          </span>
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--color-pokedex-subtle)] dark:text-[var(--color-pokedex-dark-muted)]">
            Pokédex
          </span>
        </div>
        <h1 className="text-2xl font-extrabold uppercase tracking-wider text-[var(--color-pokedex-text)] sm:text-3xl dark:text-[var(--color-pokedex-dark-text)]">
          Explore the Pokémon World
        </h1>
        <p className="mt-2 max-w-md mx-auto text-xs text-[var(--color-pokedex-muted)] dark:text-[var(--color-pokedex-dark-muted)]">
          Discover Pokémon, inspect their abilities, compare stats, and build your collection.
        </p>
      </div>

      {/* Search */}
      <SearchBar
        value={search.searchQuery}
        onChange={(q) => { search.setQuery(q); type.changeType("all"); setSearchParams(q ? { q } : {}); }}
        onSubmit={() => handleSearch(search.searchQuery)}
        onClear={handleClearSearch}
      />

      {/* Section label */}
      <div className="mb-4 flex items-center gap-3">
        <div className="h-px flex-1 bg-[var(--color-pokedex-border)] dark:bg-[var(--color-pokedex-dark-border)]" />
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-pokedex-subtle)] dark:text-[var(--color-pokedex-dark-muted)]">
          {search.isSearching
            ? "Search Results"
            : type.isTypeFiltering
              ? type.typeLoading
                ? "Loading..."
                : `${type.selectedType} Pokémon`
              : "All Pokémon"}
        </span>
        <div className="h-px flex-1 bg-[var(--color-pokedex-border)] dark:bg-[var(--color-pokedex-dark-border)]" />
      </div>

      {/* Type Filter */}
      <TypeFilter
        selectedType={type.selectedType}
        onTypeChange={handleTypeChange}
      />

      {/* Sort */}
      {!search.isSearching && !type.isTypeFiltering && list.pokemon.length > 0 && (
        <SortSelect value={sortBy} onChange={setSortBy} />
      )}

      {type.isTypeFiltering && type.typePokemon.length > 0 && !type.typeLoading && (
        <SortSelect value={sortBy} onChange={setSortBy} />
      )}

      {/* Compare Panel */}
      {compare.selected.length > 0 && (
        <ComparePanel pokemon={compare.selected} onClose={handleCloseCompare} />
      )}

      {/* Error — List */}
      {list.error && !type.isTypeFiltering && (
        <ErrorMessage
          title="Failed to load Pokémon"
          message={list.error}
          onRetry={list.retry}
        />
      )}

      {/* Loading — Initial */}
      {list.loading && !type.isTypeFiltering && (
        <PokemonGrid>
          {Array.from({ length: 20 }, (_, i) => (
            <PokemonSkeletonCard key={i} />
          ))}
        </PokemonGrid>
      )}

      {/* Pokemon Grid — Default */}
      {!list.loading && !list.error && !search.isSearching && !type.isTypeFiltering && displayPokemon.length > 0 && (
        <>
          <PokemonGrid
            pokemon={displayPokemon}
            isFavorite={isFavorite}
            onToggleFavorite={toggleFavorite}
            isComparing={compare.isSelected}
            onToggleCompare={compare.toggleCompare}
          />
          <LoadMoreButton
            onLoadMore={list.loadMore}
            isLoading={list.loadingMore}
            hasMore={list.hasMore}
            loadedCount={list.pokemon.length}
            total={list.total}
          />
        </>
      )}

      {/* Empty — Default */}
      {!list.loading && !list.error && !search.isSearching && !type.isTypeFiltering && list.pokemon.length === 0 && (
        <EmptyState
          title="No Pokémon found"
          description="The Pokédex came up empty."
        />
      )}

      {/* Loading — Search */}
      {search.isSearching && search.searchLoading && (
        <PokemonGrid>
          <PokemonSkeletonCard />
        </PokemonGrid>
      )}

      {/* Result — Search */}
      {search.isSearching && search.searchResult && (
        <PokemonGrid
          pokemon={[search.searchResult]}
          isFavorite={isFavorite}
          onToggleFavorite={toggleFavorite}
          isComparing={compare.isSelected}
          onToggleCompare={compare.toggleCompare}
        />
      )}

      {/* Not Found — Search */}
      {search.isSearching && search.searchError === "not_found" && (
        <EmptyState
          icon={Search}
          title="Pokémon not found"
          description="Try searching for another Pokémon."
        />
      )}

      {/* Error — Search */}
      {search.isSearching && search.searchError === "api_error" && (
        <ErrorMessage
          title="Search failed"
          message="Something went wrong while searching. Please try again."
          onRetry={() => search.search(search.searchQuery)}
        />
      )}

      {/* Loading — Type Filter */}
      {type.isTypeFiltering && type.typeLoading && (
        <PokemonGrid>
          {Array.from({ length: 12 }, (_, i) => (
            <PokemonSkeletonCard key={i} />
          ))}
        </PokemonGrid>
      )}

      {/* Error — Type Filter */}
      {type.isTypeFiltering && !type.typeLoading && type.typeError && (
        <ErrorMessage
          title="Failed to load Pokémon"
          message={type.typeError}
          onRetry={() => type.changeType(type.selectedType)}
        />
      )}

      {/* Results — Type Filter */}
      {type.isTypeFiltering && !type.typeLoading && !type.typeError && displayPokemon.length > 0 && (
        <PokemonGrid
          pokemon={displayPokemon}
          isFavorite={isFavorite}
          onToggleFavorite={toggleFavorite}
          isComparing={compare.isSelected}
          onToggleCompare={compare.toggleCompare}
        />
      )}

      {/* Empty — Type Filter */}
      {type.isTypeFiltering && !type.typeLoading && !type.typeError && type.typePokemon.length === 0 && (
        <EmptyState
          icon={Search}
          title="No Pokémon found"
          description="There are no Pokémon available for this type."
        />
      )}
    </div>
  );
}
