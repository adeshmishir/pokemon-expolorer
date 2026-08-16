import { useState, useCallback, useRef } from "react";
import { getPokemonByType, getPokemonDetails } from "../services/pokeApi";
import { isApiError } from "../utils/errors";

export default function usePokemonByType() {
  const [selectedType, setSelectedType] = useState("all");
  const [typePokemon, setTypePokemon] = useState([]);
  const [typeLoading, setTypeLoading] = useState(false);
  const [typeError, setTypeError] = useState(null);

  const fetchId = useRef(0);

  const changeType = useCallback(async (type) => {
    if (type === selectedType) return;

    setSelectedType(type);

    if (type === "all") {
      setTypePokemon([]);
      setTypeLoading(false);
      setTypeError(null);
      return;
    }

    const id = ++fetchId.current;
    setTypeLoading(true);
    setTypeError(null);
    setTypePokemon([]);

    try {
      const typeData = await getPokemonByType(type);

      const detailResults = await Promise.allSettled(
        typeData.pokemon.map((p) => getPokemonDetails(p.name))
      );

      if (id !== fetchId.current) return;

      const succeeded = detailResults
        .filter((r) => r.status === "fulfilled")
        .map((r) => r.value);

      setTypePokemon(succeeded);
      setTypeLoading(false);
    } catch (err) {
      if (id !== fetchId.current) return;

      setTypeLoading(false);
      setTypeError(
        isApiError(err) ? err.message : "Failed to load Pokémon for this type"
      );
    }
  }, [selectedType]);

  const isTypeFiltering = selectedType !== "all";

  return {
    selectedType,
    typePokemon,
    typeLoading,
    typeError,
    isTypeFiltering,
    changeType,
  };
}
