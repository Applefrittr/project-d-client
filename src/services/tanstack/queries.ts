import { serverBaseURL } from "../serverBaseURL";

export type Lobby = {
  gameID: number;
  name: string;
  playerCount: number;
  sockets: string[];
  players: { username: string; ready: boolean }[];
  host: string;
  gameRunning: boolean;
};

export async function getLobbyList() {
  try {
    const response = await fetch(`${serverBaseURL}/lobbies`);
    if (!response.ok) {
      throw new Error("Error fetching current lobbies");
    }
    return response.json();
  } catch (err) {
    if (err instanceof Error) throw err;
    throw new Error("Failed to connect to server!");
  }
}

export async function getLobby(gameID: number) {
  try {
    const response = await fetch(`${serverBaseURL}/lobbies/${gameID}`);
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err);
    }
    return response.json();
  } catch (err) {
    if (err instanceof Error) throw err;
    throw new Error("Failed to connect to server!");
  }
}

export async function createLobby(lobby: Lobby) {
  try {
    const response = await fetch(`${serverBaseURL}/lobbies/create`, {
      mode: "cors",
      method: "Post",
      body: JSON.stringify(lobby),
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.json();
  } catch (err) {
    throw new Error("Failed to connect to server!");
  }
}
