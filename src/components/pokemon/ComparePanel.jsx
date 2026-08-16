import { X } from "lucide-react";
import TypeBadge from "./TypeBadge";

const STAT_MAX = 255;
const STAT_LABELS = {
  hp: "HP",
  attack: "ATK",
  defense: "DEF",
  "special-attack": "SPA",
  "special-defense": "SPD",
  speed: "SPE",
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
    <div className="flex items-center gap-2 px-3 py-2 sm:px-5">
      <span className="w-10 shrink-0 text-right text-[10px] font-bold uppercase tracking-wider text-[var(--color-pokedex-subtle)] sm:w-12 sm:text-xs dark:text-[var(--color-pokedex-dark-muted)]">
        {STAT_LABELS[statName]}
      </span>
      <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-[var(--color-pokedex-surface)] dark:bg-[var(--color-pokedex-dark-bg)]">
        <div
          className={`h-full rounded-full stat-bar-fill ${
            isHigher
              ? "bg-green-500"
              : STAT_COLORS[statName] || "bg-[var(--color-pokedex-subtle)]"
          }`}
          style={{ width: `${(val / STAT_MAX) * 100}%` }}
        />
      </div>
      <span
        className={`w-8 shrink-0 text-right text-xs font-bold ${
          isHigher ? "text-green-600 dark:text-green-400" : "text-[var(--color-pokedex-text)] dark:text-[var(--color-pokedex-dark-text)]"
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
      className="animate-fade-in mb-8 overflow-hidden rounded-xl border border-[var(--color-pokedex-border)] bg-[var(--color-pokedex-panel)] dark:border-[var(--color-pokedex-dark-border)] dark:bg-[var(--color-pokedex-dark-panel)]"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[var(--color-pokedex-border)] px-4 py-3 dark:border-[var(--color-pokedex-dark-border)]">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-pokedex-subtle)] dark:text-[var(--color-pokedex-dark-muted)]">
            Battle Lab
          </span>
          <span className="rounded-md bg-[var(--color-pokeball-red)]/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[var(--color-pokeball-red)]">
            VS
          </span>
        </div>
        <button
          onClick={onClose}
          aria-label="Close comparison"
          className="rounded-md p-1 text-[var(--color-pokedex-subtle)] transition-colors hover:bg-[var(--color-pokedex-border)]/50 hover:text-[var(--color-pokedex-text)] focus-visible:ring-2 focus-visible:ring-[var(--color-pokeball-red)]/50 dark:text-[var(--color-pokedex-dark-muted)] dark:hover:bg-[var(--color-pokedex-dark-border)]/50 dark:hover:text-[var(--color-pokedex-dark-text)]"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Pokémon headers */}
      <div className="grid grid-cols-2">
        {[a, b].map((p, i) => {
          const img = p.sprites?.officialArtwork || p.sprites?.default;
          return (
            <div
              key={p.id}
              className={`flex flex-col items-center gap-2 border-b border-[var(--color-pokedex-border)] p-4 sm:p-6 ${
                i === 0 ? "border-r" : ""
              } dark:border-[var(--color-pokedex-dark-border)]`}
            >
              {img ? (
                <img
                  src={img}
                  alt={p.name}
                  className="h-20 w-20 object-contain sm:h-24 sm:w-24"
                />
              ) : (
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[var(--color-pokedex-surface)] dark:bg-[var(--color-pokedex-dark-bg)]">
                  <span className="text-2xl text-[var(--color-pokedex-subtle)]">?</span>
                </div>
              )}
              <div className="text-center">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-pokedex-subtle)] dark:text-[var(--color-pokedex-dark-muted)]">
                  #{String(p.id).padStart(3, "0")}
                </p>
                <h3 className="text-sm font-extrabold uppercase tracking-wider text-[var(--color-pokedex-text)] dark:text-[var(--color-pokedex-dark-text)]">
                  {p.name?.replace(/-/g, " ")}
                </h3>
              </div>
              <div className="flex gap-1">
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
          <div key={statName} className="grid grid-cols-2 border-b border-[var(--color-pokedex-border)] last:border-b-0 dark:border-[var(--color-pokedex-dark-border)]">
            <StatRow pokemon={a} statName={statName} isHigher={valA > valB} />
            <StatRow pokemon={b} statName={statName} isHigher={valB > valA} />
          </div>
        );
      })}
    </div>
  );
}
