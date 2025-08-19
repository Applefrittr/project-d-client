import settings from "../settings.json";
import getDistanceBetweenObjects from "../utils/getDistanceBetweenObjects";
import roundHundrethPercision from "../utils/roundHundrethPercision";

import updateObjectVectorToTarget from "../utils/updateObjectVectorToTarget";
import GameObject from "./GameObject";

export default class Minion extends GameObject {
  team: string | null = null;
  argoRange = 200;
  radius = 25;
  avoidancePathing: string = "";

  // assigns Minion to a team and positions on canvas -> function is invoked when spawnWave is called during main Game loop
  assignTeam(team: "red" | "blue") {
    this.team = team;
    if (team === "blue") {
      this.x = settings["arena-width"] / 2;
      this.y = 0;
    } else {
      this.x = settings["arena-width"] / 2;
      this.y = settings["arena-height"];
    }
  }

  // iterates through an array of opposing Tmea GameObjects to detect potential targets and assigns the closest one as the target
  // skips if Minion is inCombat
  detectTarget(oppTeam: Set<GameObject>) {
    // if (this.inCombat) return;
    let currTarget: GameObject | null = null,
      targetDistance: number | null = Infinity;

    for (const minion of oppTeam) {
      const currDistance = getDistanceBetweenObjects(this, minion);
      if (currDistance < this.argoRange && currDistance < targetDistance) {
        currTarget = minion;
        targetDistance = currDistance;
      }
    }
    if (currTarget) {
      this.target = currTarget;
    } else {
      this.target = [...oppTeam][0];
    }
  }

  detectTeamCollision(team: Set<GameObject>) {
    //let collidedCount = 0;
    for (const minion of team) {
      if (this.id === minion.id) continue;
      const dist = getDistanceBetweenObjects(this, minion);
      // if (dist < this.radius * 2 && !this.inCombat && !minion.inCombat) {
      //   const tempX = this.dx;
      //   const tempY = this.dy;
      //   this.x += minion.dx;
      //   this.y += minion.dy;
      //   minion.x += tempX;
      //   minion.y += tempY;
      // } else

      if (dist < this.radius * 2 && !this.inCombat) {
        this.pathAroundTeamObject(minion);
      } else if (dist < this.argoRange / 2 && !this.inCombat) {
        this.avoidancePathing === "left"
          ? (this.x = roundHundrethPercision(this.x - 0.25))
          : (this.x = roundHundrethPercision(this.x + 0.25));
      }
    }
  }

  // pathing around collided team objects -> repositions Minion on the outside circumference of collided team object based on angle
  // of collision
  pathAroundTeamObject(target: GameObject) {
    if (this.team) {
      let avoidMag = this.avoidancePathing === "left" ? 0.05 : -0.05;
      if (this.team === "red") avoidMag = -avoidMag;
      const radAngle = Math.atan2(this.x - target.x, this.y - target.y);
      this.y = roundHundrethPercision(
        target.y + this.radius * 2 * Math.cos(radAngle + avoidMag)
      );
      this.x = roundHundrethPercision(
        target.x + this.radius * 2 * Math.sin(radAngle + avoidMag)
      );
    }
  }

  attack(target: GameObject) {}

  destroy(team: Set<GameObject>) {
    for (const minion of team) {
      if (this === minion) {
        this.team = null;
        this.avoidancePathing = "";
        super.reset();
        return;
      }
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (typeof this.team === "string") {
      ctx.beginPath();
      ctx.fillStyle = this.team;
      ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
      ctx.fill();
      ctx.closePath();
    }
  }

  update(ctx: CanvasRenderingContext2D | null) {
    // check bounding of Minion, if out of bounds, reset to default settings
    // TEMP - needed only during dev
    // if (this.x < 0 || this.x > settings["arena-width"]) {
    //   this.reset();
    //   return;
    // }

    // update direction vectors, position coordinates and draw to canvas
    if (ctx && typeof this.team === "string" && this.target) {
      // detect if Minion is colliding with it's target; if so, set directional vectors to 0, otherwise call updateObjectVectorToTarget(this)
      if (getDistanceBetweenObjects(this, this.target) <= this.radius * 2) {
        this.dx = 0;
        this.dy = 0;
        this.inCombat = true;
      } else {
        [this.dx, this.dy] = updateObjectVectorToTarget(this);
      }

      this.x = roundHundrethPercision(this.x + this.dx);
      this.y = roundHundrethPercision(this.y + this.dy);

      this.draw(ctx);
    }

    // testing target detection
    //if (this.target instanceof Minion) this.team = "green";
  }
}
