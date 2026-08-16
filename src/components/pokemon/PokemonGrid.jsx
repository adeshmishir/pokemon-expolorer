import PokemonCard from "./PokemonCard";

export default function PokemonGrid({
  pokemon = [],
  children,
  isFavorite,
  onToggleFavorite,
  isComparing,
  onToggleCompare,
}) {
  if (children) {
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {children}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {pokemon.map((p) => (
        <PokemonCard
          key={p.id}
          pokemon={p}
          isFavorite={isFavorite?.(p.name)}
          onToggleFavorite={onToggleFavorite}
          isComparing={isComparing?.(p.id)}
          onToggleCompare={onToggleCompare}
        />
      ))}
    </div>
  );
}
