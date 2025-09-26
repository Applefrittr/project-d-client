import { useState, useRef, useEffect, useMemo, useContext } from "react";
import Canvas from "./Canvas";
import Game, { type GameState } from "../engine/MultiplayerEngine";
import settings from "../engine/settings.json";
import MouseScrollOverlay from "./MouseScrollOverlay";
import socket from "../services/socket.io/socketInstance";
import { useNavigate } from "react-router";
import Button from "./Button";
import type { Lobby } from "../services/tanstack/queries";
import { RandomUserContext } from "../auth/demo/context/RandomUserContext";

type MultiplayerGameState = {
  lobby: Lobby | null;
  gameRunning: boolean;
};

function MultiplayerGame({ lobby }: { lobby: Lobby }) {
  const [state, setState] = useState<MultiplayerGameState>({
    lobby,
    gameRunning: false,
  });
  const user = useContext(RandomUserContext);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const navigate = useNavigate();

  const game = useMemo(
    () => new Game(settings["arena-width"], settings["arena-height"]),
    []
  );

  const sendStartSignal = () => {
    console.log("Sending sever start message");
    socket.emit("sv_start", lobby.gameID);
    setState({ ...state, gameRunning: true });
  };

  const leaveLobby = () => {
    navigate("/lobbies");
  };

  useEffect(() => {
    // Initialize socket connection
    // Add room connection -> room's based on lobby generated ID
    socket.connect();
    socket.emit("lby_join", lobby.gameID, user);

    socket.on("update_game", (state: GameState) => {
      game.appendBufferQueue(state);
    });

    socket.on("lby_update", (lobbyData: Lobby) => {
      setState({ ...state, lobby: lobbyData });
    });

    socket.on("cl_start", () => {
      console.log("recieved server start msg");
      game.loop(performance.now());
    });

    socket.on("connect_error", (error) => {
      console.log(error.message);
    });

    socket.on("sv_error", (msg) => {
      console.log(msg);
    });

    return () => {
      game.close();
      socket.off("update_game");
      socket.off("cl_start");
      socket.off("lby_update");
      socket.off("connect_error");
      socket.off("sv_error");
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      game.setCanvasContext(ctx);
    }
  }, [state.gameRunning]);

  if (!state.lobby) {
    return (
      <div>
        Lobby Closed!
        <Button cb={leaveLobby}>Leave</Button>
      </div>
    );
  }

  return (
    <>
      {!state.gameRunning && (
        <section className="h-dvh w-full bg-[rgba(0,0,0,0.5)] flex justify-center items-center">
          <div className="p-9 bg-amber-300 rounded-md">
            <h1 className="text-4xl font-bold">{state.lobby?.name}</h1>
            <section>
              Players
              <ul>
                {state.lobby?.players.map((player) => {
                  return (
                    <li key={player} className="p-3 w-full">
                      {player === state.lobby?.host
                        ? `${player} (host)`
                        : player}
                    </li>
                  );
                })}
              </ul>
            </section>
            <div className="flex gap-4">
              <Button cb={sendStartSignal}>Ready</Button>
              <Button cb={leaveLobby}>Leave</Button>
            </div>
          </div>
        </section>
      )}
      {state.gameRunning && (
        <>
          <MouseScrollOverlay />
          <Canvas canvasRef={canvasRef} />
        </>
      )}
    </>
  );
}

export default MultiplayerGame;
