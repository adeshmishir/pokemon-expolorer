import { BrowserRouter, Route, Routes } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";
import HomePage from "./pages/HomePage";
import PokemonDetailPage from "./pages/PokemonDetailPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<HomePage />} />
          <Route path="pokemon/:name" element={<PokemonDetailPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
