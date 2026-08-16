import { Link } from "react-router-dom";
import { Heart, GitCompareArrows } from "lucide-react";
import TypeBadge from "./TypeBadge";
import { getTypeColors } from "../../utils/typeColors";
import { cn } from "../../utils/cn";

export default function PokemonCard({
  pokemon,
  isFavorite,
  onToggleFavorite,
  isComparing,
  onToggleCompare,
}) {
  const { id, name, types, sprites } = pokemon;
  const primaryType = types?.[0] || "normal";
  const typeColors = getTypeColors(primaryType);
  const image = sprites?.officialArtwork || sprites?.default || null;
  const formattedId = `#${String(id).padStart(3, "0")}`;

  return (
    <Link
      to={`/pokemon/${name}`}
      aria-label={`View ${name} details`}
      className={cn(
        "group relative block rounded-lg border bg-[var(--color-pokedex-panel)] outline-none card-lift",
        "transition-all duration-200 ease-out",
        "active:scale-[0.98]",
        "focus-visible:ring-2 focus-visible:ring-offset-2",
        typeColors.border,
        "border-[var(--color-pokedex-border)] focus-visible:ring-[var(--color-pokeball-red)]/40",
        "dark:border-[var(--color-pokedex-dark-border)] dark:bg-[var(--color-pokedex-dark-panel)]"
      )}
    >
      {/* Top accent bar */}
      <div className={cn("h-1 rounded-t-lg", typeColors.bg)} />

      <div className="p-3 sm:p-4">
        {/* Action buttons row */}
        <div className="mb-1 flex items-start justify-between">
          <span className="text-[10px] font-bold tracking-wider text-[var(--color-pokedex-subtle)] dark:text-[var(--color-pokedex-dark-muted)]">
            {formattedId}
          </span>
          <div className="flex gap-0.5">
            {onToggleCompare && (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onToggleCompare(pokemon);
                }}
                aria-label={
                  isComparing ? `Remove ${name} from comparison` : `Compare ${name}`
                }
                aria-pressed={isComparing}
                className={cn(
                  "rounded-md p-1 transition-all duration-150 focus-visible:ring-2 focus-visible:ring-[var(--color-pokeball-red)]/50 focus-visible:ring-offset-1",
                  isComparing
                    ? "bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400"
                    : "text-[var(--color-pokedex-subtle)] hover:bg-[var(--color-pokedex-border)]/50 hover:text-[var(--color-pokedex-muted)] dark:text-[var(--color-pokedex-dark-muted)] dark:hover:bg-[var(--color-pokedex-dark-border)]/50"
                )}
              >
                <GitCompareArrows className="h-3.5 w-3.5" />
              </button>
            )}
            {onToggleFavorite && (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onToggleFavorite(name);
                }}
                aria-label={isFavorite ? `Unfavorite ${name}` : `Favorite ${name}`}
                aria-pressed={isFavorite}
                className={cn(
                  "rounded-md p-1 transition-all duration-150 focus-visible:ring-2 focus-visible:ring-[var(--color-pokeball-red)]/50 focus-visible:ring-offset-1",
                  isFavorite
                    ? "text-[var(--color-pokeball-red)]"
                    : "text-[var(--color-pokedex-subtle)] hover:bg-[var(--color-pokedex-border)]/50 hover:text-[var(--color-pokedex-muted)] dark:text-[var(--color-pokedex-dark-muted)] dark:hover:bg-[var(--color-pokedex-dark-border)]/50"
                )}
              >
                <Heart
                  className="h-3.5 w-3.5"
                  fill={isFavorite ? "currentColor" : "none"}
                />
              </button>
            )}
          </div>
        </div>

        {/* Image */}
        <div className="relative mx-auto mb-2 h-28 w-28 sm:h-32 sm:w-32">
          <div className="absolute inset-0 rounded-full bg-[var(--color-pokedex-surface)] dark:bg-[var(--color-pokedex-dark-bg)]" />
          {image ? (
            <img
              src={image}
              alt={`${name} artwork`}
              className="relative h-full w-full object-contain transition-transform duration-300 group-hover:scale-110"
              loading="lazy"
            />
          ) : (
            <div className="relative flex h-full w-full items-center justify-center rounded-full bg-[var(--color-pokedex-surface)] dark:bg-[var(--color-pokedex-dark-bg)]">
              <span className="text-4xl text-[var(--color-pokedex-subtle)]" aria-hidden="true">?</span>
            </div>
          )}
        </div>

        {/* Name */}
        <h3 className="text-center text-sm font-extrabold uppercase tracking-wider text-[var(--color-pokedex-text)] dark:text-[var(--color-pokedex-dark-text)]">
          {name.replace(/-/g, " ")}
        </h3>

        {/* Types */}
        <div className="mt-2 flex flex-wrap items-center justify-center gap-1">
          {types.map((type) => (
            <TypeBadge key={type} type={type} />
          ))}
        </div>
      </div>
    </Link>
  );
}
