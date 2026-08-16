import { Link } from "react-router-dom";
import TypeBadge from "./TypeBadge";
import { getTypeColors } from "../../utils/typeColors";
import { cn } from "../../utils/cn";

export default function PokemonCard({ pokemon }) {
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
        "group block rounded-2xl border bg-white shadow-sm outline-none",
        "transition-all duration-200 ease-out",
        "hover:-translate-y-1 hover:shadow-lg",
        "focus-visible:ring-2 focus-visible:ring-offset-2",
        typeColors.border,
        "border-transparent focus-visible:ring-slate-400"
      )}
    >
      {/* Type accent strip */}
      <div className={cn("h-1.5 rounded-t-2xl", typeColors.bg)} />

      <div className="p-4">
        {/* Image */}
        <div className="relative mx-auto mb-3 h-32 w-32">
          <div className="absolute inset-0 rounded-full bg-slate-50" />
          {image ? (
            <img
              src={image}
              alt={`${name} artwork`}
              className="relative h-full w-full object-contain transition-transform duration-200 group-hover:scale-110"
              loading="lazy"
            />
          ) : (
            <div className="relative flex h-full w-full items-center justify-center rounded-full bg-slate-100">
              <span className="text-4xl" aria-hidden="true">?</span>
            </div>
          )}
        </div>

        {/* ID */}
        <p className="text-center text-xs font-semibold uppercase tracking-widest text-slate-400">
          {formattedId}
        </p>

        {/* Name */}
        <h3 className="mt-1 text-center text-lg font-bold capitalize text-slate-800">
          {name.replace(/-/g, " ")}
        </h3>

        {/* Types */}
        <div className="mt-2.5 flex flex-wrap items-center justify-center gap-1.5">
          {types.map((type) => (
            <TypeBadge key={type} type={type} />
          ))}
        </div>
      </div>
    </Link>
  );
}
