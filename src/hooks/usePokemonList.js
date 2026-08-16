import { useState, useEffect, useCallback } from "react";
import { getPokemonList, getPokemonDetails } from "../services/pokeApi";
import { isApiError } from "../utils/errors";

export default function usePokemonList(limit = 20) {
  const [pokemon, setPokemon] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function fetchInitial() {
      setLoading(true);
      setError(null);

      try {
        const list = await getPokemonList(limit, 0);
        const results = await Promise.allSettled(
          list.results.map((p) => getPokemonDetails(p.name))
        );

        if (cancelled) return;

        const succeeded = results
          .filter((r) => r.status === "fulfilled")
          .map((r) => r.value);

        setPokemon(succeeded);
        setTotal(list.count);
        setHasMore(list.next !== null);
      } catch (err) {
        if (!cancelled) {
          setError(isApiError(err) ? err.message : "Failed to load Pokémon");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchInitial();
    return () => { cancelled = true; };
  }, [limit]);

  const loadMore = useCallback(async () => {
    if (loadingMore) return;

    setLoadingMore(true);

    try {
      const list = await getPokemonList(limit, pokemon.length);
      const results = await Promise.allSettled(
        list.results.map((p) => getPokemonDetails(p.name))
      );

      const succeeded = results
        .filter((r) => r.status === "fulfilled")
        .map((r) => r.value);

      setPokemon((prev) => [...prev, ...succeeded]);
      setHasMore(list.next !== null);
    } catch {
      // keep existing pokemon visible, button stays for retry
    } finally {
      setLoadingMore(false);
    }
  }, [loadingMore, pokemon.length, limit]);

  const retry = useCallback(() => {
    setPokemon([]);
    setLoading(true);
    setError(null);
  }, []);

  return {
    pokemon,
    loading,
    error,
    total,
    hasMore,
    loadingMore,
    loadMore,
    retry,
  };
}
