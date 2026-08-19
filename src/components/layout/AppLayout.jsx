import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import PokedexBackground from "../backgrounds/PokedexBackground";

export default function AppLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <PokedexBackground />
      <a
        href="#main-content"
        className="sr-only z-50 rounded bg-[var(--color-pokeball-red)] px-4 py-2 text-sm font-medium text-white focus:not-sr-only focus:absolute focus:top-2 focus:left-2"
      >
        Skip to main content
      </a>
      <Header />
      <main
        id="main-content"
        tabIndex={-1}
        className="relative z-10 flex-1 outline-none"
      >
        <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:py-10">
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  );
}
