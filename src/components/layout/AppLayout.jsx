import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

export default function AppLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#main-content"
        className="sr-only z-50 rounded bg-[var(--color-pokeball-red)] px-4 py-2 text-sm font-medium text-white focus:not-sr-only focus:absolute focus:top-2 focus:left-2"
      >
        Skip to main content
      </a>
      <Header />
      <div className="relative flex-1">
        <div className="pokedex-bg pointer-events-none absolute inset-0 opacity-30 dark:opacity-20" aria-hidden="true" />
        <main
          id="main-content"
          tabIndex={-1}
          className="relative mx-auto w-full max-w-6xl px-4 py-8 outline-none sm:py-10"
        >
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
}
