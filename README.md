# Pokémon Explorer

A production-quality Pokémon Explorer built with React, Vite, and Tailwind CSS, powered by the [PokéAPI](https://pokeapi.co/).

## Stack

- React 19 + Vite
- Tailwind CSS v4 (CSS-first configuration)
- react-router-dom
- lucide-react

## Getting started

```bash
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

## Available scripts

| Script        | Description                                  |
| ------------- | -------------------------------------------- |
| `npm run dev`    | Start the Vite dev server                    |
| `npm run build`  | Create a production build                    |
| `npm run preview`| Preview the production build locally         |

## Project structure

```
src/
├── components/
│   ├── common/      # Generic reusable UI primitives
│   ├── layout/      # App shell (Header, Footer, AppLayout)
│   ├── pokemon/     # Pokémon-specific components
│   └── ui/          # Feedback components (skeleton, error, empty state)
├── hooks/           # Custom hooks (used in later steps)
├── pages/           # Route-level views
├── services/        # PokéAPI layer (UI-independent)
├── utils/           # Small helper functions
├── App.jsx          # Router + route definitions
├── main.jsx         # React entry point
└── index.css        # Tailwind import + theme tokens
```

## Roadmap

- Pokémon listing & search
- Pagination / load more
- Pokémon details page
- Type filtering & type-based colors
- Loading skeletons, error handling, empty states
- Animations & responsive polish
