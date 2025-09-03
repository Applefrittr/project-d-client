import { useEffect, useMemo, useRef } from "react";
import Game from "../engine/Game";
import settings from "../engine/settings.json";
import MouseScrollOverlay from "../components/MouseScrollOverlay";
import Canvas from "../components/Canvas";
//import socket from "../server/socketConnection";

function SinglePlayerGame() {
  const game = useMemo(
    () => new Game(settings["arena-width"], settings["arena-height"]),
    []
  );
  const canvasRef = useRef<HTMLCanvasElement>(null);

  function pauseGame() {
    game.pause();
  }

  useEffect(() => {
    // Initialize game loop
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      game.setCanvasContext(ctx);

      game.initialize();
      game.loop(performance.now());
    }

    return () => {
      game.close();
    };
  }, []);

  return (
    <>
      <section className="relative scroll-m-0">
        <MouseScrollOverlay />
        <button
          onClick={pauseGame}
          className="m-7 bg-amber-300 p-2 hover:cursor-pointer"
        >
          Pause
        </button>
        <Canvas canvasRef={canvasRef} />
      </section>
    </>
  );
}

export default SinglePlayerGame;
