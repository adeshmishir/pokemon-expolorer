import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Search, Heart } from "lucide-react";
import usePokemonDetails from "../hooks/usePokemonDetails";
import useFavorites from "../hooks/useFavorites";
import { getTypeColors } from "../utils/typeColors";
import { cn } from "../utils/cn";
import TypeBadge from "../components/pokemon/TypeBadge";
import LoadingSkeleton from "../components/ui/LoadingSkeleton";
import ErrorMessage from "../components/ui/ErrorMessage";
import EmptyState from "../components/ui/EmptyState";

const STAT_MAX = 255;
const STAT_LABELS = {
  hp: "HP",
  attack: "Attack",
  defense: "Defense",
  "special-attack": "Sp. Atk",
  "special-defense": "Sp. Def",
  speed: "Speed",
};
const STAT_COLORS = {
  hp: "bg-red-400",
  attack: "bg-orange-400",
  defense: "bg-yellow-400",
  "special-attack": "bg-blue-400",
  "special-defense": "bg-green-400",
  speed: "bg-pink-400",
};

function DetailSkeleton() {
  return (
    <div className="space-y-6">
      <LoadingSkeleton className="h-5 w-32" />
      <div className="rounded-lg border border-[var(--color-pokedex-border)] bg-[var(--color-pokedex-panel)] p-6 dark:border-[var(--color-pokedex-dark-border)] dark:bg-[var(--color-pokedex-dark-panel)]">
        <div className="flex flex-col items-center gap-6 md:flex-row md:items-start">
          <LoadingSkeleton className="h-48 w-48 rounded-full sm:h-64 sm:w-64" />
          <div className="flex-1 space-y-4">
            <LoadingSkeleton className="h-4 w-20" />
            <LoadingSkeleton className="h-8 w-48" />
            <div className="flex gap-2">
              <LoadingSkeleton className="h-6 w-16 rounded-md" />
              <LoadingSkeleton className="h-6 w-16 rounded-md" />
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <LoadingSkeleton className="h-24 rounded-lg" />
        <LoadingSkeleton className="h-24 rounded-lg" />
      </div>
      <LoadingSkeleton className="h-40 rounded-lg" />
      <LoadingSkeleton className="h-40 rounded-lg" />
      <LoadingSkeleton className="h-48 rounded-lg" />
    </div>
  );
}

function BackLink() {
  return (
    <Link
      to="/"
      className="group inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[var(--color-pokedex-muted)] transition-colors duration-150 hover:text-[var(--color-pokedex-text)] dark:text-[var(--color-pokedex-dark-muted)] dark:hover:text-[var(--color-pokedex-dark-text)]"
    >
      <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-150 group-hover:-translate-x-0.5" />
      Back to Pokédex
    </Link>
  );
}

