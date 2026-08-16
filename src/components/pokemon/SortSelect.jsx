import { ArrowUpDown } from "lucide-react";

const SORT_OPTIONS = [
  { value: "default", label: "Default" },
  { value: "id-asc", label: "ID (Low → High)" },
  { value: "id-desc", label: "ID (High → Low)" },
  { value: "name-asc", label: "Name (A → Z)" },
  { value: "name-desc", label: "Name (Z → A)" },
  { value: "hp-desc", label: "HP" },
  { value: "attack-desc", label: "Attack" },
  { value: "speed-desc", label: "Speed" },
];

export function sortPokemon(pokemon, sortBy) {
  if (sortBy === "default") return pokemon;

  const sorted = [...pokemon];

  switch (sortBy) {
    case "id-asc":
      return sorted.sort((a, b) => a.id - b.id);
    case "id-desc":
      return sorted.sort((a, b) => b.id - a.id);
    case "name-asc":
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case "name-desc":
      return sorted.sort((a, b) => b.name.localeCompare(a.name));
    case "hp-desc": {
      const getStat = (p, name) =>
        p.stats?.find((s) => s.name === name)?.base ?? 0;
      return sorted.sort((a, b) => getStat(b, "hp") - getStat(a, "hp"));
    }
    case "attack-desc": {
      const getStat = (p, name) =>
        p.stats?.find((s) => s.name === name)?.base ?? 0;
      return sorted.sort(
        (a, b) => getStat(b, "attack") - getStat(a, "attack")
      );
    }
    case "speed-desc": {
      const getStat = (p, name) =>
        p.stats?.find((s) => s.name === name)?.base ?? 0;
      return sorted.sort((a, b) => getStat(b, "speed") - getStat(a, "speed"));
    }
    default:
      return sorted;
  }
}

export default function SortSelect({ value, onChange }) {
  return (
    <div className="mb-6 flex justify-center">
      <div className="inline-flex items-center gap-2 rounded-lg border border-[var(--color-pokedex-border)] bg-[var(--color-pokedex-panel)] px-3 py-1.5 dark:border-[var(--color-pokedex-dark-border)] dark:bg-[var(--color-pokedex-dark-panel)]">
        <ArrowUpDown className="h-3.5 w-3.5 text-[var(--color-pokedex-subtle)] dark:text-[var(--color-pokedex-dark-muted)]" aria-hidden="true" />
        <label htmlFor="sort-select" className="sr-only">
          Sort Pokémon
        </label>
        <select
          id="sort-select"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="bg-transparent text-xs font-semibold uppercase tracking-wider text-[var(--color-pokedex-muted)] outline-none dark:text-[var(--color-pokedex-dark-muted)]"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
