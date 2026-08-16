import { useState, useCallback, useEffect, useRef } from "react";
import { getPokemonDetails } from "../services/pokeApi";
import { isApiError } from "../utils/errors";

export default function usePokemonSearch(initialQuery = "") {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [searchResult, setSearchResult] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const didAutoSearch = useRef(false);

  useEffect(() => {
    if (initialQuery.trim() && !didAutoSearch.current) {
      didAutoSearch.current = true;
      const normalized = initialQuery.trim().toLowerCase();
      setIsSearching(true);
      setSearchLoading(true);
      getPokemonDetails(normalized)
        .then((data) => {
          setSearchResult(data);
          setSearchLoading(false);
        })
        .catch((err) => {
          setSearchLoading(false);
          if (isApiError(err) && err.status === 404) {
            setSearchError("not_found");
          } else {
            setSearchError("api_error");
          }
        });
    }
  }, [initialQuery]);

  const search = useCallback((query) => {
    const trimmed = query.trim();
    if (!trimmed) return;

    const normalized = trimmed.toLowerCase();
    setSearchQuery(normalized);
    setIsSearching(true);
    setSearchLoading(true);
    setSearchError(null);
    setSearchResult(null);

    getPokemonDetails(normalized)
      .then((data) => {
        setSearchResult(data);
        setSearchLoading(false);
      })
      .catch((err) => {
        setSearchLoading(false);
        if (isApiError(err) && err.status === 404) {
          setSearchError("not_found");
        } else {
          setSearchError("api_error");
        }
      });
  }, []);

  const setQuery = useCallback((query) => {
    setSearchQuery(query.trim().toLowerCase());
  }, []);

  const clearSearch = useCallback(() => {
    setSearchQuery("");
    setSearchResult(null);
    setSearchLoading(false);
    setSearchError(null);
    setIsSearching(false);
  }, []);

  return {
    searchQuery,
    searchResult,
    searchLoading,
    searchError,
    isSearching,
    search,
    setQuery,
    clearSearch,
  };
}
