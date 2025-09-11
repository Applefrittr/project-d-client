import { useEffect, useMemo, useRef, useState } from "react";
import Game from "../engine/MultiplayerEngine";
import settings from "../engine/settings.json";
import MouseScrollOverlay from "../components/MouseScrollOverlay";
import socket from "../server/socketConnection";
import Canvas from "../components/Canvas";
import { type GameState } from "../engine/MultiplayerEngine";

function MultiplayerGame() {
  const game = useMemo(
    () => new Game(settings["arena-width"], settings["arena-height"]),
    []
  );
  const [gameRunning, setGameRunning] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const sendStartSignal = () => {
    console.log("Sending sever start message");
    socket.emit("sv_start");
    setGameRunning(true);
  };

  useEffect(() => {
    // Initialize game loop
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      game.setCanvasContext(ctx);

      //game.loop(performance.now());
    }

    // Initialize socket connection
    socket.connect();

    socket.on("update", (state: GameState) => {
      //console.log(state);
      //game.setGameObjects(state.gameObjects);
      game.appendBufferQueue(state);
    });

    socket.on("cl_start", () => {
      console.log("recieved server start msg");
      game.loop(performance.now());
    });

    socket.on("connect_error", (error) => {
      console.log(error.message);
    });

    return () => {
      game.close();
      socket.off("update");
      socket.off("cl_start");
      socket.off("connect_error");
      socket.close();
    };
  }, []);

  return (
    <>
      <section className="relative scroll-m-0">
        <MouseScrollOverlay />
        {!gameRunning && (
          <button
            className="p-3 rounded-b-sm bg-amber-100 absolute top-8 left-1/2"
            onClick={sendStartSignal}
          >
            Start
          </button>
        )}
        <Canvas canvasRef={canvasRef} />
      </section>
    </>
  );
}

export default MultiplayerGame;
