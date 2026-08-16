import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { getPokemonList, getPokemonDetails } from "../services/pokeApi";
import { isApiError } from "../utils/errors";
import PokemonGrid from "../components/pokemon/PokemonGrid";
import PokemonSkeletonCard from "../components/pokemon/PokemonSkeletonCard";
import SearchBar from "../components/pokemon/SearchBar";
import ErrorMessage from "../components/ui/ErrorMessage";

export default function HomePage() {
  const [pokemon, setPokemon] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

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

  function handleSearch(query) {
    const trimmed = query.trim();
    if (!trimmed) return;

    const normalized = trimmed.toLowerCase();
    setSearchQuery(normalized);
    setIsSearching(true);
    setSearchLoading(true);
    setSearchError(null);
    setSearchResult(null);

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
  }

  return (
    <div aria-busy={loading || searchLoading}>
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Explore Pokémon
        </h1>
        <p className="mt-2 text-slate-500">
          {isSearching
            ? `Search results for "${searchQuery}"`
            : <>Browse the complete Pokédex — {loading ? "..." : pokemon.length} Pokémon loaded</>}
        </p>
      </div>

      <SearchBar
        value={searchQuery}
        onChange={setSearchQuery}
        onSubmit={() => handleSearch(searchQuery)}
        onClear={handleClearSearch}
      />

      {error && (
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

      {loading && (
        <PokemonGrid>
          {Array.from({ length: 20 }, (_, i) => (
            <PokemonSkeletonCard key={i} />
          ))}
        </PokemonGrid>
      )}

      {!loading && !error && !isSearching && pokemon.length > 0 && (
        <PokemonGrid pokemon={pokemon} />
      )}

      {!loading && !error && !isSearching && pokemon.length === 0 && (
        <ErrorMessage title="No Pokémon found" message="The Pokédex came up empty." />
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
        <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center">
          <Search className="h-10 w-10 text-slate-300" />
          <p className="text-base font-semibold text-slate-800">Pokémon not found</p>
          <p className="text-sm text-slate-500">
            Try searching for another Pokémon.
          </p>
        </div>
      )}

      {isSearching && searchError === "api_error" && (
        <ErrorMessage
          title="Search failed"
          message="Something went wrong while searching. Please try again."
          onRetry={() => handleSearch(searchQuery)}
        />
      )}
    </div>
  );
}
