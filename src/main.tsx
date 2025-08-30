import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter, Routes, Route } from "react-router";
import Canvas from "./pages/Canvas.tsx";
import Home from "./pages/Home.tsx";
import "./main.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HashRouter>
      <Routes>
        <Route index element={<Home />} />
        <Route path="game" element={<Canvas />} />
      </Routes>
    </HashRouter>
  </StrictMode>
);
