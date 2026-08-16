import TypeBadge from "./TypeBadge";

export default function PokemonCard({ pokemon }) {
  const { id, name, types, sprites } = pokemon;
  const image = sprites?.officialArtwork || sprites?.default || null;
  const formattedId = `#${String(id).padStart(3, "0")}`;

  return (
    <div className="group cursor-pointer rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
      <div className="mx-auto flex h-32 w-32 items-center justify-center rounded-full bg-slate-50">
        {image ? (
          <img
            src={image}
            alt={name}
            className="h-full w-full object-contain"
            loading="lazy"
          />
        ) : (
          <span className="text-3xl">?</span>
        )}
      </div>
      <p className="mt-3 text-center text-xs font-semibold uppercase tracking-wider text-slate-400">
        {formattedId}
      </p>
      <h3 className="mt-1 text-center text-lg font-bold capitalize text-slate-800">
        {name}
      </h3>
      <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5">
        {types.map((type) => (
          <TypeBadge key={type} type={type} />
        ))}
      </div>
    </div>
  );
}
