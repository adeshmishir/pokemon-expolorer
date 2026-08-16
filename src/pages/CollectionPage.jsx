import { useState, useEffect } from "react";
import { Heart, BookOpen, Star } from "lucide-react";
import useFavorites from "../hooks/useFavorites";
import { getPokemonDetails } from "../services/pokeApi";
import PokemonGrid from "../components/pokemon/PokemonGrid";
import PokemonSkeletonCard from "../components/pokemon/PokemonSkeletonCard";
import EmptyState from "../components/ui/EmptyState";
import AnimatedBackground from "../components/backgrounds/AnimatedBackground";

const TOTAL_POKEMON = 1010;

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

  const completionPct = Math.round((favorites.length / TOTAL_POKEMON) * 100);

  return (
    <div>
      <AnimatedBackground />

      <div className="relative">
        {/* ─── Header ─── */}
        <div className="animate-fade-in-up mb-8 text-center">
          <div className="mb-4 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-red-100 to-pink-100 dark:from-red-900/30 dark:to-pink-900/30">
              <BookOpen className="h-7 w-7 text-[var(--color-pokeball-red)]" />
            </div>
          </div>
          <h1 className="text-2xl font-extrabold uppercase tracking-wider text-[var(--color-pokedex-text)] sm:text-3xl dark:text-[var(--color-pokedex-dark-text)]">
            My Pokédex
          </h1>
          <p className="mt-2 text-xs text-[var(--color-pokedex-muted)] dark:text-[var(--color-pokedex-dark-muted)]">
            {favorites.length === 0
              ? "Tap the heart icon on any Pokémon to add it here."
              : `${favorites.length} of ${TOTAL_POKEMON} Pokémon discovered`}
          </p>

          {/* Progress bar */}
          {favorites.length > 0 && (
            <div className="mx-auto mt-4 max-w-xs">
              <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-[var(--color-pokedex-subtle)] dark:text-[var(--color-pokedex-dark-muted)]">
                <span>Completion</span>
                <span>{completionPct}%</span>
              </div>
              <div className="mt-1 h-2.5 overflow-hidden rounded-full bg-[var(--color-pokedex-surface)] dark:bg-[var(--color-pokedex-dark-bg)]">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[var(--color-pokeball-red)] to-pink-500 transition-all duration-500"
                  style={{ width: `${completionPct}%` }}
                />
              </div>
            </div>
          )}

          {/* Category badges */}
          {favorites.length > 0 && (
            <div className="mt-4 flex items-center justify-center gap-3">
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--color-pokedex-surface)] px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[var(--color-pokedex-muted)] dark:bg-[var(--color-pokedex-dark-bg)] dark:text-[var(--color-pokedex-dark-muted)]">
                <Heart className="h-3 w-3 text-[var(--color-pokeball-red)]" />
                {favorites.length} Favorites
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--color-pokedex-surface)] px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[var(--color-pokedex-muted)] dark:bg-[var(--color-pokedex-dark-bg)] dark:text-[var(--color-pokedex-dark-muted)]">
                <Star className="h-3 w-3 text-[var(--color-pokemon-yellow)]" />
                {completionPct}% Complete
              </span>
            </div>
          )}
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
    </div>
  );
}
