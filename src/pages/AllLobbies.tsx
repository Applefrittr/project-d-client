import { useState } from "react";
import Button from "../components/Button";
import Navigtation from "../components/Navigation";
import LobbyList from "../components/LobbyList";
import CreateLobbyForm from "../components/CreateLobbyForm";

function MultiplayerLobbies() {
  const [displayForm, setdisplayForm] = useState(false);

  return (
    <main className="flex justify-center items-center h-dvh">
      <Navigtation />
      <section className="p-8 rounded-md bg-main-theme">
        <h1>Current Lobbies</h1>
        <LobbyList />
        <div className="flex gap-6">
          <Button>Join</Button>
          <Button cb={() => setdisplayForm(true)}>Create</Button>
        </div>
      </section>
      {displayForm && <CreateLobbyForm setDisplayForm={setdisplayForm} />}
    </main>
  );
}

export default MultiplayerLobbies;
