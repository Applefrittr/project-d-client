import Minion from "./classes/Minion";

export default class Game {
  ctx: CanvasRenderingContext2D | null = null;
  canvasWidth: number;
  canvasHeight: number;
  frame: number = 0;
  minionArr: Minion[] = [new Minion(0, 0)];

  constructor(width: number, height: number) {
    this.canvasWidth = width;
    this.canvasHeight = height;
  }

  setCanvasContext(ctx: CanvasRenderingContext2D | null) {
    this.ctx = ctx;
  }

  update() {
    if (this.ctx) {
      this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
      this.minionArr.forEach((minion) => {
        minion.update(this.ctx);
      });
    }
  }

  stop() {
    window.cancelAnimationFrame(this.frame);
  }

  loop = (currTime: number) => {
    this.frame = window.requestAnimationFrame(this.loop);
    console.log(this.frame, currTime);
    this.update();
  };
}
