export default function PokemonCard() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mx-auto h-24 w-24 rounded-full bg-slate-100" />
      <div className="mt-4 h-4 w-3/4 rounded bg-slate-100" />
      <div className="mt-2 h-3 w-1/2 rounded bg-slate-100" />
    </div>
  );
}
