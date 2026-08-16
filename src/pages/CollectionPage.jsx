import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import useFavorites from "../hooks/useFavorites";
import { getPokemonDetails } from "../services/pokeApi";
import PokemonGrid from "../components/pokemon/PokemonGrid";
import PokemonSkeletonCard from "../components/pokemon/PokemonSkeletonCard";
import EmptyState from "../components/ui/EmptyState";

export default function CollectionPage() {
  const { favorites, toggleFavorite, isFavorite } = useFavorites();
  const [pokemon, setPokemon] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (favorites.length === 0) {
      setPokemon([]);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    Promise.allSettled(
      favorites.map((name) => getPokemonDetails(name))
    )
      .then((results) => {
        if (cancelled) return;
        const succeeded = results
          .filter((r) => r.status === "fulfilled")
          .map((r) => r.value);
        setPokemon(succeeded);
        setLoading(false);
      })
      .catch(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [favorites]);

  return (
    <div>
      {/* Header */}
      <div className="animate-fade-in-up mb-8 text-center">
        <div className="mb-3 flex items-center justify-center gap-2">
          <Heart className="h-4 w-4 text-[var(--color-pokeball-red)]" />
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--color-pokedex-subtle)] dark:text-[var(--color-pokedex-dark-muted)]">
            My Favorites
          </span>
        </div>
        <h1 className="text-2xl font-extrabold uppercase tracking-wider text-[var(--color-pokedex-text)] sm:text-3xl dark:text-[var(--color-pokedex-dark-text)]">
          Your Pokémon
        </h1>
        <p className="mt-2 text-xs text-[var(--color-pokedex-muted)] dark:text-[var(--color-pokedex-dark-muted)]">
          {favorites.length === 0 && "Tap the heart icon on any Pokémon to add it to your favorites."}
        </p>
      </div>

      {/* Loading */}
      {loading && favorites.length > 0 && (
        <PokemonGrid>
          {Array.from({ length: Math.min(favorites.length, 12) }, (_, i) => (
            <PokemonSkeletonCard key={i} />
          ))}
        </PokemonGrid>
      )}

      {/* Empty */}
      {!loading && favorites.length === 0 && (
        <EmptyState
          icon={Heart}
          title="No favorites yet"
          description="Tap the heart icon on any Pokémon to add it here."
        />
      )}

      {/* Grid */}
      {!loading && pokemon.length > 0 && (
        <PokemonGrid
          pokemon={pokemon}
          isFavorite={isFavorite}
          onToggleFavorite={toggleFavorite}
        />
      )}
    </div>
  );
}
