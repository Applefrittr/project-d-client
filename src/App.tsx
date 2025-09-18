import { HashRouter, Routes, Route } from "react-router";
import Home from "./pages/Home.tsx";
import "./main.css";
import SinglePlayerGame from "./pages/SinglePlayerGame.tsx";
import MultiplayerGame from "./pages/MultiplayerGame.tsx";
import MultiplayerLobbies from "./pages/MultiplayerLobbies.tsx";
import { RandomUserContext } from "./auth/demo/context/RandomUserContext.ts"; // demo purposes
import generateRandomUser from "./auth/demo/generateRandomUser.ts";
import { useMemo } from "react";

// Main App component -> router and all routes rendered through App
// TESTING - Demoing random user generation and Context API
function App() {
  const user = useMemo(() => generateRandomUser(), []);
  return (
    <RandomUserContext value={user}>
      <HashRouter>
        <Routes>
          <Route index element={<Home />} />
          <Route path="singleplayer" element={<SinglePlayerGame />} />
          <Route path="lobbies" element={<MultiplayerLobbies />} />
          <Route path="lobbies/:id" element={<MultiplayerGame />} />
        </Routes>
      </HashRouter>
    </RandomUserContext>
  );
}

export default App;
