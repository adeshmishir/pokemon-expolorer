import { ApiError } from "../utils/errors.js";

const API_BASE_URL = "https://pokeapi.co/api/v2";

function buildUrl(path) {
  const [pathPart, queryPart] = path.split("?");
  const safePath = pathPart
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");
  const url = `${API_BASE_URL}/${safePath}`;
  return queryPart ? `${url}?${queryPart}` : url;
}

async function request(path, options = {}) {
  const url = buildUrl(path);
  const response = await fetch(url, options);

  if (!response.ok) {
    throw new ApiError(response.status, `PokéAPI request failed (${response.status}): ${path}`);
  }

  let data;
  try {
    data = await response.json();
  } catch {
    throw new ApiError(
      500,
      `PokéAPI returned an invalid JSON response for: ${path}`
    );
  }

  return data;
}

function validateListData(data) {
  if (!data || typeof data !== "object") {
    throw new ApiError(500, "PokéAPI returned an unexpected response shape");
  }
  if (!Array.isArray(data.results)) {
    throw new ApiError(500, "PokéAPI list response missing 'results' array");
  }
}

function validateDetailData(data) {
  if (!data || typeof data !== "object") {
    throw new ApiError(500, "PokéAPI returned an unexpected response shape");
  }
  if (typeof data.id !== "number") {
    throw new ApiError(404, "Pokémon not found");
  }
}

function normalizeIdentifier(identifier) {
  if (typeof identifier === "number" || typeof identifier === "string") {
    return String(identifier).trim().toLowerCase();
  }
  throw new ApiError(400, "Invalid identifier: must be a name (string) or ID (number)");
}

// ── Pokemon names index (for search autocomplete) ──────────

let pokemonNamesCache = null;

export async function getAllPokemonNames() {
  if (pokemonNamesCache) return pokemonNamesCache;

  const data = await request("pokemon?limit=1500&offset=0");
  validateListData(data);

  pokemonNamesCache = data.results.map((p, i) => ({
    id: i + 1,
    name: p.name,
  }));

  return pokemonNamesCache;
}

// ── Public API ──────────────────────────────────────────────

export async function getPokemonList(limit = 20, offset = 0) {
  if (typeof limit !== "number" || limit < 1 || limit > 100) {
    throw new ApiError(400, "Limit must be between 1 and 100");
  }
  if (typeof offset !== "number" || offset < 0) {
    throw new ApiError(400, "Offset must be 0 or greater");
  }

  const data = await request(`pokemon?limit=${limit}&offset=${offset}`);
  validateListData(data);

  return {
    count: data.count,
    next: data.next,
    previous: data.previous,
    results: data.results.map((pokemon) => ({
      name: pokemon.name,
      url: pokemon.url,
    })),
  };
}

export async function getPokemonDetails(identifier) {
  const id = normalizeIdentifier(identifier);
  const data = await request(`pokemon/${id}`);
  validateDetailData(data);

  return {
    id: data.id,
    name: data.name,
    types: data.types.map((t) => t.type.name),
    height: data.height,
    weight: data.weight,
    abilities: data.abilities.map((a) => ({
      name: a.ability.name,
      isHidden: a.is_hidden,
    })),
    stats: data.stats.map((s) => ({
      name: s.stat.name,
      base: s.base_stat,
    })),
    sprites: {
      default: data.sprites.front_default,
      officialArtwork: data.sprites.other?.["official-artwork"]?.front_default,
    },
    moves: data.moves.map((m) => m.move.name),
  };
}

export async function getPokemonByType(type) {
  const safeType = normalizeIdentifier(type);
  const data = await request(`type/${safeType}`);

  if (!data || typeof data !== "object") {
    throw new ApiError(500, "PokéAPI returned an unexpected response shape");
  }
  if (!Array.isArray(data.pokemon)) {
    throw new ApiError(500, "PokéAPI type response missing 'pokemon' array");
  }

  return {
    type: data.name,
    count: data.pokemon.length,
    pokemon: data.pokemon
      .sort((a, b) => a.slot - b.slot)
      .map((entry) => ({
        name: entry.pokemon.name,
        url: entry.pokemon.url,
      })),
  };
}

// ── Legacy object export (backward compatible) ─────────────

export const pokeApi = {
  baseUrl: API_BASE_URL,
  getPokemonList,
  getPokemonDetails,
  getPokemonByType,
};
