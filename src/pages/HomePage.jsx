import { useState, useEffect } from "react";
import { getPokemonList, getPokemonDetails } from "../services/pokeApi";
import { isApiError } from "../utils/errors";
import PokemonGrid from "../components/pokemon/PokemonGrid";
import PokemonSkeletonCard from "../components/pokemon/PokemonSkeletonCard";
import ErrorMessage from "../components/ui/ErrorMessage";

export default function HomePage() {
  const [pokemon, setPokemon] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  return (
    <div aria-busy={loading}>
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Explore Pokémon
        </h1>
        <p className="mt-2 text-slate-500">
          Browse the complete Pokédex — {loading ? "..." : pokemon.length} Pokémon loaded
        </p>
      </div>

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

      {!loading && !error && pokemon.length > 0 && (
        <PokemonGrid pokemon={pokemon} />
      )}

      {!loading && !error && pokemon.length === 0 && (
        <ErrorMessage title="No Pokémon found" message="The Pokédex came up empty." />
      )}
    </div>
  );
}
