import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Search, Heart, Shield, Zap, Scale, Ruler, Sparkles } from "lucide-react";
import usePokemonDetails from "../hooks/usePokemonDetails";
import useFavorites from "../hooks/useFavorites";
import { getTypeColors, TYPE_CHART } from "../utils/typeColors";
import { cn } from "../utils/cn";
import TypeBadge from "../components/pokemon/TypeBadge";
import LoadingSkeleton from "../components/ui/LoadingSkeleton";
import ErrorMessage from "../components/ui/ErrorMessage";
import EmptyState from "../components/ui/EmptyState";
import PokedexScanBackground from "../components/backgrounds/PokedexScanBackground";

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

const TOTAL_POKEMON = 1010;

function getWeaknesses(types) {
  if (!TYPE_CHART || types.length === 0) return [];
  const weaknesses = new Set();
  for (const attackType of Object.keys(TYPE_CHART)) {
    let multiplier = 1;
    for (const defType of types) {
      const chart = TYPE_CHART[attackType];
      if (chart && chart[defType] !== undefined) {
        multiplier *= chart[defType];
      }
    }
    if (multiplier > 1) weaknesses.add(attackType);
  }
  return [...weaknesses];
}

function getStrengths(types) {
  if (!TYPE_CHART || types.length === 0) return [];
  const strengths = new Set();
  for (const attackType of Object.keys(TYPE_CHART)) {
    for (const defType of types) {
      const chart = TYPE_CHART[attackType];
      if (chart && chart[defType] !== undefined && chart[defType] > 1) {
        strengths.add(attackType);
      }
    }
  }
  return [...strengths];
}

function DetailSkeleton() {
  return (
    <div className="space-y-6">
      <LoadingSkeleton className="h-5 w-32" />
      <div className="rounded-xl border border-[var(--color-pokedex-border)] bg-[var(--color-pokedex-panel)] p-6 dark:border-[var(--color-pokedex-dark-border)] dark:bg-[var(--color-pokedex-dark-panel)]">
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
        <LoadingSkeleton className="h-24 rounded-xl" />
        <LoadingSkeleton className="h-24 rounded-xl" />
      </div>
      <LoadingSkeleton className="h-48 rounded-xl" />
      <LoadingSkeleton className="h-40 rounded-xl" />
      <LoadingSkeleton className="h-48 rounded-xl" />
    </div>
  );
}

