import { useEffect, useMemo, useRef } from "react";
import Game from "../engine/Game";
import settings from "../engine/settings.json";
import MouseScrollOverlay from "../components/MouseScrollOverlay";

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
      game.close();
    };
  }, []);

  return (
    <>
      <section className="relative scroll-m-0">
        <MouseScrollOverlay />
        <canvas
          height={settings["arena-height"]}
          width={settings["arena-width"]}
          ref={canvasRef}
        ></canvas>
      </section>
    </>
  );
}

export default Canvas;
