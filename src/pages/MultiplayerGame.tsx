import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";
import Game from "../engine/MultiplayerEngine";
import settings from "../engine/settings.json";
import MouseScrollOverlay from "../components/MouseScrollOverlay";
import socket from "../services/socketInstance";
import Canvas from "../components/Canvas";
import Button from "../components/Button";
import { type GameState } from "../engine/MultiplayerEngine";
import Navigtation from "../components/Navigation";

function MultiplayerGame() {
  const game = useMemo(
    () => new Game(settings["arena-width"], settings["arena-height"]),
    []
  );

  const [gameRunning, setGameRunning] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const navigate = useNavigate();
  const { id } = useParams();

  const sendStartSignal = () => {
    console.log("Sending sever start message");
    socket.emit("sv_start", id);
    setGameRunning(true);
  };

  const leaveLobby = () => {
    // go back to lobby list
    // emit to socket that player is leaving lobby
    navigate("/lobbies");
  };

  useEffect(() => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      game.setCanvasContext(ctx);
    }

    // Initialize socket connection
    // Add room connection -> room's based on lobby generated ID
    socket.connect();

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

    socket.emit("join_lobby", id);

    return () => {
      game.close();
      socket.off("update");
      socket.off("cl_start");
      socket.off("connect_error");
      socket.close();
    };
  }, []);

  return (
    <main className="scroll-m-0 min-h-dvh">
      <Navigtation />
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

      <MouseScrollOverlay />
      <Canvas canvasRef={canvasRef} />
    </main>
  );
}

export default MultiplayerGame;
