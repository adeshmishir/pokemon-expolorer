import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-4">
          <Link to="/" className="flex items-center gap-3 transition-opacity hover:opacity-80">
          <span className="relative block h-8 w-8 overflow-hidden rounded-full border-2 border-pokeball-dark bg-white">
            <span className="absolute inset-x-0 top-0 h-1/2 bg-pokeball-red" />
            <span className="absolute inset-x-0 top-1/2 h-0.5 bg-pokeball-dark" />
          </span>
          <span className="text-base font-bold tracking-tight text-slate-900 sm:text-lg">
            Pokémon Explorer
          </span>
        </Link>
      </div>
    </header>
  );
}
