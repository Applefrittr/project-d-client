import { useEffect, useMemo, useRef } from "react";
import Game from "../engine/MultiplayerEngine";
import settings from "../engine/settings.json";
import MouseScrollOverlay from "../components/MouseScrollOverlay";
import socket from "../server/socketConnection";
import Canvas from "../components/Canvas";

function MultiplayerGame() {
  const game = useMemo(
    () => new Game(settings["arena-width"], settings["arena-height"]),
    []
  );
  const canvasRef = useRef<HTMLCanvasElement>(null);

  //   function pauseGame() {
  //     game.pause();
  //   }

  useEffect(() => {
    // Initialize game loop
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      game.setCanvasContext(ctx);

      game.loop(performance.now());
    }

    // Initialize socket connection
    socket.connect();

    socket.on("update", (state) => {
      console.log(state);
      game.setGameObjects(state.gameObjects);
    });

    socket.on("connect_error", (error) => {
      console.log(error.message);
    });

    return () => {
      game.close();
      socket.off("update");
      socket.off("connect_error");
      socket.close();
    };
  }, []);

  return (
    <>
      <section className="relative scroll-m-0">
        <MouseScrollOverlay />
        <button
          //onClick={pauseGame}
          className="m-7 bg-amber-300 p-2 hover:cursor-pointer"
        >
          Pause
        </button>
        <Canvas canvasRef={canvasRef} />
      </section>
    </>
  );
}

export default MultiplayerGame;
