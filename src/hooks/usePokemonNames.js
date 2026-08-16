import { useState, useEffect } from "react";
import { getAllPokemonNames } from "../services/pokeApi";

export default function usePokemonNames() {
  const [names, setNames] = useState([]);

  useEffect(() => {
    let cancelled = false;

    getAllPokemonNames()
      .then((data) => {
        if (!cancelled) setNames(data);
      })
      .catch(() => {
        // silently fail — autocomplete just won't have suggestions
      });

    return () => { cancelled = true; };
  }, []);

  return names;
}
