import { Search } from "lucide-react";
import usePokemonList from "../hooks/usePokemonList";
import usePokemonSearch from "../hooks/usePokemonSearch";
import usePokemonByType from "../hooks/usePokemonByType";
import PokemonGrid from "../components/pokemon/PokemonGrid";
import PokemonSkeletonCard from "../components/pokemon/PokemonSkeletonCard";
import SearchBar from "../components/pokemon/SearchBar";
import TypeFilter from "../components/pokemon/TypeFilter";
import LoadMoreButton from "../components/pokemon/LoadMoreButton";
import ErrorMessage from "../components/ui/ErrorMessage";
import EmptyState from "../components/ui/EmptyState";

export default function HomePage() {
  const list = usePokemonList();
  const search = usePokemonSearch();
  const type = usePokemonByType();

  function handleSearch(query) {
    search.search(query);
    type.changeType("all");
  }

  function handleClearSearch() {
    search.clearSearch();
    type.changeType("all");
  }

  function handleTypeChange(typeName) {
    type.changeType(typeName);
    search.clearSearch();
  }

  return (
    <div aria-busy={list.loading || search.searchLoading || type.typeLoading}>
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Explore Pokémon
        </h1>
        <p className="mt-2 text-slate-500">
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
        onChange={(q) => { search.search(q); type.changeType("all"); }}
        onSubmit={() => handleSearch(search.searchQuery)}
        onClear={handleClearSearch}
      />

      <TypeFilter
        selectedType={type.selectedType}
        onTypeChange={handleTypeChange}
      />

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

      {!list.loading && !list.error && !search.isSearching && !type.isTypeFiltering && list.pokemon.length > 0 && (
        <>
          <PokemonGrid pokemon={list.pokemon} />
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
        <PokemonGrid pokemon={[search.searchResult]} />
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

      {type.isTypeFiltering && !type.typeLoading && !type.typeError && type.typePokemon.length > 0 && (
        <PokemonGrid pokemon={type.typePokemon} />
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
