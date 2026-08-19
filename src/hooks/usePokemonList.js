import { useState, useEffect, useCallback, useRef } from "react";
import { getPokemonDetails } from "../services/pokeApi";
import { isApiError } from "../utils/errors";

const PAGE_SIZE = 20;
const detailCache = new Map();

async function fetchDetailCached(name) {
  if (detailCache.has(name)) return detailCache.get(name);
  const detail = await getPokemonDetails(name);
  detailCache.set(name, detail);
  return detail;
}

export default function usePokemonList(processedList = [], totalFiltered = 0) {
  const [pokemon, setPokemon] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const fetchIdRef = useRef(0);

  useEffect(() => {
    const id = ++fetchIdRef.current;
    setLoading(true);
    setError(null);
    setPokemon([]);

    const firstPage = processedList.slice(0, PAGE_SIZE);

    if (firstPage.length === 0) {
      setPokemon([]);
      setLoading(false);
      return;
    }

    Promise.allSettled(firstPage.map((p) => fetchDetailCached(p.name)))
      .then((results) => {
        if (id !== fetchIdRef.current) return;
        const succeeded = results
          .filter((r) => r.status === "fulfilled")
          .map((r) => r.value);
        setPokemon(succeeded);
      })
      .catch((err) => {
        if (id !== fetchIdRef.current) return;
        setError(isApiError(err) ? err.message : "Failed to load Pokémon");
      })
      .finally(() => {
        if (id === fetchIdRef.current) setLoading(false);
      });
  }, [processedList]);

  const loadMore = useCallback(async () => {
    if (loadingMore) return;
    setLoadingMore(true);

    try {
      const nextPageNum = Math.ceil(pokemon.length / PAGE_SIZE);
      const start = nextPageNum * PAGE_SIZE;
      const nextPage = processedList.slice(start, start + PAGE_SIZE);

      if (nextPage.length === 0) return;

      const results = await Promise.allSettled(
        nextPage.map((p) => fetchDetailCached(p.name))
      );

      const succeeded = results
        .filter((r) => r.status === "fulfilled")
        .map((r) => r.value);

      setPokemon((prev) => [...prev, ...succeeded]);
    } catch {
      // keep existing pokemon visible
    } finally {
      setLoadingMore(false);
    }
  }, [loadingMore, pokemon.length, processedList]);

  const hasMore = pokemon.length < totalFiltered && pokemon.length > 0;

  return {
    pokemon,
    loading,
    loadingMore,
    error,
    loadMore,
    hasMore,
    total: totalFiltered,
  };
}
