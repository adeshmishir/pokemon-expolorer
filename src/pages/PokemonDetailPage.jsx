import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Search } from "lucide-react";
import { getPokemonDetails } from "../services/pokeApi";
import { isApiError } from "../utils/errors";
import { getTypeColors } from "../utils/typeColors";
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
      <LoadingSkeleton className="h-6 w-32" />
      <div className="flex flex-col items-center gap-6 md:flex-row md:items-start">
        <LoadingSkeleton className="h-48 w-48 rounded-full sm:h-64 sm:w-64" />
        <div className="flex-1 space-y-4">
          <LoadingSkeleton className="h-8 w-48" />
          <LoadingSkeleton className="h-5 w-24" />
          <div className="flex gap-2">
            <LoadingSkeleton className="h-7 w-20 rounded-full" />
            <LoadingSkeleton className="h-7 w-20 rounded-full" />
          </div>
        </div>
      </div>
      <LoadingSkeleton className="h-48 w-full" />
      <LoadingSkeleton className="h-32 w-full" />
      <LoadingSkeleton className="h-64 w-full" />
    </div>
  );
}

export default function PokemonDetailPage() {
  const { name } = useParams();
  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    setError(null);
    setPokemon(null);

    getPokemonDetails(name)
      .then((data) => {
        if (!cancelled) setPokemon(data);
      })
      .catch((err) => {
        if (!cancelled) {
          if (isApiError(err) && err.status === 404) {
            setError("not_found");
          } else {
            setError("api_error");
          }
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [name, retryKey]);

  if (loading) {
    return (
      <div>
        <Link
          to="/"
          className="inline-flex items-center gap-1 text-sm font-medium text-slate-500 transition-colors hover:text-slate-800"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to list
        </Link>
        <div className="mt-6">
          <DetailSkeleton />
        </div>
      </div>
    );
  }

  if (error === "not_found") {
    return (
      <div>
        <Link
          to="/"
          className="inline-flex items-center gap-1 text-sm font-medium text-slate-500 transition-colors hover:text-slate-800"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to list
        </Link>
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
        <Link
          to="/"
          className="inline-flex items-center gap-1 text-sm font-medium text-slate-500 transition-colors hover:text-slate-800"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to list
        </Link>
        <div className="mt-6">
          <ErrorMessage
            title="Failed to load Pokémon"
            message="Something went wrong. Please try again."
            onRetry={() => setRetryKey((k) => k + 1)}
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

  return (
    <div>
      <Link
        to="/"
        className="inline-flex items-center gap-1 text-sm font-medium text-slate-500 transition-colors hover:text-slate-800"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to list
      </Link>

      {/* Hero */}
      <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className={`h-2 ${typeColors.bg}`} />
        <div className="flex flex-col items-center gap-6 p-6 md:flex-row md:items-start md:p-8">
          <div className="relative h-48 w-48 shrink-0 sm:h-64 sm:w-64">
            <div className="absolute inset-0 rounded-full bg-slate-50" />
            {image ? (
              <img
                src={image}
                alt={`${pokemon.name} official artwork`}
                className="relative h-full w-full object-contain"
              />
            ) : (
              <div className="relative flex h-full w-full items-center justify-center rounded-full bg-slate-100">
                <span className="text-6xl text-slate-300">?</span>
              </div>
            )}
          </div>

          <div className="text-center md:text-left">
            <p className="text-sm font-semibold uppercase tracking-widest text-slate-400">
              {formattedId}
            </p>
            <h1 className="mt-1 text-3xl font-bold capitalize tracking-tight text-slate-900 sm:text-4xl">
              {pokemon.name.replace(/-/g, " ")}
            </h1>
            <div className="mt-3 flex flex-wrap justify-center gap-2 md:justify-start">
              {pokemon.types.map((type) => (
                <TypeBadge key={type} type={type} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Physical Info */}
      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5 text-center shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Height</p>
          <p className="mt-1 text-2xl font-bold text-slate-800">{heightM} m</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 text-center shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Weight</p>
          <p className="mt-1 text-2xl font-bold text-slate-800">{weightKg} kg</p>
        </div>
      </div>

      {/* Abilities */}
      <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-800">Abilities</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {pokemon.abilities.map((a) => (
            <span
              key={a.name}
              className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium capitalize ${
                a.isHidden
                  ? "border border-dashed border-slate-300 bg-slate-50 text-slate-500"
                  : "border border-slate-200 bg-slate-100 text-slate-700"
              }`}
            >
              {a.name.replace(/-/g, " ")}
              {a.isHidden && <span className="ml-1.5 text-xs text-slate-400">(hidden)</span>}
            </span>
          ))}
        </div>
      </div>

      {/* Base Stats */}
      <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-800">Base Stats</h2>
        <div className="mt-4 space-y-3">
          {pokemon.stats.map((s) => {
            const pct = Math.min((s.base / STAT_MAX) * 100, 100);
            return (
              <div key={s.name} className="flex items-center gap-3">
                <span className="w-20 shrink-0 text-right text-xs font-medium text-slate-600 sm:w-24 sm:text-sm">
                  {STAT_LABELS[s.name] || s.name}
                </span>
                <div className="h-3 flex-1 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${STAT_COLORS[s.name] || "bg-slate-400"}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="w-10 shrink-0 text-right text-sm font-bold text-slate-800">
                  {s.base}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Moves */}
      <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-800">Moves</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {displayMoves.map((move) => (
            <span
              key={move}
              className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-sm font-medium capitalize text-slate-600"
            >
              {move.replace(/-/g, " ")}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
