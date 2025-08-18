import GameObject from "./GameObject";

export default class Tower extends GameObject {
  constructor(x: number, y: number) {
    super();
    this.x = x;
    this.y = y;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.fillStyle = "orange";
    ctx.arc(this.x, this.y, 50, 0, 2 * Math.PI);
    ctx.fill();
    ctx.closePath();
  }
}
