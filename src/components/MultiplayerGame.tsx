import { useState, useRef, useEffect, useMemo } from "react";
import Canvas from "./Canvas";
import Game, { type GameState } from "../engine/MultiplayerEngine";
import settings from "../engine/settings.json";
import MouseScrollOverlay from "./MouseScrollOverlay";
import socket from "../services/socket.io/socketInstance";
import { useNavigate } from "react-router";
import Button from "./Button";
import type { Lobby } from "../services/tanstack/queries";

type MultiplayerGameState = {
  lobby: Lobby;
  gameRunning: boolean;
};

function MultiplayerGame({ lobby }: { lobby: Lobby }) {
  const [state, setState] = useState<MultiplayerGameState>({
    lobby,
    gameRunning: false,
  });
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
    socket.disconnect();
    navigate("/lobbies");
  };

  useEffect(() => {
    // Initialize socket connection
    // Add room connection -> room's based on lobby generated ID
    socket.connect();
    socket.emit("join_lobby", lobby.gameID);

    socket.on("update_game", (state: GameState) => {
      game.appendBufferQueue(state);
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
  return (
    <>
      {!state.gameRunning && (
        <section className="h-dvh overflow-hidden bg-[rgba(0,0,0,0.5)] flex justify-center items-center">
          <div className="p-9 bg-amber-300 rounded-md">
            <h1 className="text-4xl font-bold">{state.lobby.name}</h1>
            <section>
              Players
              <ul>
                {state.lobby.players.map((player) => {
                  return (
                    <li key={player} className="p-3 w-full">
                      {player}
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
