import { serverBaseURL } from "../serverBaseURL";

export type Lobby = {
  gameID: number;
  name: string;
  playerCount: number;
  sockets: string[];
  players: string[];
  host: string;
};

export async function getLobbyList() {
  const response = await fetch(`${serverBaseURL}/lobbies`);
  if (!response.ok) {
    throw new Error("Error fetching current lobbies");
  }
  return response.json();
}

export async function getLobby(gameID: number) {
  const response = await fetch(`${serverBaseURL}/lobbies/${gameID}`);
  if (!response.ok) {
    throw new Error("Error fetching lobby info");
  }
  return response.json();
}

export async function createLobby(lobby: Lobby) {
  const response = await fetch(`${serverBaseURL}/lobbies/create`, {
    mode: "cors",
    method: "Post",
    body: JSON.stringify(lobby),
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.json();
}
