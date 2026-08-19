import { useState, useCallback, useEffect, useRef, useMemo } from "react";

export default function usePokemonSearch(allPokemon, initialQuery = "") {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [isSearching, setIsSearching] = useState(!!initialQuery.trim());
  const didAutoSearch = useRef(false);

  useEffect(() => {
    if (initialQuery.trim() && !didAutoSearch.current) {
      didAutoSearch.current = true;
      setSearchQuery(initialQuery.trim());
      setIsSearching(true);
    }
  }, [initialQuery]);

  const searchResults = useMemo(() => {
    if (!isSearching || !searchQuery.trim()) return [];
    const q = searchQuery.trim().toLowerCase();
    return allPokemon.filter((p) => p.name.toLowerCase().includes(q));
  }, [allPokemon, searchQuery, isSearching]);

  const search = useCallback((query) => {
    const trimmed = query.trim();
    if (!trimmed) {
      setIsSearching(false);
      setSearchQuery("");
      return;
    }
    setSearchQuery(trimmed);
    setIsSearching(true);
  }, []);

  const setQuery = useCallback((query) => {
    setSearchQuery(query);
  }, []);

  const clearSearch = useCallback(() => {
    setSearchQuery("");
    setIsSearching(false);
  }, []);

  return {
    searchQuery,
    searchResults,
    isSearching,
    searchCount: searchResults.length,
    search,
    setQuery,
    clearSearch,
  };
}
