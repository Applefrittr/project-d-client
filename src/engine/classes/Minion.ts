import settings from "../settings.json";
import getDistanceBetweenObjects from "../utils/getDistanceBetweenObjects";
import GameObject from "./GameObject";

export default class Minion extends GameObject {
  dx: number = 0;
  dy: number = 0;
  team: string | null = null;
  target: Minion | null = null;
  argoRange = 100;

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

  // iterates through an object pool to detect potential targets and assigns the closest one as the target
  // skips if Minion already has a target assigned
  detectTarget(pool: Minion[]) {
    if (this.target) return;
    let currTarget: Minion | null = null,
      targetDistance: number | null = Infinity;

    for (let i = 0; i < pool.length; i++) {
      if (pool[i].team === this.team || pool[i].team === null) continue;

      const currDistance = getDistanceBetweenObjects(this, pool[i]);
      if (currDistance < this.argoRange && currDistance < targetDistance) {
        currTarget = pool[i];
        targetDistance = currDistance;
      }
    }
    this.target = currTarget;
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
    // TEMP - needed only during dev
    if (this.x < 0 || this.x > settings["arena-width"]) this.reset();

    // update position coordinates and draw to canvas
    if (ctx && typeof this.team === "string") {
      this.x += this.dx;
      this.y += this.dy;
      this.draw(ctx);
    }

    // testing target detection
    if (this.target) this.team = "green";
  }
}
