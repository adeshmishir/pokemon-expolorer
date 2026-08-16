import { useState, useEffect, useRef } from "react";
import { Search } from "lucide-react";
import {
  getPokemonList,
  getPokemonDetails,
  getPokemonByType,
} from "../services/pokeApi";
import { isApiError } from "../utils/errors";
import PokemonGrid from "../components/pokemon/PokemonGrid";
import PokemonSkeletonCard from "../components/pokemon/PokemonSkeletonCard";
import SearchBar from "../components/pokemon/SearchBar";
import TypeFilter from "../components/pokemon/TypeFilter";
import LoadMoreButton from "../components/pokemon/LoadMoreButton";
import ErrorMessage from "../components/ui/ErrorMessage";
import EmptyState from "../components/ui/EmptyState";

export default function HomePage() {
  const [pokemon, setPokemon] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  const [selectedType, setSelectedType] = useState("all");
  const [typePokemon, setTypePokemon] = useState([]);
  const [typeLoading, setTypeLoading] = useState(false);
  const [typeError, setTypeError] = useState(null);

  const typeFetchId = useRef(0);

  useEffect(() => {
    let cancelled = false;

    async function fetchPokemon() {
      setLoading(true);
      setError(null);

      try {
        const list = await getPokemonList(20, 0);
        const results = await Promise.allSettled(
          list.results.map((p) => getPokemonDetails(p.name))
        );

        if (cancelled) return;

        const succeeded = results
          .filter((r) => r.status === "fulfilled")
          .map((r) => r.value);

        setPokemon(succeeded);
        setTotal(list.count);
        setHasMore(list.next !== null);
      } catch (err) {
        if (!cancelled) {
          setError(isApiError(err) ? err.message : "Failed to load Pokémon");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchPokemon();
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleLoadMore() {
    if (loadingMore) return;

    setLoadingMore(true);

    try {
      const list = await getPokemonList(20, pokemon.length);
      const results = await Promise.allSettled(
        list.results.map((p) => getPokemonDetails(p.name))
      );

      const succeeded = results
        .filter((r) => r.status === "fulfilled")
        .map((r) => r.value);

      setPokemon((prev) => [...prev, ...succeeded]);
      setHasMore(list.next !== null);
    } catch {
      // keep existing pokemon visible, button stays for retry
    } finally {
      setLoadingMore(false);
    }
  }

  function handleSearch(query) {
    const trimmed = query.trim();
    if (!trimmed) return;

    const normalized = trimmed.toLowerCase();
    setSearchQuery(normalized);
    setIsSearching(true);
    setSearchLoading(true);
    setSearchError(null);
    setSearchResult(null);
    setSelectedType("all");

    getPokemonDetails(normalized)
      .then((data) => {
        setSearchResult(data);
        setSearchLoading(false);
      })
      .catch((err) => {
        setSearchLoading(false);
        if (isApiError(err) && err.status === 404) {
          setSearchError("not_found");
        } else {
          setSearchError("api_error");
        }
      });
  }

  function handleClearSearch() {
    setSearchQuery("");
    setSearchResult(null);
    setSearchLoading(false);
    setSearchError(null);
    setIsSearching(false);
    setSelectedType("all");
  }

  async function handleTypeChange(type) {
    if (type === selectedType) return;

    setSelectedType(type);

    if (type === "all") {
      setTypePokemon([]);
      setTypeLoading(false);
      setTypeError(null);
      return;
    }

    setIsSearching(false);
    setSearchQuery("");
    setSearchResult(null);
    setSearchError(null);

    const fetchId = ++typeFetchId.current;
    setTypeLoading(true);
    setTypeError(null);
    setTypePokemon([]);

    try {
      const typeData = await getPokemonByType(type);

      const detailResults = await Promise.allSettled(
        typeData.pokemon.map((p) => getPokemonDetails(p.name))
      );

      if (fetchId !== typeFetchId.current) return;

      const succeeded = detailResults
        .filter((r) => r.status === "fulfilled")
        .map((r) => r.value);

      setTypePokemon(succeeded);
      setTypeLoading(false);
    } catch (err) {
      if (fetchId !== typeFetchId.current) return;

      setTypeLoading(false);
      setTypeError(
        isApiError(err) ? err.message : "Failed to load Pokémon for this type"
      );
    }
  }

  const isTypeFiltering = selectedType !== "all";

  return (
    <div aria-busy={loading || searchLoading || typeLoading}>
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Explore Pokémon
        </h1>
        <p className="mt-2 text-slate-500">
          {isSearching
            ? `Search results for "${searchQuery}"`
            : isTypeFiltering
              ? typeLoading
                ? `Loading ${selectedType} Pokémon…`
                : `${typePokemon.length} ${selectedType} Pokémon`
              : <>Browse the complete Pokédex — {loading ? "..." : pokemon.length} Pokémon loaded</>}
        </p>
      </div>

      <SearchBar
        value={searchQuery}
        onChange={setSearchQuery}
        onSubmit={() => handleSearch(searchQuery)}
        onClear={handleClearSearch}
      />

      <TypeFilter
        selectedType={selectedType}
        onTypeChange={handleTypeChange}
      />

      {error && !isTypeFiltering && (
        <ErrorMessage
          title="Failed to load Pokémon"
          message={error}
          onRetry={() => {
            setPokemon([]);
            setLoading(true);
            setError(null);
          }}
        />
      )}

      {loading && !isTypeFiltering && (
        <PokemonGrid>
          {Array.from({ length: 20 }, (_, i) => (
            <PokemonSkeletonCard key={i} />
          ))}
        </PokemonGrid>
      )}

      {!loading && !error && !isSearching && !isTypeFiltering && pokemon.length > 0 && (
        <>
          <PokemonGrid pokemon={pokemon} />
          <LoadMoreButton
            onLoadMore={handleLoadMore}
            isLoading={loadingMore}
            hasMore={hasMore}
            loadedCount={pokemon.length}
            total={total}
          />
        </>
      )}

      {!loading && !error && !isSearching && !isTypeFiltering && pokemon.length === 0 && (
        <EmptyState
          title="No Pokémon found"
          description="The Pokédex came up empty."
        />
      )}

      {isSearching && searchLoading && (
        <PokemonGrid>
          <PokemonSkeletonCard />
        </PokemonGrid>
      )}

      {isSearching && searchResult && (
        <PokemonGrid pokemon={[searchResult]} />
      )}

      {isSearching && searchError === "not_found" && (
        <EmptyState
          icon={Search}
          title="Pokémon not found"
          description="Try searching for another Pokémon."
        />
      )}

      {isSearching && searchError === "api_error" && (
        <ErrorMessage
          title="Search failed"
          message="Something went wrong while searching. Please try again."
          onRetry={() => handleSearch(searchQuery)}
        />
      )}

      {isTypeFiltering && typeLoading && (
        <PokemonGrid>
          {Array.from({ length: 12 }, (_, i) => (
            <PokemonSkeletonCard key={i} />
          ))}
        </PokemonGrid>
      )}

      {isTypeFiltering && !typeLoading && typeError && (
        <ErrorMessage
          title="Failed to load Pokémon"
          message={typeError}
          onRetry={() => handleTypeChange(selectedType)}
        />
      )}

      {isTypeFiltering && !typeLoading && !typeError && typePokemon.length > 0 && (
        <PokemonGrid pokemon={typePokemon} />
      )}

      {isTypeFiltering && !typeLoading && !typeError && typePokemon.length === 0 && (
        <EmptyState
          icon={Search}
          title="No Pokémon found"
          description="There are no Pokémon available for this type."
        />
      )}
    </div>
  );
}
