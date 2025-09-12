import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import Button from "../components/Button";

type LobbyData = {
  id: number;
  playerCount: number;
  name: string;
};

type LobbyListState = {
  lobbies: LobbyData[];
  isCreating: boolean;
};

function MultiplayerLobbies() {
  const [state, setState] = useState<LobbyListState>({
    lobbies: [],
    isCreating: false,
  });
  const navigate = useNavigate();

  const createLobby = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // create new Lobby Data and send to server
    // redirect to Lobby page
    const id = Math.floor(Math.random() * 1000000); // random lobby ID generation
    navigate(`/lobbies/${id}`);
  };

  useEffect(() => {
    // Fetch lobbies from the server
    // setState({ ...state, lobbies: faetchedData})
  }, []);

  return (
    <main className="flex justify-center items-center h-dvh">
      <section className="p-8 rounded-md bg-blue-200">
        <h1>Current Lobbies</h1>
        <div>
          {state.lobbies &&
            state.lobbies.map((lobby) => {
              return (
                <div>
                  <p>{lobby.name}</p>
                  <p>{lobby.playerCount} / 2</p>
                </div>
              );
            })}
        </div>
        <div className="flex gap-6">
          <Button>Join</Button>
          <Button cb={() => setState({ ...state, isCreating: true })}>
            Create
          </Button>
        </div>
      </section>
      {state.isCreating && (
        <section>
          <form onSubmit={(event) => createLobby(event)}>
            <label htmlFor="lobby-name">Name</label>
            <input id="lobby-name" name="name" placeholder="Lobby Name"></input>
            <div className="flex gap-6">
              <Button type={"submit"}>Create</Button>
              <Button
                cb={() => setState({ ...state, isCreating: false })}
                type={"button"}
              >
                Cancel
              </Button>
            </div>
          </form>
        </section>
      )}
    </main>
  );
}

export default MultiplayerLobbies;
