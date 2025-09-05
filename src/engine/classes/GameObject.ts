import Vector from "./Vector";

export default class GameObject {
  id: number = -1;
  position: Vector = new Vector(0, 0);
  velocity: Vector = new Vector(0, 0);
  radius: number = 0;
  target: GameObject | null = null;
  hitPoints: number = 0;
  inCombat: boolean = false;
  team: string = "";

  reset() {
    this.position = new Vector(0, 0);
    this.velocity = new Vector(0, 0);
    this.radius = 0;
    this.target = null;
    this.hitPoints = 0;
    this.team = "";
    this.inCombat = false;
  }

  draw(ctx: CanvasRenderingContext2D | null) {
    if (ctx) {
      ctx.beginPath();
      ctx.fillStyle = this.team;
      ctx.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI);
      ctx.fill();
      ctx.closePath();

      ctx.fillStyle = "black";
      ctx.font = "16px serif";
      ctx.fillText(this.hitPoints.toString(), this.position.x, this.position.y);
      ctx.fillText(
        JSON.stringify(this.velocity),
        this.position.x,
        this.position.y + 16
      );
      ctx.fillText(this.id.toString(), this.position.x, this.position.y + 32);
    }
  }
}
