import {
  getPokemonList,
  getPokemonDetails,
  getPokemonByType,
} from "../services/pokeApi.js";
import { ApiError, isApiError } from "../utils/errors.js";

let passed = 0;
let failed = 0;

function assert(condition, label) {
  if (condition) {
    console.log(`  ✓ ${label}`);
    passed++;
  } else {
    console.log(`  ✗ ${label}`);
    failed++;
  }
}

function section(title) {
  console.log(`\n${title}`);
}

// ── Test 1: getPokemonList (offset 0) ──────────────────────

section("1. getPokemonList(20, 0)");
try {
  const data = await getPokemonList(20, 0);
  assert(Array.isArray(data.results), "results is an array");
  assert(data.results.length === 20, "results length is 20");
  assert(typeof data.count === "number", "count is a number");
  assert(data.count > 0, "count is greater than 0");
  assert(typeof data.results[0].name === "string", "first result has a name");
  assert(data.results[0].name === "bulbasaur", "first pokemon is bulbasaur");
  assert(typeof data.results[0].url === "string", "first result has a url");
} catch (err) {
  console.log(`  ✗ Unexpected error: ${err.message}`);
  failed++;
}

// ── Test 2: getPokemonList (offset 20) ─────────────────────

section("2. getPokemonList(20, 20)");
try {
  const data = await getPokemonList(20, 20);
  assert(Array.isArray(data.results), "results is an array");
  assert(data.results.length === 20, "results length is 20");
  assert(data.results[0].name !== "bulbasaur", "results are a different batch (not offset 0)");
} catch (err) {
  console.log(`  ✗ Unexpected error: ${err.message}`);
  failed++;
}

// ── Test 3: getPokemonDetails by name ──────────────────────

section("3. getPokemonDetails('pikachu')");
try {
  const data = await getPokemonDetails("pikachu");
  assert(data.id === 25, "id is 25");
  assert(data.name === "pikachu", "name is pikachu");
  assert(Array.isArray(data.types), "types is an array");
  assert(data.types.includes("electric"), "types includes electric");
  assert(typeof data.height === "number", "height is a number");
  assert(typeof data.weight === "number", "weight is a number");
  assert(Array.isArray(data.abilities), "abilities is an array");
  assert(Array.isArray(data.stats), "stats is an array");
  assert(data.stats.length === 6, "stats has 6 entries");
  assert(typeof data.sprites === "object", "sprites is an object");
  assert(typeof data.moves === "object", "moves is an array");
} catch (err) {
  console.log(`  ✗ Unexpected error: ${err.message}`);
  failed++;
}

// ── Test 4: getPokemonDetails by ID ────────────────────────

section("4. getPokemonDetails(25)");
try {
  const data = await getPokemonDetails(25);
  assert(data.id === 25, "id is 25");
  assert(data.name === "pikachu", "name is pikachu");
} catch (err) {
  console.log(`  ✗ Unexpected error: ${err.message}`);
  failed++;
}

// ── Test 5: getPokemonByType ───────────────────────────────

section("5. getPokemonByType('fire')");
try {
  const data = await getPokemonByType("fire");
  assert(data.type === "fire", "type is fire");
  assert(typeof data.count === "number", "count is a number");
  assert(data.count > 0, "count is greater than 0");
  assert(Array.isArray(data.pokemon), "pokemon is an array");
  assert(data.pokemon.length > 0, "pokemon list is not empty");
  assert(typeof data.pokemon[0].name === "string", "first pokemon has a name");
} catch (err) {
  console.log(`  ✗ Unexpected error: ${err.message}`);
  failed++;
}

// ── Test 6: Invalid pokemon → controlled error ─────────────

section("6. getPokemonDetails('this-pokemon-does-not-exist')");
try {
  await getPokemonDetails("this-pokemon-does-not-exist");
  console.log("  ✗ Should have thrown an error");
  failed++;
} catch (err) {
  assert(isApiError(err), "error is an ApiError");
  assert(err.status === 404, "error status is 404");
  assert(err.message.includes("404"), "error message mentions 404");
}

// ── Test 7: Network / base URL isolation ───────────────────

section("7. Service configuration");
try {
  const { pokeApi } = await import("../services/pokeApi.js");
  assert(
    pokeApi.baseUrl === "https://pokeapi.co/api/v2",
    "base URL is correct"
  );
  assert(typeof pokeApi.getPokemonList === "function", "getPokemonList is exported");
  assert(typeof pokeApi.getPokemonDetails === "function", "getPokemonDetails is exported");
  assert(typeof pokeApi.getPokemonByType === "function", "getPokemonByType is exported");
} catch (err) {
  console.log(`  ✗ Unexpected error: ${err.message}`);
  failed++;
}

// ── Test 8: URL encoding (special character name) ──────────

section("8. getPokemonDetails('nidoran-f') (URL safety)");
try {
  const data = await getPokemonDetails("nidoran-f");
  assert(data.name === "nidoran-f", "name is nidoran-f");
  assert(typeof data.id === "number", "id is a number");
} catch (err) {
  console.log(`  ✗ Unexpected error: ${err.message}`);
  failed++;
}

// ── Summary ────────────────────────────────────────────────

console.log(`\n${"─".repeat(40)}`);
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log(failed === 0 ? "All tests passed ✓" : "Some tests failed ✗");
process.exit(failed > 0 ? 1 : 0);
