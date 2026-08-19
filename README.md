# 🎮 Pokémon Explorer

A production-ready Pokémon Explorer built with **React 19, Vite, Tailwind CSS, and PokéAPI**. The application provides a fast, responsive Pokédex experience with global search, filtering, sorting, favorites, comparison, and detailed Pokémon profiles.

🔗 **Live Demo:** https://pokemon-expolorer-azure.vercel.app/
💻 **GitHub:** https://github.com/adeshmishir/pokemon-expolorer

---

## 🚀 Why This Project?

Pokémon Explorer was built to demonstrate how a real-world React application can handle:

* API-driven data at scale
* Search and autocomplete
* Client-side filtering and sorting
* Pagination and incremental loading
* Race-condition-safe asynchronous requests
* Persistent client-side state
* Responsive and accessible UI
* Production-ready error and loading states

Rather than building a simple Pokémon card grid, the project focuses on **clean architecture, reusable components, and a smooth user experience**.

---

## ✨ Key Features

### 🔎 Global Pokémon Search

* Search across the complete Pokémon dataset
* Instant search results and autocomplete suggestions
* Shareable `?q=` search URLs
* `Escape` shortcut to clear search
* Empty search automatically restores the default Pokémon listing
* Handles invalid searches with a dedicated empty state

### 📊 Filtering & Sorting

* Filter Pokémon by all 18 Pokémon types
* Four sorting modes:

  * Lowest to Highest
  * Highest to Lowest
  * A-Z
  * Z-A
* Search, filtering, and sorting work together across the complete dataset
* Pagination is applied after search/filter/sort processing

### 📚 Pokémon Details

Dedicated detail pages containing:

* Official artwork
* Pokémon ID and name
* Types
* Height and weight
* Abilities
* Base statistics
* Moves

### ❤️ Favorites

* Add/remove Pokémon from favorites
* Persistent using `localStorage`
* State remains available across page refreshes

### ⚔️ Pokémon Comparison

* Select up to two Pokémon
* Side-by-side comparison
* Compare important base statistics

### 🌙 Dark Mode

* Light/dark theme switching
* System preference detection
* Persistent theme preference
* Prevents theme flash during initial page load

### 📱 Responsive & Accessible

Designed for:

* Mobile — 375px+
* Tablet
* Desktop — 1280px+

Includes:

* Keyboard navigation
* Focus-visible states
* ARIA labels
* Skip-to-content navigation
* Reduced-motion support
* Responsive layouts

### 🛡️ Production UX

* Loading skeletons
* Friendly error states
* Retry functionality
* Empty states
* Global error boundary
* Race-condition protection for asynchronous requests

---

## 🧠 Technical Highlights

### Scalable Data Flow

The application follows a clear data-processing pipeline:

```text
PokéAPI
   ↓
Service Layer
   ↓
Custom Hooks
   ↓
Search / Filter / Sort
   ↓
Pagination
   ↓
Reusable React Components
```

This keeps network logic, business logic, and presentation separate.

### Race-Condition Safe Search

Rapid search/filter changes can cause asynchronous responses to arrive out of order.

The project handles this using **request cancellation and fetch-ID tracking**, ensuring stale API responses cannot overwrite newer state.

### API Response Normalization

PokéAPI responses contain deeply nested structures and more information than the UI requires.

A dedicated service layer normalizes API responses into predictable application-level objects before they reach the components.

### Persistent Client State

`localStorage` is used for:

* Favorites
* Theme preference

This allows important UI preferences to survive page refreshes.

### Production Routing

The application uses **React Router** with SPA rewrite configuration for static deployment environments such as Vercel.

---

## 🏗️ Architecture

