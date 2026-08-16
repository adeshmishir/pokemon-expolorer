import { BrowserRouter, Route, Routes } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";
import HomePage from "./pages/HomePage";
import PokemonDetailPage from "./pages/PokemonDetailPage";
import CollectionPage from "./pages/CollectionPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<HomePage />} />
          <Route path="pokemon/:name" element={<PokemonDetailPage />} />
          <Route path="collection" element={<CollectionPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
