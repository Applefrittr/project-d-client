import { useState } from "react";
import Button from "../components/Button";
import Navigtation from "../components/Navigation";
import LobbyList from "../components/LobbyList";
import CreateLobbyForm from "../components/CreateLobbyForm";
import { Link } from "react-router";

function AllLobbies() {
  const [displayForm, setdisplayForm] = useState(false);
  const [selectedLobby, setSelectedLobby] = useState<number | undefined>(
    undefined
  );

  const handleSelect = (event: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
    const id = event.currentTarget.dataset.gameid ?? 0;
    setSelectedLobby(Number(id));
  };

  return (
    <main className="flex justify-center items-center h-dvh">
      <Navigtation />
      <section className="p-8 rounded-md bg-main-theme">
        <h1>Current Lobbies</h1>
        <LobbyList handleSelect={handleSelect} selectedLobby={selectedLobby} />
        <div className="flex gap-6">
          {selectedLobby && (
            <Link
              to={`/lobbies/${selectedLobby}`}
              className="px-8 py-2 bg-blue-800 text-white rounded-lg"
            >
              Join
            </Link>
          )}
          {!selectedLobby && <Button disabled={true}>Join</Button>}
          <Button cb={() => setdisplayForm(true)}>Create</Button>
        </div>
      </section>
      {displayForm && <CreateLobbyForm setDisplayForm={setdisplayForm} />}
    </main>
  );
}

export default AllLobbies;
