import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Canvas from "./pages/Canvas.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Canvas />
  </StrictMode>
);