```text
src/
│
├── components/
│   ├── common/
│   ├── layout/
│   ├── pokemon/
│   └── ui/
│
├── hooks/
│   ├── usePokemonList.js
│   ├── usePokemonSearch.js
│   ├── usePokemonDetails.js
│   ├── usePokemonByType.js
│   ├── useFavorites.js
│   ├── useTheme.js
│   └── useCompare.js
│
├── pages/
│   ├── HomePage.jsx
│   └── PokemonDetailPage.jsx
│
├── services/
│   └── pokeApi.js
│
├── utils/
│
├── App.jsx
├── main.jsx
└── index.css
```

### Architecture Principles

| Layer         | Responsibility                              |
| ------------- | ------------------------------------------- |
| `services/`   | API requests, normalization, error handling |
| `hooks/`      | Data orchestration and business logic       |
| `utils/`      | Pure reusable utilities                     |
| `components/` | UI and presentation                         |
| `pages/`      | Route-level composition                     |

**Network access is isolated inside the service layer**, keeping components independent from the API implementation.

---

## 🛠️ Tech Stack

| Technology          | Purpose                 |
| ------------------- | ----------------------- |
| **React 19**        | UI development          |
| **Vite 8**          | Build tooling           |
| **Tailwind CSS v4** | Styling                 |
| **React Router 7**  | Client-side routing     |
| **Lucide React**    | Icons                   |
| **PokéAPI**         | Pokémon data            |
| **localStorage**    | Client-side persistence |
| **Vercel**          | Deployment              |

---

## 📈 Engineering Challenges

### 1. Handling API Data at Scale

Built reusable fetching and normalization logic to work with **1000+ Pokémon** while keeping components simple and predictable.

### 2. Search Race Conditions

Rapid queries could cause stale API responses to overwrite newer results. Implemented cancellation/fetch-ID protection to ensure only the latest request updates the UI.

### 3. Global Search & Sorting

Search and sorting are designed around the complete Pokémon dataset rather than only the currently visible cards, with pagination applied afterward.

```text
All Pokémon
     ↓
Search
     ↓
Filter
     ↓
Sort
     ↓
Pagination
     ↓
UI
```

### 4. Theme Flash

Prevented the incorrect theme from flashing during application startup by applying the stored/system theme before React mounts.

### 5. Responsive UI

Designed the interface to remain usable from small mobile screens through large desktop displays without duplicating layouts.

### 6. Error & Loading UX

Every asynchronous view includes appropriate loading, error, retry, and empty states instead of leaving users with blank screens.

---

## 📦 Getting Started

### Clone

```bash
git clone https://github.com/adeshmishir/pokemon-expolorer.git
cd pokemon-expolorer
```

### Install

```bash
npm install
```

### Development

```bash
npm run dev
```

### Production Build

```bash
npm run build
```

### Preview

```bash
npm run preview
```

---

## 🎯 What This Project Demonstrates

This project demonstrates practical experience with:

* React application architecture
* REST API integration
* Custom React hooks
* Asynchronous state management
* Search and autocomplete
* Filtering and sorting
* Pagination
* Race-condition handling
* Client-side persistence
* Responsive UI development
* Accessibility
* Error handling
* Production builds
* SPA routing and deployment

---

## 🔮 Future Improvements

Potential next steps:

* Pokémon evolution-chain visualization
* Team builder with type coverage analysis
* Pokémon forms and generations gallery
* Offline-first support
* Vitest + React Testing Library coverage
* Playwright E2E testing
* Route-level code splitting
* Performance profiling

---

## 📸 Project Preview

*Add screenshots or a short GIF here showing the main Pokédex, search suggestions, Pokémon details, and comparison experience.*

---

## 📄 License & Data

Pokémon data is provided by **PokéAPI**.

Pokémon names, artwork, and related intellectual property belong to Nintendo, Creatures Inc., and GAME FREAK Inc.

---

### 👨‍💻 Author

**Adesh Mishra**

B.Tech CSE — IIIT Bhopal

[GitHub](https://github.com/adeshmishir) • [LinkedIn](https://www.linkedin.com/in/adesh-mishra/)
