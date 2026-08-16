# Pokémon Explorer

A production-quality Pokémon Explorer built with React, Vite, and Tailwind CSS, powered by the [PokéAPI](https://pokeapi.co/).

## Features

- **Pokémon Listing** — Paginated grid of all 1000+ Pokémon with artwork, ID, name, and type badges
- **Search** — Instant name search with shareable `?q=` URLs and keyboard shortcuts (Escape to clear)
- **Load More** — Append batches of 20 Pokémon with duplicate prevention
- **Pokémon Details** — Full profile: official artwork, types, height/weight, abilities, base stats, and moves
- **Type Filtering** — 18 type filter chips with a color-coded system
- **Sorting** — Sort by ID, Name, HP, Attack, or Speed
- **Compare** — Select up to 2 Pokémon for side-by-side stat comparison
- **Favorites** — Heart toggle with localStorage persistence
- **Dark Mode** — Theme toggle with system preference detection and persistence
- **Responsive Design** — Optimized for mobile (375px) through desktop (1280px+)
- **Accessibility** — Skip-to-content link, full keyboard navigation, focus-visible rings, ARIA labels, reduced-motion support
- **Error Handling** — Friendly error states with retry for all failure paths
- **Loading States** — Shimmer skeleton placeholders for every async view

## Tech Stack

| Layer | Technology |
|-------|-----------|
| UI | React 19 |
| Build | Vite 8 |
| Styling | Tailwind CSS v4 (CSS-first config) |
| Routing | React Router 7 |
| Icons | lucide-react |
| API | PokéAPI (REST, public, no auth) |

## API Used

All data comes from [PokéAPI](https://pokeapi.co/):

| Endpoint | Purpose |
|----------|---------|
| `GET /pokemon?limit=20&offset=N` | Paginated Pokémon list |
| `GET /pokemon/{name-or-id}` | Single Pokémon detail |
| `GET /type` | All Pokémon types |
| `GET /type/{name}` | Pokémon filtered by type |

Responses are normalized in the service layer (`src/services/pokeApi.js`) to a clean, consistent shape consumed by hooks and components.

## Installation

```bash
git clone https://github.com/adeshmishir/pokemon-expolorer.git
cd pokemon-expolorer
npm install
```

## Running Locally

```bash
npm run dev       # Start dev server at http://localhost:5173
npm run build     # Create production build in dist/
npm run preview   # Preview the production build locally
```

## Project Structure

```
src/
├── components/
│   ├── common/          # Generic reusable UI primitives
│   │   └── Button.jsx
│   ├── layout/          # App shell
│   │   ├── AppLayout.jsx    # Header + main + Footer + skip link
│   │   ├── Header.jsx       # Brand + dark mode toggle
│   │   └── Footer.jsx
│   ├── pokemon/         # Pokémon-specific building blocks
│   │   ├── PokemonCard.jsx      # Card with favorite + compare actions
│   │   ├── PokemonGrid.jsx      # Responsive grid
│   │   ├── TypeBadge.jsx        # Type-colored pill
│   │   ├── TypeFilter.jsx       # Type chip radio group
│   │   ├── SearchBar.jsx        # Search input + clear + Escape
│   │   ├── LoadMoreButton.jsx   # Pagination button
│   │   ├── SortSelect.jsx       # Sort dropdown
│   │   ├── ComparePanel.jsx     # Side-by-side stat comparison
│   │   └── PokemonSkeletonCard.jsx
│   └── ui/              # Feedback / system components
│       ├── LoadingSkeleton.jsx
│       ├── ErrorMessage.jsx
│       ├── EmptyState.jsx
│       └── ErrorBoundary.jsx    # Global crash fallback
├── hooks/               # Custom hooks (data + state + logic)
│   ├── usePokemonList.js
│   ├── usePokemonSearch.js
│   ├── usePokemonDetails.js
│   ├── usePokemonByType.js
│   ├── useFavorites.js
│   ├── useTheme.js
│   └── useCompare.js
├── pages/               # Route-level views (compose hooks + components)
│   ├── HomePage.jsx
│   └── PokemonDetailPage.jsx
├── services/            # THE ONLY place that touches the network
│   └── pokeApi.js
├── utils/               # Pure helpers (no React)
│   ├── cn.js
│   ├── typeColors.js
│   ├── errors.js
│   └── formatters.js
├── App.jsx              # Router + routes
├── main.jsx             # Entry point + ErrorBoundary
└── index.css            # Tailwind + theme tokens + keyframes + dark mode
```

### Architecture Rules

- **services/** — fetch + parse + normalize + errors only
- **hooks/** — data fetching orchestration + state + business logic
- **utils/** — pure, deterministic helpers
- **components/** — presentation + local UI state only
- **pages/** — composition: hooks + components per route
- No component imports from `services/` directly — always through a hook

## Challenges Faced

- **PokéAPI response normalization** — The raw API returns deeply nested, inconsistent shapes. Building a clean normalizer that strips unnecessary fields and produces predictable objects was essential for keeping all downstream code simple.
- **Race conditions in search/filter** — Rapidly switching between search and type filter could cause stale responses to overwrite newer ones. Solved with cancellation flags and fetch-ID refs in hooks.
- **Dark mode flash on load** — The theme preference is stored in localStorage, but reading it in React causes a flash of wrong theme. Solved with an inline `<script>` in `index.html` that applies the `.dark` class before React mounts.
- **Type color contrast** — Picking type colors that look vibrant while passing WCAG AA contrast ratios required careful selection of both foreground text and background colors per type.
- **SPA routing on static hosts** — BrowserRouter deep links 404 on refresh without server-side rewrite rules. Solved with Vercel's rewrite config.

## Future Improvements

- Infinite scroll with intersection observer as an alternative to Load More
- Pokémon evolution chain visualization on the detail page
- Team builder mode (select 6, see type coverage)
- Pokemon sprites gallery (all forms/generations)
- Offline support with service worker caching
- Unit and integration tests (Vitest + React Testing Library)
- E2E tests (Playwright) for critical user flows
- Performance profiling and code splitting by route

---

Data provided by [PokéAPI](https://pokeapi.co/). All Pokémon names, images, and data are trademarks of Nintendo/Creatures Inc./GAME FREAK Inc.
