import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Search, Heart, Swords } from "lucide-react";
import usePokemonList from "../hooks/usePokemonList";
import usePokemonSearch from "../hooks/usePokemonSearch";
import usePokemonByType from "../hooks/usePokemonByType";
import usePokemonNames from "../hooks/usePokemonNames";
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
import AnimatedBackground from "../components/backgrounds/AnimatedBackground";

export default function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const navigate = useNavigate();

  const [sortBy, setSortBy] = useState("default");

  const list = usePokemonList();
  const search = usePokemonSearch(initialQuery);
  const type = usePokemonByType();
  const allNames = usePokemonNames();
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
      <AnimatedBackground />

      <div className="relative">
        {/* ─── Hero Section ─── */}
        <div className="animate-fade-in-up mb-12 text-center">
          {/* Floating Poké Ball */}
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

          {/* Action Buttons */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => {
                document.getElementById("search-input")?.focus();
              }}
              className="inline-flex items-center gap-2 rounded-xl border-2 border-[var(--color-pokedex-border)] bg-[var(--color-pokedex-panel)] px-5 py-2.5 text-xs font-extrabold uppercase tracking-wider text-[var(--color-pokedex-text)] transition-all hover:border-[var(--color-pokeball-red)]/30 hover:bg-[var(--color-pokedex-surface)] active:scale-95 dark:border-[var(--color-pokedex-dark-border)] dark:bg-[var(--color-pokedex-dark-panel)] dark:text-[var(--color-pokedex-dark-text)] dark:hover:border-[var(--color-pokeball-red)]/30"
            >
              <Search className="h-4 w-4" />
              Search
            </button>
            <button
              onClick={() => navigate("/collection")}
              className="inline-flex items-center gap-2 rounded-xl border-2 border-[var(--color-pokedex-border)] bg-[var(--color-pokedex-panel)] px-5 py-2.5 text-xs font-extrabold uppercase tracking-wider text-[var(--color-pokedex-text)] transition-all hover:border-red-300 hover:bg-red-50/50 active:scale-95 dark:border-[var(--color-pokedex-dark-border)] dark:bg-[var(--color-pokedex-dark-panel)] dark:text-[var(--color-pokedex-dark-text)] dark:hover:border-red-500/30"
            >
              <Heart className="h-4 w-4" />
              My Collection
            </button>
            <button
              onClick={() => navigate("/battle-lab")}
              className="inline-flex items-center gap-2 rounded-xl border-2 border-[var(--color-pokedex-border)] bg-[var(--color-pokedex-panel)] px-5 py-2.5 text-xs font-extrabold uppercase tracking-wider text-[var(--color-pokedex-text)] transition-all hover:border-blue-300 hover:bg-blue-50/50 active:scale-95 dark:border-[var(--color-pokedex-dark-border)] dark:bg-[var(--color-pokedex-dark-panel)] dark:text-[var(--color-pokedex-dark-text)] dark:hover:border-blue-500/30"
            >
              <Swords className="h-4 w-4" />
              Battle Lab
            </button>
          </div>
        </div>

        {/* ─── Search ─── */}
        <SearchBar
          value={search.searchQuery}
          onChange={(q) => { search.setQuery(q); type.changeType("all"); setSearchParams(q ? { q } : {}); }}
          onSubmit={() => handleSearch(search.searchQuery)}
          onClear={handleClearSearch}
          suggestions={allNames}
        />

        {/* ─── Section divider ─── */}
        <div className="mb-4 flex items-center gap-3">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[var(--color-pokedex-border)] to-transparent dark:from-transparent dark:via-[var(--color-pokedex-dark-border)] dark:to-transparent" />
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-pokedex-subtle)] dark:text-[var(--color-pokedex-dark-muted)]">
            {search.isSearching
              ? "Search Results"
              : type.isTypeFiltering
                ? type.typeLoading
                  ? "Loading..."
                  : `${type.selectedType} Pokémon`
                : "All Pokémon"}
          </span>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[var(--color-pokedex-border)] to-transparent dark:from-transparent dark:via-[var(--color-pokedex-dark-border)] dark:to-transparent" />
        </div>

        {/* ─── Type Filter ─── */}
        <TypeFilter
          selectedType={type.selectedType}
          onTypeChange={handleTypeChange}
        />

        {/* ─── Sort ─── */}
        {!search.isSearching && !type.isTypeFiltering && list.pokemon.length > 0 && (
          <SortSelect value={sortBy} onChange={setSortBy} />
        )}

        {type.isTypeFiltering && type.typePokemon.length > 0 && !type.typeLoading && (
          <SortSelect value={sortBy} onChange={setSortBy} />
        )}

        {/* ─── Compare Panel ─── */}
        {compare.selected.length > 0 && (
          <ComparePanel pokemon={compare.selected} onClose={handleCloseCompare} />
        )}

        {/* ─── Error — List ─── */}
        {list.error && !type.isTypeFiltering && (
          <ErrorMessage
            title="Failed to load Pokémon"
            message={list.error}
            onRetry={list.retry}
          />
        )}

        {/* ─── Loading — Initial ─── */}
        {list.loading && !type.isTypeFiltering && (
          <PokemonGrid>
            {Array.from({ length: 20 }, (_, i) => (
              <PokemonSkeletonCard key={i} />
            ))}
          </PokemonGrid>
        )}

        {/* ─── Pokemon Grid — Default ─── */}
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

        {/* ─── Empty — Default ─── */}
        {!list.loading && !list.error && !search.isSearching && !type.isTypeFiltering && list.pokemon.length === 0 && (
          <EmptyState
            title="No Pokémon found"
            description="The Pokédex came up empty."
          />
        )}

        {/* ─── Loading — Search ─── */}
        {search.isSearching && search.searchLoading && (
          <PokemonGrid>
            <PokemonSkeletonCard />
          </PokemonGrid>
        )}

        {/* ─── Result — Search ─── */}
        {search.isSearching && search.searchResult && (
          <PokemonGrid
            pokemon={[search.searchResult]}
            isFavorite={isFavorite}
            onToggleFavorite={toggleFavorite}
            isComparing={compare.isSelected}
            onToggleCompare={compare.toggleCompare}
          />
        )}

        {/* ─── Not Found — Search ─── */}
        {search.isSearching && search.searchError === "not_found" && (
          <EmptyState
            icon={Search}
            title="Pokémon not found"
            description="Try searching for another Pokémon."
          />
        )}

        {/* ─── Error — Search ─── */}
        {search.isSearching && search.searchError === "api_error" && (
          <ErrorMessage
            title="Search failed"
            message="Something went wrong while searching. Please try again."
            onRetry={() => search.search(search.searchQuery)}
          />
        )}

        {/* ─── Loading — Type Filter ─── */}
        {type.isTypeFiltering && type.typeLoading && (
          <PokemonGrid>
            {Array.from({ length: 12 }, (_, i) => (
              <PokemonSkeletonCard key={i} />
            ))}
          </PokemonGrid>
        )}

        {/* ─── Error — Type Filter ─── */}
        {type.isTypeFiltering && !type.typeLoading && type.typeError && (
          <ErrorMessage
            title="Failed to load Pokémon"
            message={type.typeError}
            onRetry={() => type.changeType(type.selectedType)}
          />
        )}

        {/* ─── Results — Type Filter ─── */}
        {type.isTypeFiltering && !type.typeLoading && !type.typeError && displayPokemon.length > 0 && (
          <PokemonGrid
            pokemon={displayPokemon}
            isFavorite={isFavorite}
            onToggleFavorite={toggleFavorite}
            isComparing={compare.isSelected}
            onToggleCompare={compare.toggleCompare}
          />
        )}

        {/* ─── Empty — Type Filter ─── */}
        {type.isTypeFiltering && !type.typeLoading && !type.typeError && type.typePokemon.length === 0 && (
          <EmptyState
            icon={Search}
            title="No Pokémon found"
            description="There are no Pokémon available for this type."
          />
        )}
      </div>
    </div>
  );
}
