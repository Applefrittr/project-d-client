import type React from "react";
import settings from "../engine/settings.json";

type CanvasProps = {
  canvasRef: React.Ref<HTMLCanvasElement>;
};

function Canvas({ canvasRef }: CanvasProps) {
  return (
    <>
      <canvas
        height={settings["arena-height"]}
        width={settings["arena-width"]}
        ref={canvasRef}
      ></canvas>
    </>
  );
}

export default Canvas;
