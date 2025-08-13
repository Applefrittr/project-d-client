import settings from "../settings.json";

export default class Minion {
  x: number = 0;
  y: number = 0;
  dx: number = 0;
  dy: number = 0;
  team: "blue" | "red" | null = null;

  assignTeam(team: "red" | "blue") {
    this.team = team;
    if (team === "blue") {
      this.x = 0;
      this.y = 0;
      this.dx = 1;
      this.dy = 1;
    } else {
      this.x = settings["arena-width"];
      this.y = settings["arena-height"];
      this.dx = -1;
      this.dy = -1;
    }
  }

  reset() {
    this.team = null;
    this.x = 0;
    this.y = 0;
    this.dx = 0;
    this.dy = 0;
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (typeof this.team === "string") {
      ctx.beginPath();
      ctx.fillStyle = this.team;
      ctx.arc(this.x, this.y, 25, 0, 2 * Math.PI);
      ctx.fill();
      ctx.closePath();
    }
  }

  update(ctx: CanvasRenderingContext2D | null) {
    // check bounding of Minion, if out of bounds, reset to default settings
    if (this.x < 0 || this.x > settings["arena-width"]) this.reset();

    // update position coordinates and draw to canvas
    if (ctx && typeof this.team === "string") {
      this.x += this.dx;
      this.y += this.dy;
      this.draw(ctx);
    }
  }
}
