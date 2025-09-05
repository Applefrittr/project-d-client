import FPSController from "./classes/FPSController";
import settings from "./settings.json";

export default class BaseEngine {
  ctx: CanvasRenderingContext2D | null = null;
  canvasWidth: number;
  canvasHeight: number;
  frame: number = 0;
  fpsController = new FPSController();
  renderRate = 1000 / settings["fps"];

  constructor(width: number, height: number) {
    this.canvasWidth = width;
    this.canvasHeight = height;
  }

  setCanvasContext(ctx: CanvasRenderingContext2D | null) {
    this.ctx = ctx;
  }
}