export default function PokemonDetailPage() {
  const { name } = useParams();
  const { pokemon, loading, error, retry } = usePokemonDetails(name);
  const { isFavorite, toggleFavorite } = useFavorites();

  if (loading) {
    return (
      <div>
        <BackLink />
        <div className="mt-6">
          <DetailSkeleton />
        </div>
      </div>
    );
  }

  if (error === "not_found") {
    return (
      <div>
        <BackLink />
        <div className="mt-8">
          <EmptyState
            icon={Search}
            title="Pokémon not found"
            description="The Pokémon you're looking for doesn't exist."
          />
        </div>
      </div>
    );
  }

  if (error === "api_error") {
    return (
      <div>
        <BackLink />
        <div className="mt-6">
          <ErrorMessage
            title="Failed to load Pokémon"
            message="Something went wrong. Please try again."
            onRetry={retry}
          />
        </div>
      </div>
    );
  }

  const primaryType = pokemon.types[0] || "normal";
  const typeColors = getTypeColors(primaryType);
  const image = pokemon.sprites.officialArtwork || pokemon.sprites.default;
  const heightM = (pokemon.height / 10).toFixed(1);
  const weightKg = (pokemon.weight / 10).toFixed(1);
  const displayMoves = pokemon.moves.slice(0, 20);
  const formattedId = `#${String(pokemon.id).padStart(3, "0")}`;
  const favorited = isFavorite(pokemon.name);

  return (
    <div className="space-y-5">
      <BackLink />

      {/* Hero Card — Pokédex Entry */}
      <div className="animate-fade-in overflow-hidden rounded-lg border border-[var(--color-pokedex-border)] bg-[var(--color-pokedex-panel)] dark:border-[var(--color-pokedex-dark-border)] dark:bg-[var(--color-pokedex-dark-panel)]">
        {/* Type accent bar */}
        <div className={cn("h-1.5", typeColors.bg)} />

        <div className="flex flex-col items-center gap-6 p-6 sm:p-8 md:flex-row md:items-start">
          {/* Artwork */}
          <div className="relative shrink-0">
            <div className="absolute inset-0 rounded-full bg-[var(--color-pokedex-surface)] dark:bg-[var(--color-pokedex-dark-bg)]" />
            {image ? (
              <img
                src={image}
                alt={`${pokemon.name} official artwork`}
                className="relative h-48 w-48 object-contain sm:h-64 sm:w-64"
              />
            ) : (
              <div className="relative flex h-48 w-48 items-center justify-center rounded-full bg-[var(--color-pokedex-surface)] sm:h-64 sm:w-64 dark:bg-[var(--color-pokedex-dark-bg)]">
                <span className="text-5xl text-[var(--color-pokedex-subtle)] dark:text-[var(--color-pokedex-dark-muted)]">?</span>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="text-center md:text-left">
            {/* Registered badge + ID */}
            <div className="flex items-center gap-3 md:justify-start">
              <span className="text-xs font-bold tracking-wider text-[var(--color-pokedex-subtle)] dark:text-[var(--color-pokedex-dark-muted)]">
                {formattedId}
              </span>
              <span className="inline-flex items-center gap-1 rounded-md bg-green-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-green-700 dark:bg-green-900/30 dark:text-green-400">
                <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                Registered
              </span>
              <button
                onClick={() => toggleFavorite(pokemon.name)}
                aria-label={favorited ? `Unfavorite ${pokemon.name}` : `Favorite ${pokemon.name}`}
                className={cn(
                  "rounded-md p-1.5 transition-all duration-150 focus-visible:ring-2 focus-visible:ring-[var(--color-pokeball-red)]/50 focus-visible:ring-offset-2",
                  favorited
                    ? "text-[var(--color-pokeball-red)]"
                    : "text-[var(--color-pokedex-subtle)] hover:bg-[var(--color-pokedex-border)]/50 hover:text-[var(--color-pokedex-muted)] dark:text-[var(--color-pokedex-dark-muted)] dark:hover:bg-[var(--color-pokedex-dark-border)]/50"
                )}
              >
                <Heart
                  className="h-4 w-4"
                  fill={favorited ? "currentColor" : "none"}
                />
              </button>
            </div>

            {/* Name */}
            <h1 className="mt-2 text-2xl font-extrabold uppercase tracking-wider text-[var(--color-pokedex-text)] sm:text-3xl dark:text-[var(--color-pokedex-dark-text)]">
              {pokemon.name.replace(/-/g, " ")}
            </h1>

            {/* Types */}
            <div className="mt-3 flex flex-wrap justify-center gap-1.5 md:justify-start">
              {pokemon.types.map((type) => (
                <TypeBadge key={type} type={type} className="text-xs" />
              ))}
            </div>

            {/* Species */}
            <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-pokedex-subtle)] dark:text-[var(--color-pokedex-dark-muted)]">
              Species
            </p>
            <p className="mt-0.5 text-sm font-semibold text-[var(--color-pokedex-text)] dark:text-[var(--color-pokedex-dark-text)]">
              {pokemon.name.replace(/-/g, " ")} Pokémon
            </p>
          </div>
        </div>
      </div>

      {/* Physical Stats */}
      <div className="animate-fade-in grid grid-cols-2 gap-3 sm:gap-4" style={{ animationDelay: "0.05s" }}>
        <div className="rounded-lg border border-[var(--color-pokedex-border)] bg-[var(--color-pokedex-panel)] p-4 text-center dark:border-[var(--color-pokedex-dark-border)] dark:bg-[var(--color-pokedex-dark-panel)]">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-pokedex-subtle)] dark:text-[var(--color-pokedex-dark-muted)]">Height</p>
          <p className="mt-1 text-xl font-extrabold text-[var(--color-pokedex-text)] dark:text-[var(--color-pokedex-dark-text)]">{heightM}<span className="text-xs font-semibold text-[var(--color-pokedex-muted)] dark:text-[var(--color-pokedex-dark-muted)]"> m</span></p>
        </div>
        <div className="rounded-lg border border-[var(--color-pokedex-border)] bg-[var(--color-pokedex-panel)] p-4 text-center dark:border-[var(--color-pokedex-dark-border)] dark:bg-[var(--color-pokedex-dark-panel)]">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-pokedex-subtle)] dark:text-[var(--color-pokedex-dark-muted)]">Weight</p>
          <p className="mt-1 text-xl font-extrabold text-[var(--color-pokedex-text)] dark:text-[var(--color-pokedex-dark-text)]">{weightKg}<span className="text-xs font-semibold text-[var(--color-pokedex-muted)] dark:text-[var(--color-pokedex-dark-muted)]"> kg</span></p>
        </div>
      </div>

      {/* Base Stats */}
      <div className="animate-fade-in rounded-lg border border-[var(--color-pokedex-border)] bg-[var(--color-pokedex-panel)] p-5 sm:p-6 dark:border-[var(--color-pokedex-dark-border)] dark:bg-[var(--color-pokedex-dark-panel)]" style={{ animationDelay: "0.1s" }}>
        <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--color-pokedex-subtle)] dark:text-[var(--color-pokedex-dark-muted)]">
          Base Stats
        </h2>
        <div className="mt-4 space-y-2.5">
          {pokemon.stats.map((s) => {
            const pct = Math.min((s.base / STAT_MAX) * 100, 100);
            return (
              <div key={s.name} className="flex items-center gap-3">
                <span className="w-16 shrink-0 text-right text-[10px] font-bold uppercase tracking-wider text-[var(--color-pokedex-muted)] sm:w-20 sm:text-xs dark:text-[var(--color-pokedex-dark-muted)]">
                  {STAT_LABELS[s.name] || s.name}
                </span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-[var(--color-pokedex-surface)] dark:bg-[var(--color-pokedex-dark-bg)]">
                  <div
                    className={`h-full rounded-full stat-bar-fill ${STAT_COLORS[s.name] || "bg-[var(--color-pokedex-subtle)]"}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="w-10 shrink-0 text-right text-xs font-bold text-[var(--color-pokedex-text)] dark:text-[var(--color-pokedex-dark-text)]">
                  {s.base}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Abilities */}
      <div className="animate-fade-in rounded-lg border border-[var(--color-pokedex-border)] bg-[var(--color-pokedex-panel)] p-5 sm:p-6 dark:border-[var(--color-pokedex-dark-border)] dark:bg-[var(--color-pokedex-dark-panel)]" style={{ animationDelay: "0.15s" }}>
        <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--color-pokedex-subtle)] dark:text-[var(--color-pokedex-dark-muted)]">
          Abilities
        </h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {pokemon.abilities.map((a) => (
            <span
              key={a.name}
              className={cn(
                "inline-flex items-center rounded-md px-3 py-1.5 text-xs font-semibold capitalize",
                a.isHidden
                  ? "border border-dashed border-[var(--color-pokedex-border)] bg-[var(--color-pokedex-surface)] text-[var(--color-pokedex-muted)] dark:border-[var(--color-pokedex-dark-border)] dark:bg-[var(--color-pokedex-dark-bg)] dark:text-[var(--color-pokedex-dark-muted)]"
                  : "border border-[var(--color-pokedex-border)] bg-[var(--color-pokedex-surface)] text-[var(--color-pokedex-text)] dark:border-[var(--color-pokedex-dark-border)] dark:bg-[var(--color-pokedex-dark-bg)] dark:text-[var(--color-pokedex-dark-text)]"
              )}
            >
              {a.name.replace(/-/g, " ")}
              {a.isHidden && <span className="ml-1.5 text-[10px] text-[var(--color-pokedex-subtle)] dark:text-[var(--color-pokedex-dark-muted)]">(hidden)</span>}
            </span>
          ))}
        </div>
      </div>

      {/* Moves */}
      <div className="animate-fade-in rounded-lg border border-[var(--color-pokedex-border)] bg-[var(--color-pokedex-panel)] p-5 sm:p-6 dark:border-[var(--color-pokedex-dark-border)] dark:bg-[var(--color-pokedex-dark-panel)]" style={{ animationDelay: "0.2s" }}>
        <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--color-pokedex-subtle)] dark:text-[var(--color-pokedex-dark-muted)]">
          Moves
        </h2>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {displayMoves.map((move) => (
            <span
              key={move}
              className="rounded-md border border-[var(--color-pokedex-border)] bg-[var(--color-pokedex-surface)] px-2.5 py-1 text-xs font-medium capitalize text-[var(--color-pokedex-muted)] dark:border-[var(--color-pokedex-dark-border)] dark:bg-[var(--color-pokedex-dark-bg)] dark:text-[var(--color-pokedex-dark-muted)]"
            >
              {move.replace(/-/g, " ")}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
