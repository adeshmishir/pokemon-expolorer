import { useState } from "react";
import { Dices, Search, X, ArrowRight, Ruler, Weight } from "lucide-react";
import usePokemonNames from "../hooks/usePokemonNames";
import usePokemonDetails from "../hooks/usePokemonDetails";
import LoadingSkeleton from "../components/ui/LoadingSkeleton";
import TypeBadge from "../components/pokemon/TypeBadge";
import { cn } from "../utils/cn";

const STAT_MAX = 255;
const STAT_LABELS = {
  hp: "HP",
  attack: "ATK",
  defense: "DEF",
  "special-attack": "Sp. Atk",
  "special-defense": "Sp. Def",
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

function SearchModal({ onSelect, onClose }) {
  const [query, setQuery] = useState("");
  const allNames = usePokemonNames();

  const filtered = query.trim().length > 0
    ? allNames.filter((p) =>
        p.name.toLowerCase().includes(query.trim().toLowerCase())
      ).slice(0, 8)
    : [];

  return (
    <div className="animate-fade-in mb-6 rounded-lg border border-[var(--color-pokedex-border)] bg-[var(--color-pokedex-panel)] p-4 dark:border-[var(--color-pokedex-dark-border)] dark:bg-[var(--color-pokedex-dark-panel)]">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-pokedex-subtle)] dark:text-[var(--color-pokedex-dark-muted)]">
          Select a Pokémon
        </span>
        <button
          onClick={onClose}
          className="rounded-md p-1 text-[var(--color-pokedex-subtle)] transition-colors hover:bg-[var(--color-pokedex-border)]/50 hover:text-[var(--color-pokedex-text)] dark:text-[var(--color-pokedex-dark-muted)] dark:hover:bg-[var(--color-pokedex-dark-border)]/50"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      <div className="flex items-center gap-2 rounded-lg border border-[var(--color-pokedex-border)] bg-[var(--color-pokedex-surface)] px-3 py-2 dark:border-[var(--color-pokedex-dark-border)] dark:bg-[var(--color-pokedex-dark-bg)]">
        <Search className="h-4 w-4 shrink-0 text-[var(--color-pokedex-subtle)] dark:text-[var(--color-pokedex-dark-muted)]" />
        <input
          autoFocus
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Escape") onClose();
          }}
          placeholder="Type a Pokémon name..."
          className="flex-1 bg-transparent text-sm text-[var(--color-pokedex-text)] placeholder-[var(--color-pokedex-subtle)] outline-none dark:text-[var(--color-pokedex-dark-text)] dark:placeholder-[var(--color-pokedex-dark-muted)]"
        />
      </div>
      {filtered.length > 0 && (
        <ul className="mt-2 max-h-60 overflow-y-auto">
          {filtered.map((p) => (
            <li key={p.id}>
              <button
                onClick={() => { onSelect(p.name); onClose(); }}
                className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm transition-colors hover:bg-[var(--color-pokedex-surface)] dark:hover:bg-[var(--color-pokedex-dark-bg)]"
              >
                <span className="text-[10px] font-bold tracking-wider text-[var(--color-pokedex-subtle)] dark:text-[var(--color-pokedex-dark-muted)]">
                  #{String(p.id).padStart(3, "0")}
                </span>
                <span className="font-semibold capitalize text-[var(--color-pokedex-text)] dark:text-[var(--color-pokedex-dark-text)]">
                  {p.name.replace(/-/g, " ")}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function SelectSlot({ label, onClick }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-4 transition-all",
        "border-[var(--color-pokedex-border)] bg-[var(--color-pokedex-panel)] hover:border-[var(--color-pokeball-red)]/30 hover:bg-[var(--color-pokedex-surface)]",
        "dark:border-[var(--color-pokedex-dark-border)] dark:bg-[var(--color-pokedex-dark-panel)] dark:hover:border-[var(--color-pokeball-red)]/30 dark:hover:bg-[var(--color-pokedex-dark-bg)]"
      )}
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-pokedex-surface)] dark:bg-[var(--color-pokedex-dark-bg)]">
        <Search className="h-6 w-6 text-[var(--color-pokedex-subtle)] dark:text-[var(--color-pokedex-dark-muted)]" />
      </div>
      <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-pokedex-subtle)] dark:text-[var(--color-pokedex-dark-muted)]">
        {label}
      </span>
    </button>
  );
}

