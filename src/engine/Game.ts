import FPSController from "./classes/FPSController";
import Minion from "./classes/Minion";
import settings from "./settings.json";

export default class Game {
  ctx: CanvasRenderingContext2D | null = null;
  canvasWidth: number;
  canvasHeight: number;
  frame: number = 0;
  fpsController = new FPSController();
  minionArr = [new Minion(0, 0)];
  timeDelta = 0;
  renderRate = 1000 / settings["fps"];

  constructor(width: number, height: number) {
    this.canvasWidth = width;
    this.canvasHeight = height;
  }

  setCanvasContext(ctx: CanvasRenderingContext2D | null) {
    this.ctx = ctx;
  }

  render() {
    if (this.ctx) {
      this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
      this.minionArr.forEach((minion) => {
        minion.update(this.ctx);
      });
    }
  }

  close() {
    window.cancelAnimationFrame(this.frame);
  }

  loop = (msNow: number) => {
    this.frame = window.requestAnimationFrame(this.loop);
    if (!this.fpsController.renderFrame(msNow)) return;
    this.render();
  };
}
