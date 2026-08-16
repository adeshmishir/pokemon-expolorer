import { useState } from "react";
import { Dices, Search, X } from "lucide-react";
import usePokemonNames from "../hooks/usePokemonNames";
import usePokemonDetails from "../hooks/usePokemonDetails";
import ComparePanel from "../components/pokemon/ComparePanel";
import LoadingSkeleton from "../components/ui/LoadingSkeleton";
import TypeBadge from "../components/pokemon/TypeBadge";
import { cn } from "../utils/cn";

function PokemonSlot({ label, pokemon, loading, onSearch, onRemove }) {
  const image = pokemon?.sprites?.officialArtwork || pokemon?.sprites?.default;

  if (loading) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-[var(--color-pokedex-border)] bg-[var(--color-pokedex-panel)] p-6 dark:border-[var(--color-pokedex-dark-border)] dark:bg-[var(--color-pokedex-dark-panel)]">
        <LoadingSkeleton className="h-24 w-24 rounded-full" />
        <LoadingSkeleton className="h-4 w-24" />
        <LoadingSkeleton className="h-3 w-16" />
      </div>
    );
  }

  if (!pokemon) {
    return (
      <button
        onClick={onSearch}
        className={cn(
          "flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed p-6 transition-all",
          "border-[var(--color-pokedex-border)] bg-[var(--color-pokedex-panel)] hover:border-[var(--color-pokeball-red)]/30 hover:bg-[var(--color-pokedex-surface)]",
          "dark:border-[var(--color-pokedex-dark-border)] dark:bg-[var(--color-pokedex-dark-panel)] dark:hover:border-[var(--color-pokeball-red)]/30 dark:hover:bg-[var(--color-pokedex-dark-bg)]"
        )}
      >
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[var(--color-pokedex-surface)] dark:bg-[var(--color-pokedex-dark-bg)]">
          <Search className="h-8 w-8 text-[var(--color-pokedex-subtle)] dark:text-[var(--color-pokedex-dark-muted)]" />
        </div>
        <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-pokedex-subtle)] dark:text-[var(--color-pokedex-dark-muted)]">
          {label}
        </span>
        <span className="text-[10px] text-[var(--color-pokedex-subtle)] dark:text-[var(--color-pokedex-dark-muted)]">
          Click to search
        </span>
      </button>
    );
  }

  return (
    <div className="relative flex flex-col items-center gap-2 rounded-lg border border-[var(--color-pokedex-border)] bg-[var(--color-pokedex-panel)] p-5 dark:border-[var(--color-pokedex-dark-border)] dark:bg-[var(--color-pokedex-dark-panel)]">
      <button
        onClick={onRemove}
        aria-label={`Remove ${pokemon.name} from comparison`}
        className="absolute top-2 right-2 rounded-md p-1 text-[var(--color-pokedex-subtle)] transition-colors hover:bg-[var(--color-pokedex-border)]/50 hover:text-[var(--color-pokedex-text)] dark:text-[var(--color-pokedex-dark-muted)] dark:hover:bg-[var(--color-pokedex-dark-border)]/50"
      >
        <X className="h-3.5 w-3.5" />
      </button>
      {image ? (
        <img src={image} alt={pokemon.name} className="h-24 w-24 object-contain" />
      ) : (
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[var(--color-pokedex-surface)] dark:bg-[var(--color-pokedex-dark-bg)]">
          <span className="text-3xl text-[var(--color-pokedex-subtle)]">?</span>
        </div>
      )}
      <p className="text-[10px] font-bold tracking-wider text-[var(--color-pokedex-subtle)] dark:text-[var(--color-pokedex-dark-muted)]">
        #{String(pokemon.id).padStart(3, "0")}
      </p>
      <p className="text-sm font-extrabold uppercase tracking-wider text-[var(--color-pokedex-text)] dark:text-[var(--color-pokedex-dark-text)]">
        {pokemon.name.replace(/-/g, " ")}
      </p>
      <div className="flex gap-1">
        {pokemon.types?.map((t) => (
          <TypeBadge key={t} type={t} />
        ))}
      </div>
    </div>
  );
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

export default function BattleLabPage() {
  const [pokemonA, setPokemonA] = useState(null);
  const [pokemonB, setPokemonB] = useState(null);
  const [searchSlot, setSearchSlot] = useState(null);

  const { pokemon: detailsA, loading: loadingA } = usePokemonDetails(pokemonA);
  const { pokemon: detailsB, loading: loadingB } = usePokemonDetails(pokemonB);

  const showCompare = detailsA && detailsB;

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
          Select two Pokémon to compare their stats side by side.
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

      {/* Slots */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:gap-4">
        <div>
          <p className="mb-2 text-center text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-pokedex-subtle)] dark:text-[var(--color-pokedex-dark-muted)]">
            Pokémon A
          </p>
          <PokemonSlot
            label="Slot A"
            pokemon={detailsA}
            loading={loadingA}
            onSearch={() => setSearchSlot("A")}
            onRemove={() => { setPokemonA(null); }}
          />
        </div>
        <div>
          <p className="mb-2 text-center text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-pokedex-subtle)] dark:text-[var(--color-pokedex-dark-muted)]">
            Pokémon B
          </p>
          <PokemonSlot
            label="Slot B"
            pokemon={detailsB}
            loading={loadingB}
            onSearch={() => setSearchSlot("B")}
            onRemove={() => { setPokemonB(null); }}
          />
        </div>
      </div>

      {/* Compare Panel */}
      {showCompare && (
        <ComparePanel
          pokemon={[detailsA, detailsB]}
          onClose={() => { setPokemonA(null); setPokemonB(null); }}
        />
      )}

      {/* Hint */}
      {!showCompare && !searchSlot && (
        <div className="text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-pokedex-subtle)] dark:text-[var(--color-pokedex-dark-muted)]">
            {(!pokemonA && !pokemonB)
              ? "Select both Pokémon to begin comparison"
              : !pokemonA
                ? "Select Pokémon A"
                : "Select Pokémon B"}
          </p>
        </div>
      )}
    </div>
  );
}