function ComparisonView({ a, b, onClear }) {
  const totalA = Object.keys(STAT_LABELS).reduce((sum, s) => sum + getStat(a, s), 0);
  const totalB = Object.keys(STAT_LABELS).reduce((sum, s) => sum + getStat(b, s), 0);
  const imgA = a.sprites?.officialArtwork || a.sprites?.default;
  const imgB = b.sprites?.officialArtwork || b.sprites?.default;
  const heightA = (a.height / 10).toFixed(1);
  const heightB = (b.height / 10).toFixed(1);
  const weightA = (a.weight / 10).toFixed(1);
  const weightB = (b.weight / 10).toFixed(1);
  const abilitiesA = a.abilities?.map((a) => a.name.replace(/-/g, " ")) || [];
  const abilitiesB = b.abilities?.map((a) => a.name.replace(/-/g, " ")) || [];

  return (
    <div className="animate-fade-in space-y-4">
      {/* Pokémon Face-off */}
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
        {/* Pokémon A */}
        <div className="flex flex-col items-center gap-2 rounded-lg border border-[var(--color-pokedex-border)] bg-[var(--color-pokedex-panel)] p-4 dark:border-[var(--color-pokedex-dark-border)] dark:bg-[var(--color-pokedex-dark-panel)]">
          {imgA ? (
            <img src={imgA} alt={a.name} className="h-20 w-20 object-contain sm:h-28 sm:w-28" />
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[var(--color-pokedex-surface)] sm:h-28 sm:w-28 dark:bg-[var(--color-pokedex-dark-bg)]">
              <span className="text-3xl text-[var(--color-pokedex-subtle)]">?</span>
            </div>
          )}
          <p className="text-[10px] font-bold tracking-wider text-[var(--color-pokedex-subtle)] dark:text-[var(--color-pokedex-dark-muted)]">
            #{String(a.id).padStart(3, "0")}
          </p>
          <p className="text-sm font-extrabold uppercase tracking-wider text-[var(--color-pokedex-text)] dark:text-[var(--color-pokedex-dark-text)]">
            {a.name.replace(/-/g, " ")}
          </p>
          <div className="flex gap-1">
            {a.types?.map((t) => <TypeBadge key={t} type={t} />)}
          </div>
        </div>

        {/* VS Badge */}
        <div className="flex flex-col items-center gap-1">
          <span className="rounded-lg bg-[var(--color-pokeball-red)] px-3 py-1.5 text-xs font-extrabold uppercase tracking-wider text-white">
            VS
          </span>
          <button
            onClick={onClear}
            className="mt-2 text-[10px] font-bold uppercase tracking-wider text-[var(--color-pokedex-subtle)] transition-colors hover:text-[var(--color-pokeball-red)] dark:text-[var(--color-pokedex-dark-muted)]"
          >
            Reset
          </button>
        </div>

        {/* Pokémon B */}
        <div className="flex flex-col items-center gap-2 rounded-lg border border-[var(--color-pokedex-border)] bg-[var(--color-pokedex-panel)] p-4 dark:border-[var(--color-pokedex-dark-border)] dark:bg-[var(--color-pokedex-dark-panel)]">
          {imgB ? (
            <img src={imgB} alt={b.name} className="h-20 w-20 object-contain sm:h-28 sm:w-28" />
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[var(--color-pokedex-surface)] sm:h-28 sm:w-28 dark:bg-[var(--color-pokedex-dark-bg)]">
              <span className="text-3xl text-[var(--color-pokedex-subtle)]">?</span>
            </div>
          )}
          <p className="text-[10px] font-bold tracking-wider text-[var(--color-pokedex-subtle)] dark:text-[var(--color-pokedex-dark-muted)]">
            #{String(b.id).padStart(3, "0")}
          </p>
          <p className="text-sm font-extrabold uppercase tracking-wider text-[var(--color-pokedex-text)] dark:text-[var(--color-pokedex-dark-text)]">
            {b.name.replace(/-/g, " ")}
          </p>
          <div className="flex gap-1">
            {b.types?.map((t) => <TypeBadge key={t} type={t} />)}
          </div>
        </div>
      </div>

      {/* Physical Stats Comparison */}
      <div className="rounded-lg border border-[var(--color-pokedex-border)] bg-[var(--color-pokedex-panel)] p-4 dark:border-[var(--color-pokedex-dark-border)] dark:bg-[var(--color-pokedex-dark-panel)]">
        <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-pokedex-subtle)] dark:text-[var(--color-pokedex-dark-muted)]">
          Physical Data
        </p>
        <div className="space-y-3">
          {/* Height */}
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
            <div className="text-center">
              <span className={cn(
                "text-lg font-extrabold",
                parseFloat(heightA) > parseFloat(heightB)
                  ? "text-green-600 dark:text-green-400"
                  : "text-[var(--color-pokedex-text)] dark:text-[var(--color-pokedex-dark-text)]"
              )}>
                {heightA} m
              </span>
            </div>
            <div className="flex items-center gap-1 text-[var(--color-pokedex-subtle)] dark:text-[var(--color-pokedex-dark-muted)]">
              <Ruler className="h-3 w-3" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Height</span>
            </div>
            <div className="text-center">
              <span className={cn(
                "text-lg font-extrabold",
                parseFloat(heightB) > parseFloat(heightA)
                  ? "text-green-600 dark:text-green-400"
                  : "text-[var(--color-pokedex-text)] dark:text-[var(--color-pokedex-dark-text)]"
              )}>
                {heightB} m
              </span>
            </div>
          </div>
          {/* Weight */}
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
            <div className="text-center">
              <span className={cn(
                "text-lg font-extrabold",
                parseFloat(weightA) > parseFloat(weightB)
                  ? "text-green-600 dark:text-green-400"
                  : "text-[var(--color-pokedex-text)] dark:text-[var(--color-pokedex-dark-text)]"
              )}>
                {weightA} kg
              </span>
            </div>
            <div className="flex items-center gap-1 text-[var(--color-pokedex-subtle)] dark:text-[var(--color-pokedex-dark-muted)]">
              <Weight className="h-3 w-3" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Weight</span>
            </div>
            <div className="text-center">
              <span className={cn(
                "text-lg font-extrabold",
                parseFloat(weightB) > parseFloat(weightA)
                  ? "text-green-600 dark:text-green-400"
                  : "text-[var(--color-pokedex-text)] dark:text-[var(--color-pokedex-dark-text)]"
              )}>
                {weightB} kg
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Base Stats Comparison */}
      <div className="rounded-lg border border-[var(--color-pokedex-border)] bg-[var(--color-pokedex-panel)] p-4 dark:border-[var(--color-pokedex-dark-border)] dark:bg-[var(--color-pokedex-dark-panel)]">
        <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-pokedex-subtle)] dark:text-[var(--color-pokedex-dark-muted)]">
          Base Stats
        </p>
        <div className="space-y-2">
          {Object.keys(STAT_LABELS).map((statName) => {
            const valA = getStat(a, statName);
            const valB = getStat(b, statName);
            const diff = valA - valB;
            const winner = diff > 0 ? "A" : diff < 0 ? "B" : null;
            return (
              <div key={statName} className="grid grid-cols-[1fr_60px_1fr] items-center gap-2">
                {/* A's bar */}
                <div className="flex items-center gap-2">
                  <span className={cn(
                    "w-8 shrink-0 text-right text-xs font-bold",
                    winner === "A" ? "text-green-600 dark:text-green-400" : "text-[var(--color-pokedex-text)] dark:text-[var(--color-pokedex-dark-text)]"
                  )}>
                    {valA}
                  </span>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-[var(--color-pokedex-surface)] dark:bg-[var(--color-pokedex-dark-bg)]">
                    <div
                      className={cn(
                        "h-full rounded-full stat-bar-fill",
                        winner === "A" ? "bg-green-500" : STAT_COLORS[statName] || "bg-[var(--color-pokedex-subtle)]"
                      )}
                      style={{ width: `${(valA / STAT_MAX) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Label */}
                <span className="text-center text-[10px] font-bold uppercase tracking-wider text-[var(--color-pokedex-subtle)] dark:text-[var(--color-pokedex-dark-muted)]">
                  {STAT_LABELS[statName]}
                </span>

                {/* B's bar */}
                <div className="flex items-center gap-2">
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-[var(--color-pokedex-surface)] dark:bg-[var(--color-pokedex-dark-bg)]">
                    <div
                      className={cn(
                        "h-full rounded-full stat-bar-fill ml-auto",
                        winner === "B" ? "bg-green-500" : STAT_COLORS[statName] || "bg-[var(--color-pokedex-subtle)]"
                      )}
                      style={{ width: `${(valB / STAT_MAX) * 100}%` }}
                    />
                  </div>
                  <span className={cn(
                    "w-8 shrink-0 text-left text-xs font-bold",
                    winner === "B" ? "text-green-600 dark:text-green-400" : "text-[var(--color-pokedex-text)] dark:text-[var(--color-pokedex-dark-text)]"
                  )}>
                    {valB}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Total */}
        <div className="mt-4 grid grid-cols-[1fr_60px_1fr] items-center gap-2 border-t border-[var(--color-pokedex-border)] pt-3 dark:border-[var(--color-pokedex-dark-border)]">
          <div className="text-center">
            <span className={cn(
              "text-lg font-extrabold",
              totalA > totalB
                ? "text-green-600 dark:text-green-400"
                : "text-[var(--color-pokedex-text)] dark:text-[var(--color-pokedex-dark-text)]"
            )}>
              {totalA}
            </span>
          </div>
          <span className="text-center text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-pokedex-subtle)] dark:text-[var(--color-pokedex-dark-muted)]">
            Total
          </span>
          <div className="text-center">
            <span className={cn(
              "text-lg font-extrabold",
              totalB > totalA
                ? "text-green-600 dark:text-green-400"
                : "text-[var(--color-pokedex-text)] dark:text-[var(--color-pokedex-dark-text)]"
            )}>
              {totalB}
            </span>
          </div>
        </div>
      </div>

      {/* Abilities Comparison */}
      <div className="rounded-lg border border-[var(--color-pokedex-border)] bg-[var(--color-pokedex-panel)] p-4 dark:border-[var(--color-pokedex-dark-border)] dark:bg-[var(--color-pokedex-dark-panel)]">
        <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-pokedex-subtle)] dark:text-[var(--color-pokedex-dark-muted)]">
          Abilities
        </p>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-wrap gap-1.5">
            {abilitiesA.map((ab) => (
              <span key={ab} className="rounded-md border border-[var(--color-pokedex-border)] bg-[var(--color-pokedex-surface)] px-2 py-1 text-xs font-medium capitalize text-[var(--color-pokedex-muted)] dark:border-[var(--color-pokedex-dark-border)] dark:bg-[var(--color-pokedex-dark-bg)] dark:text-[var(--color-pokedex-dark-muted)]">
                {ab}
              </span>
            ))}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {abilitiesB.map((ab) => (
              <span key={ab} className="rounded-md border border-[var(--color-pokedex-border)] bg-[var(--color-pokedex-surface)] px-2 py-1 text-xs font-medium capitalize text-[var(--color-pokedex-muted)] dark:border-[var(--color-pokedex-dark-border)] dark:bg-[var(--color-pokedex-dark-bg)] dark:text-[var(--color-pokedex-dark-muted)]">
                {ab}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Winner Summary */}
      {totalA !== totalB && (
        <div className="rounded-lg border border-green-200/60 bg-green-50/50 p-4 text-center dark:border-green-900/40 dark:bg-green-950/20">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-green-700 dark:text-green-400">
            Winner
          </p>
          <p className="mt-1 text-lg font-extrabold uppercase tracking-wider text-green-800 dark:text-green-300">
            {totalA > totalB ? a.name.replace(/-/g, " ") : b.name.replace(/-/g, " ")}
          </p>
          <p className="mt-0.5 text-xs text-green-600 dark:text-green-400">
            {Math.abs(totalA - totalB)} total stat advantage
          </p>
        </div>
      )}
    </div>
  );
}

export default function BattleLabPage() {
  const [pokemonA, setPokemonA] = useState(null);
  const [pokemonB, setPokemonB] = useState(null);
  const [searchSlot, setSearchSlot] = useState(null);

  const { pokemon: detailsA, loading: loadingA } = usePokemonDetails(pokemonA);
  const { pokemon: detailsB, loading: loadingB } = usePokemonDetails(pokemonB);

  const showComparison = detailsA && detailsB;

  return (
    <div>
      {/* Header */}
      <div className="animate-fade-in-up mb-8 text-center">
        <div className="mb-3 flex items-center justify-center gap-2">
          <Dices className="h-4 w-4 text-[var(--color-pokeball-red)]" />
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--color-pokedex-subtle)] dark:text-[var(--color-pokedex-dark-muted)]">
            Battle Lab
          </span>
        </div>
        <h1 className="text-2xl font-extrabold uppercase tracking-wider text-[var(--color-pokedex-text)] sm:text-3xl dark:text-[var(--color-pokedex-dark-text)]">
          Compare Pokémon
        </h1>
        <p className="mt-2 text-xs text-[var(--color-pokedex-muted)] dark:text-[var(--color-pokedex-dark-muted)]">
          Select two Pokémon to compare their stats head to head.
        </p>
      </div>

      {/* Search Modal */}
      {searchSlot && (
        <SearchModal
          onSelect={(name) => {
            if (searchSlot === "A") setPokemonA(name);
            else setPokemonB(name);
          }}
          onClose={() => setSearchSlot(null)}
        />
      )}

      {/* Selection Slots (hidden when comparison is showing) */}
      {!showComparison && (
        <div className="mb-6 grid grid-cols-2 gap-3 sm:gap-4">
          <div>
            <p className="mb-2 text-center text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-pokedex-subtle)] dark:text-[var(--color-pokedex-dark-muted)]">
              Pokémon A
            </p>
            {loadingA ? (
              <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-[var(--color-pokedex-border)] bg-[var(--color-pokedex-panel)] p-6 dark:border-[var(--color-pokedex-dark-border)] dark:bg-[var(--color-pokedex-dark-panel)]">
                <LoadingSkeleton className="h-20 w-20 rounded-full" />
                <LoadingSkeleton className="h-4 w-20" />
              </div>
            ) : detailsA ? (
              <div className="relative flex flex-col items-center gap-2 rounded-lg border border-[var(--color-pokedex-border)] bg-[var(--color-pokedex-panel)] p-4 dark:border-[var(--color-pokedex-dark-border)] dark:bg-[var(--color-pokedex-dark-panel)]">
                <button
                  onClick={() => setPokemonA(null)}
                  className="absolute top-2 right-2 rounded-md p-1 text-[var(--color-pokedex-subtle)] transition-colors hover:bg-[var(--color-pokedex-border)]/50 hover:text-[var(--color-pokedex-text)] dark:text-[var(--color-pokedex-dark-muted)] dark:hover:bg-[var(--color-pokedex-dark-border)]/50"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
                {detailsA.sprites?.officialArtwork || detailsA.sprites?.default ? (
                  <img src={detailsA.sprites?.officialArtwork || detailsA.sprites?.default} alt={detailsA.name} className="h-20 w-20 object-contain" />
                ) : (
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[var(--color-pokedex-surface)] dark:bg-[var(--color-pokedex-dark-bg)]">
                    <span className="text-2xl text-[var(--color-pokedex-subtle)]">?</span>
                  </div>
                )}
                <p className="text-[10px] font-bold tracking-wider text-[var(--color-pokedex-subtle)] dark:text-[var(--color-pokedex-dark-muted)]">
                  #{String(detailsA.id).padStart(3, "0")}
                </p>
                <p className="text-xs font-extrabold uppercase tracking-wider text-[var(--color-pokedex-text)] dark:text-[var(--color-pokedex-dark-text)]">
                  {detailsA.name.replace(/-/g, " ")}
                </p>
                <div className="flex gap-1">
                  {detailsA.types?.map((t) => <TypeBadge key={t} type={t} />)}
                </div>
              </div>
            ) : (
              <SelectSlot label="Slot A" onClick={() => setSearchSlot("A")} />
            )}
          </div>
          <div>
            <p className="mb-2 text-center text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-pokedex-subtle)] dark:text-[var(--color-pokedex-dark-muted)]">
              Pokémon B
            </p>
            {loadingB ? (
              <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-[var(--color-pokedex-border)] bg-[var(--color-pokedex-panel)] p-6 dark:border-[var(--color-pokedex-dark-border)] dark:bg-[var(--color-pokedex-dark-panel)]">
                <LoadingSkeleton className="h-20 w-20 rounded-full" />
                <LoadingSkeleton className="h-4 w-20" />
              </div>
            ) : detailsB ? (
              <div className="relative flex flex-col items-center gap-2 rounded-lg border border-[var(--color-pokedex-border)] bg-[var(--color-pokedex-panel)] p-4 dark:border-[var(--color-pokedex-dark-border)] dark:bg-[var(--color-pokedex-dark-panel)]">
                <button
                  onClick={() => setPokemonB(null)}
                  className="absolute top-2 right-2 rounded-md p-1 text-[var(--color-pokedex-subtle)] transition-colors hover:bg-[var(--color-pokedex-border)]/50 hover:text-[var(--color-pokedex-text)] dark:text-[var(--color-pokedex-dark-muted)] dark:hover:bg-[var(--color-pokedex-dark-border)]/50"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
                {detailsB.sprites?.officialArtwork || detailsB.sprites?.default ? (
                  <img src={detailsB.sprites?.officialArtwork || detailsB.sprites?.default} alt={detailsB.name} className="h-20 w-20 object-contain" />
                ) : (
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[var(--color-pokedex-surface)] dark:bg-[var(--color-pokedex-dark-bg)]">
                    <span className="text-2xl text-[var(--color-pokedex-subtle)]">?</span>
                  </div>
                )}
                <p className="text-[10px] font-bold tracking-wider text-[var(--color-pokedex-subtle)] dark:text-[var(--color-pokedex-dark-muted)]">
                  #{String(detailsB.id).padStart(3, "0")}
                </p>
                <p className="text-xs font-extrabold uppercase tracking-wider text-[var(--color-pokedex-text)] dark:text-[var(--color-pokedex-dark-text)]">
                  {detailsB.name.replace(/-/g, " ")}
                </p>
                <div className="flex gap-1">
                  {detailsB.types?.map((t) => <TypeBadge key={t} type={t} />)}
                </div>
              </div>
            ) : (
              <SelectSlot label="Slot B" onClick={() => setSearchSlot("B")} />
            )}
          </div>
        </div>
      )}

      {/* Comparison View */}
      {showComparison && (
        <ComparisonView
          a={detailsA}
          b={detailsB}
          onClear={() => { setPokemonA(null); setPokemonB(null); }}
        />
      )}

      {/* Hint */}
      {!showComparison && !searchSlot && !detailsA && !detailsB && (
        <div className="text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-pokedex-subtle)] dark:text-[var(--color-pokedex-dark-muted)]">
            Select both Pokémon to begin comparison
          </p>
        </div>
      )}
    </div>
  );
}
