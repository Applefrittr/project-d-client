import { HashRouter, Routes, Route } from "react-router";
import Home from "./pages/Home.tsx";
import "./main.css";
import SinglePlayerGame from "./pages/SinglePlayerGame.tsx";
import Lobby from "./pages/Lobby.tsx";
import AllLobbies from "./pages/AllLobbies.tsx";
import { RandomUserContext } from "./auth/demo/context/RandomUserContext.ts"; // demo purposes
import generateRandomUser from "./auth/demo/generateRandomUser.ts";
import { useMemo } from "react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

// Main App component -> router and all routes rendered through App
// TESTING - Demoing random user generation and Context API

const queryClient = new QueryClient();

function App() {
  const user = useMemo(() => generateRandomUser(), []);
  return (
    <QueryClientProvider client={queryClient}>
      <RandomUserContext value={user}>
        <HashRouter>
          <Routes>
            <Route index element={<Home />} />
            <Route path="singleplayer" element={<SinglePlayerGame />} />
            <Route path="lobbies" element={<AllLobbies />} />
            <Route path="lobbies/:id" element={<Lobby />} />
          </Routes>
        </HashRouter>
      </RandomUserContext>
    </QueryClientProvider>
  );
}

export default App;
