import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter, Routes, Route } from "react-router";
import Home from "./pages/Home.tsx";
import "./main.css";
import SinglePlayerGame from "./pages/SinglePlayerGame.tsx";
import MultiplayerGame from "./pages/MultiplayerGame.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HashRouter>
      <Routes>
        <Route index element={<Home />} />
        <Route path="singleplayer" element={<SinglePlayerGame />} />
        <Route path="multiplayer" element={<MultiplayerGame />} />
      </Routes>
    </HashRouter>
  </StrictMode>
);
