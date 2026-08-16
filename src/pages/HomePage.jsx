import PokemonGrid from "../components/pokemon/PokemonGrid";
import PokemonCard from "../components/pokemon/PokemonCard";

export default function HomePage() {
  return (
    <div>
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Explore Pokémon
        </h1>
        <p className="mt-2 text-slate-500">
          Listing, search, filtering, and details arrive in later steps.
        </p>
      </div>

      <PokemonGrid>
        <PokemonCard />
        <PokemonCard />
        <PokemonCard />
        <PokemonCard />
        <PokemonCard />
      </PokemonGrid>
    </div>
  );
}
