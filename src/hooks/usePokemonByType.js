import { useState, useCallback, useRef } from "react";
import { getPokemonByType } from "../services/pokeApi";
import { isApiError } from "../utils/errors";

export default function usePokemonByType() {
  const [selectedType, setSelectedType] = useState("all");
  const [typeNames, setTypeNames] = useState([]);
  const [typeLoading, setTypeLoading] = useState(false);
  const [typeError, setTypeError] = useState(null);

  const fetchId = useRef(0);

  const changeType = useCallback(async (type) => {
    if (type === selectedType) return;

    setSelectedType(type);

    if (type === "all") {
      setTypeNames([]);
      setTypeLoading(false);
      setTypeError(null);
      return;
    }

    const id = ++fetchId.current;
    setTypeLoading(true);
    setTypeError(null);
    setTypeNames([]);

    try {
      const typeData = await getPokemonByType(type);

      if (id !== fetchId.current) return;

      const names = typeData.pokemon.map((p) => ({
        name: p.name,
      }));

      setTypeNames(names);
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
    typeNames,
    typeLoading,
    typeError,
    isTypeFiltering,
    changeType,
  };
}
