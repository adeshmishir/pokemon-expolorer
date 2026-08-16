const API_BASE_URL = "https://pokeapi.co/api/v2";

async function fetchJson(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, options);

  if (!response.ok) {
    throw new Error(`PokéAPI request failed (${response.status})`);
  }

  return response.json();
}

export const pokeApi = {
  baseUrl: API_BASE_URL,
  fetchJson,
};