function ScanningOverlay({ pokemonId, name }) {
  const [phase, setPhase] = useState("scanning");
  useEffect(() => {
    const timer = setTimeout(() => setPhase("found"), 1800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="animate-fade-in flex flex-col items-center gap-3 py-6">
      {phase === "scanning" ? (
        <>
          <div className="animate-pokeball-spin relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border-2 border-[var(--color-pokedex-text)] dark:border-[var(--color-pokedex-dark-text)]">
            <span className="absolute inset-x-0 top-0 h-1/2 bg-[var(--color-pokeball-red)]" />
            <span className="absolute inset-x-0 top-1/2 h-[2px] bg-[var(--color-pokedex-text)] dark:bg-[var(--color-pokedex-dark-text)]" />
            <span className="absolute inset-0 m-auto h-3 w-3 rounded-full border-2 border-[var(--color-pokedex-text)] bg-[var(--color-pokedex-panel)] dark:border-[var(--color-pokedex-dark-text)] dark:bg-[var(--color-pokedex-dark-surface)]" />
          </div>
          <p className="animate-pulse-subtle text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-pokedex-subtle)] dark:text-[var(--color-pokedex-dark-muted)]">
            Scanning Pokédex...
          </p>
        </>
      ) : (
        <>
          <div className="animate-bounce-in text-center">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-green-600 dark:text-green-400">
              Pokémon Found!
            </p>
            <p className="mt-1 text-lg font-extrabold uppercase tracking-wider text-[var(--color-pokedex-text)] dark:text-[var(--color-pokedex-dark-text)]">
              #{String(pokemonId).padStart(3, "0")} {name}
            </p>
          </div>
        </>
      )}
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
  const [showScanning, setShowScanning] = useState(true);

  useEffect(() => {
    if (!loading && pokemon) {
      const timer = setTimeout(() => setShowScanning(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [loading, pokemon]);

  if (loading) {
    return (
      <div>
        <PokedexScanBackground />
        <div className="relative">
          <BackLink />
          <div className="mt-6">
            <DetailSkeleton />
          </div>
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
  const weaknesses = getWeaknesses(pokemon.types);
  const strengths = getStrengths(pokemon.types);
  const completionPct = Math.round((pokemon.id / TOTAL_POKEMON) * 100);

  return (
    <div>
      <PokedexScanBackground />

      <div className="relative space-y-5">
        <BackLink />

        {/* Scanning Overlay */}
        {showScanning && (
          <ScanningOverlay pokemonId={pokemon.id} name={pokemon.name.replace(/-/g, " ")} />
        )}

        {/* ─── Hero Card — Pokédex Entry ─── */}
        <div
          className={cn(
            "animate-fade-in overflow-hidden rounded-xl border bg-[var(--color-pokedex-panel)] dark:bg-[var(--color-pokedex-dark-panel)]",
            showScanning ? "border-[var(--color-pokedex-border)] opacity-50 dark:border-[var(--color-pokedex-dark-border)]" : "border-[var(--color-pokedex-border)] dark:border-[var(--color-pokedex-dark-border)]"
          )}
        >
          {/* Type accent bar */}
          <div className={cn("h-2", typeColors.bg)} />

          {/* Type-colored gradient background */}
          <div
            className="absolute inset-0 opacity-[0.05] dark:opacity-[0.08]"
            style={{
              background: `linear-gradient(135deg, ${typeColors.hex || "#e2e5e9"} 0%, transparent 60%)`,
            }}
          />

          <div className="relative flex flex-col items-center gap-6 p-6 sm:p-8 md:flex-row md:items-start">
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
                <span className="text-[10px] font-bold text-[var(--color-pokedex-subtle)] dark:text-[var(--color-pokedex-dark-muted)]">
                  {completionPct}% Pokédex
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

        {/* ─── Physical Stats ─── */}
        <div className="animate-fade-in grid grid-cols-2 gap-3 sm:gap-4" style={{ animationDelay: "0.05s" }}>
          <div className="flex items-center gap-3 rounded-xl border border-[var(--color-pokedex-border)] bg-[var(--color-pokedex-panel)] p-4 dark:border-[var(--color-pokedex-dark-border)] dark:bg-[var(--color-pokedex-dark-panel)]">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-900/30">
              <Ruler className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-pokedex-subtle)] dark:text-[var(--color-pokedex-dark-muted)]">Height</p>
              <p className="text-lg font-extrabold text-[var(--color-pokedex-text)] dark:text-[var(--color-pokedex-dark-text)]">{heightM}<span className="text-xs font-semibold text-[var(--color-pokedex-muted)] dark:text-[var(--color-pokedex-dark-muted)]"> m</span></p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-[var(--color-pokedex-border)] bg-[var(--color-pokedex-panel)] p-4 dark:border-[var(--color-pokedex-dark-border)] dark:bg-[var(--color-pokedex-dark-panel)]">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-orange-50 dark:bg-orange-900/30">
              <Scale className="h-5 w-5 text-orange-500" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-pokedex-subtle)] dark:text-[var(--color-pokedex-dark-muted)]">Weight</p>
              <p className="text-lg font-extrabold text-[var(--color-pokedex-text)] dark:text-[var(--color-pokedex-dark-text)]">{weightKg}<span className="text-xs font-semibold text-[var(--color-pokedex-muted)] dark:text-[var(--color-pokedex-dark-muted)]"> kg</span></p>
            </div>
          </div>
        </div>

        {/* ─── Weaknesses & Strengths ─── */}
        {(weaknesses.length > 0 || strengths.length > 0) && (
          <div className="animate-fade-in grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4" style={{ animationDelay: "0.08s" }}>
            {weaknesses.length > 0 && (
              <div className="rounded-xl border border-red-200/60 bg-red-50/40 p-4 dark:border-red-900/30 dark:bg-red-950/20">
                <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-red-600 dark:text-red-400">
                  Weak to
                </p>
                <div className="flex flex-wrap gap-1">
                  {weaknesses.map((t) => (
                    <TypeBadge key={t} type={t} className="text-[10px]" />
                  ))}
                </div>
              </div>
            )}
            {strengths.length > 0 && (
              <div className="rounded-xl border border-green-200/60 bg-green-50/40 p-4 dark:border-green-900/30 dark:bg-green-950/20">
                <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-green-600 dark:text-green-400">
                  Strong against
                </p>
                <div className="flex flex-wrap gap-1">
                  {strengths.map((t) => (
                    <TypeBadge key={t} type={t} className="text-[10px]" />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ─── Base Stats ─── */}
        <div className="animate-fade-in rounded-xl border border-[var(--color-pokedex-border)] bg-[var(--color-pokedex-panel)] p-5 sm:p-6 dark:border-[var(--color-pokedex-dark-border)] dark:bg-[var(--color-pokedex-dark-panel)]" style={{ animationDelay: "0.1s" }}>
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-[var(--color-pokemon-yellow)]" />
            <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--color-pokedex-subtle)] dark:text-[var(--color-pokedex-dark-muted)]">
              Base Stats
            </h2>
          </div>
          <div className="mt-4 space-y-2.5">
            {pokemon.stats.map((s) => {
              const pct = Math.min((s.base / STAT_MAX) * 100, 100);
              return (
                <div key={s.name} className="flex items-center gap-3">
                  <span className="w-16 shrink-0 text-right text-[10px] font-bold uppercase tracking-wider text-[var(--color-pokedex-muted)] sm:w-20 sm:text-xs dark:text-[var(--color-pokedex-dark-muted)]">
                    {STAT_LABELS[s.name] || s.name}
                  </span>
                  <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-[var(--color-pokedex-surface)] dark:bg-[var(--color-pokedex-dark-bg)]">
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
          {/* Total */}
          <div className="mt-3 flex items-center justify-end gap-2 border-t border-[var(--color-pokedex-border)] pt-3 dark:border-[var(--color-pokedex-dark-border)]">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-pokedex-subtle)] dark:text-[var(--color-pokedex-dark-muted)]">Total</span>
            <span className="text-sm font-extrabold text-[var(--color-pokedex-text)] dark:text-[var(--color-pokedex-dark-text)]">
              {pokemon.stats.reduce((sum, s) => sum + s.base, 0)}
            </span>
          </div>
        </div>

        {/* ─── Abilities ─── */}
        <div className="animate-fade-in rounded-xl border border-[var(--color-pokedex-border)] bg-[var(--color-pokedex-panel)] p-5 sm:p-6 dark:border-[var(--color-pokedex-dark-border)] dark:bg-[var(--color-pokedex-dark-panel)]" style={{ animationDelay: "0.15s" }}>
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-[var(--color-pokemon-purple)]" />
            <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--color-pokedex-subtle)] dark:text-[var(--color-pokedex-dark-muted)]">
              Abilities
            </h2>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {pokemon.abilities.map((a) => (
              <span
                key={a.name}
                className={cn(
                  "inline-flex items-center rounded-lg px-3 py-1.5 text-xs font-semibold capitalize",
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

        {/* ─── Moves ─── */}
        <div className="animate-fade-in rounded-xl border border-[var(--color-pokedex-border)] bg-[var(--color-pokedex-panel)] p-5 sm:p-6 dark:border-[var(--color-pokedex-dark-border)] dark:bg-[var(--color-pokedex-dark-panel)]" style={{ animationDelay: "0.2s" }}>
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-[var(--color-pokemon-blue)]" />
            <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--color-pokedex-subtle)] dark:text-[var(--color-pokedex-dark-muted)]">
              Moves
            </h2>
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {displayMoves.map((move) => (
              <span
                key={move}
                className="rounded-lg border border-[var(--color-pokedex-border)] bg-[var(--color-pokedex-surface)] px-2.5 py-1 text-xs font-medium capitalize text-[var(--color-pokedex-muted)] dark:border-[var(--color-pokedex-dark-border)] dark:bg-[var(--color-pokedex-dark-bg)] dark:text-[var(--color-pokedex-dark-muted)]"
              >
                {move.replace(/-/g, " ")}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
