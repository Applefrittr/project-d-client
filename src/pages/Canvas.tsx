import { useEffect, useMemo, useRef } from "react";
import Game from "../engine/Game";
import settings from "../engine/settings.json";

function Canvas() {
  const game = useMemo(
    () => new Game(settings["arena-width"], settings["arena-height"]),
    []
  );
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      game.setCanvasContext(ctx);
      game.loop(performance.now());
    }

    return () => {
      game.stop();
    };
  }, []);

  return (
    <>
      <h1>Project D</h1>
      <canvas
        height={settings["arena-height"]}
        width={settings["arena-width"]}
        ref={canvasRef}
      ></canvas>
    </>
  );
}

export default Canvas;
