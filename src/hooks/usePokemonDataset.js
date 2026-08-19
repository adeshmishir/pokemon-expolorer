import { useState, useEffect } from "react";
import { getAllPokemonNames } from "../services/pokeApi";
import { isApiError } from "../utils/errors";

export default function usePokemonDataset() {
  const [allPokemon, setAllPokemon] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    getAllPokemonNames()
      .then((data) => {
        if (!cancelled) setAllPokemon(data);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(isApiError(err) ? err.message : "Failed to load Pokémon data");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, []);

  return { allPokemon, loading, error };
}
