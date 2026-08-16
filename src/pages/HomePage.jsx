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
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl">
          Explore Pokémon
        </h1>
        <p className="mt-2 text-slate-500 dark:text-slate-400">
          {search.isSearching
            ? `Search results for "${search.searchQuery}"`
            : type.isTypeFiltering
              ? type.typeLoading
                ? `Loading ${type.selectedType} Pokémon…`
                : `${type.typePokemon.length} ${type.selectedType} Pokémon`
              : <>Browse the complete Pokédex — {list.loading ? "..." : list.pokemon.length} Pokémon loaded</>}
        </p>
      </div>

      <SearchBar
        value={search.searchQuery}
        onChange={(q) => { search.setQuery(q); type.changeType("all"); setSearchParams(q ? { q } : {}); }}
        onSubmit={() => handleSearch(search.searchQuery)}
        onClear={handleClearSearch}
      />

      <TypeFilter
        selectedType={type.selectedType}
        onTypeChange={handleTypeChange}
      />

      {!search.isSearching && !type.isTypeFiltering && list.pokemon.length > 0 && (
        <SortSelect value={sortBy} onChange={setSortBy} />
      )}

      {type.isTypeFiltering && type.typePokemon.length > 0 && !type.typeLoading && (
        <SortSelect value={sortBy} onChange={setSortBy} />
      )}

      {compare.selected.length > 0 && (
        <ComparePanel pokemon={compare.selected} onClose={handleCloseCompare} />
      )}

      {list.error && !type.isTypeFiltering && (
        <ErrorMessage
          title="Failed to load Pokémon"
          message={list.error}
          onRetry={list.retry}
        />
      )}

      {list.loading && !type.isTypeFiltering && (
        <PokemonGrid>
          {Array.from({ length: 20 }, (_, i) => (
            <PokemonSkeletonCard key={i} />
          ))}
        </PokemonGrid>
      )}

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

      {!list.loading && !list.error && !search.isSearching && !type.isTypeFiltering && list.pokemon.length === 0 && (
        <EmptyState
          title="No Pokémon found"
          description="The Pokédex came up empty."
        />
      )}

      {search.isSearching && search.searchLoading && (
        <PokemonGrid>
          <PokemonSkeletonCard />
        </PokemonGrid>
      )}

      {search.isSearching && search.searchResult && (
        <PokemonGrid
          pokemon={[search.searchResult]}
          isFavorite={isFavorite}
          onToggleFavorite={toggleFavorite}
          isComparing={compare.isSelected}
          onToggleCompare={compare.toggleCompare}
        />
      )}

      {search.isSearching && search.searchError === "not_found" && (
        <EmptyState
          icon={Search}
          title="Pokémon not found"
          description="Try searching for another Pokémon."
        />
      )}

      {search.isSearching && search.searchError === "api_error" && (
        <ErrorMessage
          title="Search failed"
          message="Something went wrong while searching. Please try again."
          onRetry={() => search.search(search.searchQuery)}
        />
      )}

      {type.isTypeFiltering && type.typeLoading && (
        <PokemonGrid>
          {Array.from({ length: 12 }, (_, i) => (
            <PokemonSkeletonCard key={i} />
          ))}
        </PokemonGrid>
      )}

      {type.isTypeFiltering && !type.typeLoading && type.typeError && (
        <ErrorMessage
          title="Failed to load Pokémon"
          message={type.typeError}
          onRetry={() => type.changeType(type.selectedType)}
        />
      )}

      {type.isTypeFiltering && !type.typeLoading && !type.typeError && displayPokemon.length > 0 && (
        <PokemonGrid
          pokemon={displayPokemon}
          isFavorite={isFavorite}
          onToggleFavorite={toggleFavorite}
          isComparing={compare.isSelected}
          onToggleCompare={compare.toggleCompare}
        />
      )}

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
