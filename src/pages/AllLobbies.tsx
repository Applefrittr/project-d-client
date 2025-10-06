import { useContext, useState } from "react";
import Button from "../components/Button";
import Navigtation from "../components/Navigation";
import LobbyList from "../components/LobbyList";
import CreateLobbyForm from "../components/CreateLobbyForm";
import { Link } from "react-router";
import { RandomUserContext } from "../auth/demo/context/RandomUserContext";

function AllLobbies() {
  const { username } = useContext(RandomUserContext);
  const [displayForm, setdisplayForm] = useState(false);
  const [selectedLobby, setSelectedLobby] = useState<number | undefined>(
    undefined
  );

  const handleSelect = (event: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
    const id = event.currentTarget.dataset.gameid ?? 0;
    setSelectedLobby(Number(id));
  };

  return (
    <>
      {/* <Navigtation /> */}
      <section className="p-6 rounded-md bg-main-theme border border-black w-full m-12 h-[90dvh] flex flex-col gap-3">
        <header className="flex justify-between">
          <h1 className="font-medium text-2xl">Current Lobbies</h1>
          <div className="flex gap-4">
            <p>{username}</p>
            <ul className="flex gap-2">
              <li>
                <Link
                  to="/"
                  className="px-8 py-2 bg-blue-800 text-white rounded-lg"
                >
                  Home
                </Link>
              </li>
            </ul>
          </div>
        </header>
        <div className="flex-auto flex justify-center items-center">
          <LobbyList
            handleSelect={handleSelect}
            selectedLobby={selectedLobby}
          />
        </div>
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
    </>
  );
}

export default AllLobbies;
