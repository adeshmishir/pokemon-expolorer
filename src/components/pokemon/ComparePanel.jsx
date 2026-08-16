import { X } from "lucide-react";
import TypeBadge from "./TypeBadge";

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

function getStat(pokemon, name) {
  return pokemon.stats?.find((s) => s.name === name)?.base ?? 0;
}

function StatRow({ pokemon, statName, isHigher }) {
  const val = getStat(pokemon, statName);
  return (
    <div className="flex items-center gap-3 px-6 py-3">
      <span className="w-16 shrink-0 text-right text-xs font-medium text-slate-500 sm:w-20 sm:text-sm">
        {STAT_LABELS[statName]}
      </span>
      <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-slate-100">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            isHigher
              ? "bg-green-400"
              : STAT_COLORS[statName] || "bg-slate-400"
          }`}
          style={{ width: `${(val / STAT_MAX) * 100}%` }}
        />
      </div>
      <span
        className={`w-8 shrink-0 text-right text-sm font-bold ${
          isHigher ? "text-green-600" : "text-slate-700"
        }`}
      >
        {val}
      </span>
    </div>
  );
}

export default function ComparePanel({ pokemon, onClose }) {
  if (!pokemon || pokemon.length === 0) return null;

  const [a, b] = pokemon;

  return (
    <div
      role="dialog"
      aria-label="Compare Pokémon"
      className="animate-fade-in mb-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
    >
      <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-6 py-3">
        <h2 className="text-lg font-bold text-slate-800">Compare Pokémon</h2>
        <button
          onClick={onClose}
          aria-label="Close comparison"
          className="rounded-full p-1 text-slate-400 transition-colors hover:bg-slate-200 hover:text-slate-600 focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Header row: images + names */}
      <div className="grid grid-cols-2">
        {[a, b].map((p) => {
          const img = p.sprites?.officialArtwork || p.sprites?.default;
          return (
            <div
              key={p.id}
              className="flex flex-col items-center gap-2 border-b border-slate-100 p-6"
            >
              {img ? (
                <img
                  src={img}
                  alt={p.name}
                  className="h-24 w-24 object-contain"
                />
              ) : (
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-slate-100">
                  <span className="text-3xl text-slate-300">?</span>
                </div>
              )}
              <div className="text-center">
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                  #{String(p.id).padStart(3, "0")}
                </p>
                <h3 className="text-lg font-bold capitalize text-slate-800">
                  {p.name?.replace(/-/g, " ")}
                </h3>
              </div>
              <div className="flex gap-1.5">
                {p.types?.map((type) => (
                  <TypeBadge key={type} type={type} />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Stat rows */}
      {Object.keys(STAT_LABELS).map((statName) => {
        const valA = getStat(a, statName);
        const valB = getStat(b, statName);
        return (
          <div key={statName} className="grid grid-cols-2 border-b border-slate-100 last:border-b-0">
            <StatRow pokemon={a} statName={statName} isHigher={valA > valB} />
            <StatRow pokemon={b} statName={statName} isHigher={valB > valA} />
          </div>
        );
      })}
    </div>
  );
}
