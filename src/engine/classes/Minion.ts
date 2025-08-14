import settings from "../settings.json";
import getDistanceBetweenObjects from "../utils/getDistanceBetweenObjects";

import updateObjectVectorToTarget from "../utils/updateObjectVectorToTarget";
import Fortress from "./Fortress";
import GameObject from "./GameObject";

export default class Minion extends GameObject {
  team: string | null = null;
  argoRange = 200;

  // assigns Minion to a team and positions on canvas -> function is invoked when spawnWave is called during main Game loop
  assignTeam(team: "red" | "blue") {
    this.team = team;
    if (team === "blue") {
      this.x = 100;
      this.y = 0;
    } else {
      this.x = settings["arena-width"] - 40;
      this.y = settings["arena-height"];
    }
  }

  // iterates through an object pool to detect potential targets and assigns the closest one as the target
  // skips if Minion already has a target assigned
  detectTarget(pool: Minion[]) {
    if (!(this.target instanceof Fortress)) return;
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

    // update direction vectors, position coordinates and draw to canvas
    if (ctx && typeof this.team === "string") {
      [this.dx, this.dy] = updateObjectVectorToTarget(this);
      this.x = Math.round(this.x + this.dx);
      this.y = Math.round(this.y + this.dy);
      this.draw(ctx);
    }

    // testing target detection
    if (this.target instanceof Minion) this.team = "green";
  }
}
