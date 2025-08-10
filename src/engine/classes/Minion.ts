export default class Minion {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.fillStyle = "green";
    ctx.arc(this.x, this.y, 5, 0, 2 * Math.PI);
    ctx.fill();
    ctx.closePath();
  }

  update(ctx: CanvasRenderingContext2D | null) {
    if (ctx) {
      this.x++;
      this.y++;
      this.draw(ctx);
    }
  }
}
