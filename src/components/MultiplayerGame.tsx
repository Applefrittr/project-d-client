import { useState, useRef, useEffect, useMemo } from "react";
import Canvas from "./Canvas";
import Game from "../engine/MultiplayerEngine";
import settings from "../engine/settings.json";
import MouseScrollOverlay from "./MouseScrollOverlay";
import type { GameState } from "../engine/MultiplayerEngine";
import socket from "../services/socket.io/socketInstance";
import { useNavigate } from "react-router";
import Button from "./Button";
import type { Lobby } from "../services/tanstack/queries";

function MultiplayerGame({ lobby }: { lobby: Lobby }) {
  const [gameRunning, setGameRunning] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const navigate = useNavigate();

  console.log("in multiplayer comp: ", lobby);

  const game = useMemo(
    () => new Game(settings["arena-width"], settings["arena-height"]),
    []
  );

  const sendStartSignal = () => {
    console.log("Sending sever start message");
    socket.emit("sv_start", lobby.gameID);
    setGameRunning(true);
  };

  const leaveLobby = () => {
    socket.disconnect();
    navigate("/lobbies");
  };

  useEffect(() => {
    // Initialize socket connection
    // Add room connection -> room's based on lobby generated ID
    //socket.connect();
    //socket.emit("join_lobby", lobby.gameID);

    socket.on("update", (state: GameState) => {
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
      socket.off("update");
      socket.off("cl_start");
      socket.off("connect_error");
      socket.off("sv_error");
      //socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      game.setCanvasContext(ctx);
    }
  }, [gameRunning]);
  return (
    <>
      {!gameRunning && (
        <section className="h-dvh overflow-hidden bg-[rgba(0,0,0,0.5)] flex justify-center items-center">
          <div className="p-8 bg-amber-300 rounded-md">
            <h1>Lobby</h1>
            <section>Player List</section>
            <div className="flex gap-4">
              <Button cb={sendStartSignal}>Ready</Button>
              <Button cb={leaveLobby}>Leave</Button>
            </div>
          </div>
        </section>
      )}
      {gameRunning && (
        <>
          <MouseScrollOverlay />
          <Canvas canvasRef={canvasRef} />
        </>
      )}
    </>
  );
}

export default MultiplayerGame;
