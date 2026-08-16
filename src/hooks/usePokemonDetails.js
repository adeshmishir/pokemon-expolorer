import { useState, useEffect, useCallback } from "react";
import { getPokemonDetails } from "../services/pokeApi";
import { isApiError } from "../utils/errors";

export default function usePokemonDetails(name) {
  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    setError(null);
    setPokemon(null);

    getPokemonDetails(name)
      .then((data) => {
        if (!cancelled) setPokemon(data);
      })
      .catch((err) => {
        if (!cancelled) {
          if (isApiError(err) && err.status === 404) {
            setError("not_found");
          } else {
            setError("api_error");
          }
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [name, retryKey]);

  const retry = useCallback(() => {
    setRetryKey((k) => k + 1);
  }, []);

  return { pokemon, loading, error, retry };
}
