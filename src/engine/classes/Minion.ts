import settings from "../settings.json";
import getDistanceBetweenObjects from "../utils/getDistanceBetweenObjects";
import updateObjectPathingToTarget from "../utils/updateObjectPathingToTarget";
import GameObject from "./GameObject";

export default class Minion extends GameObject {
  team: string | null = null;
  argoRange = 200;

  // assigns Minion to a team and positions on canvas -> function is invoked when spawnWave is called during main Game loop
  assignTeam(team: "red" | "blue") {
    this.team = team;
    if (team === "blue") {
      this.x = 250;
      this.y = 0;
      this.targetCoordinates = {
        x: settings["arena-width"],
        y: settings["arena-height"],
      };
      // this.dx = 1;
      // this.dy = 1;
    } else {
      this.x = settings["arena-width"] - 200;
      this.y = settings["arena-height"];
      this.targetCoordinates = { x: 0, y: 0 };
      // this.dx = -1;
      // this.dy = -1;
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
    if (currTarget) {
      this.target = currTarget;
      this.targetCoordinates = { x: this.target.x, y: this.target.y };
    }
  }

  reset() {
    this.team = null;
    super.reset();
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
    if (this.x < 0 || this.x > settings["arena-width"]) {
      this.reset();
      return;
    }

    // update position coordinates and draw to canvas
    if (ctx && typeof this.team === "string") {
      [this.dx, this.dy] = updateObjectPathingToTarget(this);
      this.x += this.dx;
      this.y += this.dy;
      this.draw(ctx);
    }

    // testing target detection
    //if (this.target) this.team = "green";
  }
}
