import settings from "../settings.json";
import roundHundrethPercision from "../utils/roundHundrethPercision";
import handleObjectCollision from "../utils/handleObjectCollision";
import updateObjectVectorToTarget from "../utils/updateObjectVectorToTarget";
import GameObject from "./GameObject";
import getDistanceBetweenVectors from "../utils/getDistanceBetweenVectors";

export default class Minion extends GameObject {
  team: string | null = null;
  argoRange = 200;
  lookAhead = { x: 0, y: 0 };
  lookAhead2x = { x: 0, y: 0 };
  radius = settings["minion-radius"];
  prevAttackTime: number = 0;
  visionConeWidth: number = Math.PI / 4;
  visConeRight: number = 0;
  visConeLeft: number = 0;

  // assigns Minion to a team and positions on canvas -> function is invoked when spawnWave is called during main Game loop
  assignTeam(team: "red" | "blue") {
    this.team = team;
    if (team === "blue") {
      this.position.x = settings["arena-width"] / 2;
      this.position.y = settings["tower-radius"] + 50;
    } else {
      this.position.x = settings["arena-width"] / 2;
      this.position.y =
        settings["arena-height"] - settings["tower-radius"] - 50;
    }
  }

  // iterates through the Set of opposing team GameObjects to detect potential targets and assigns the closest one to the Minion as the target
  // skips if Minion is inCombat
  detectTarget(oppTeam: Set<GameObject>) {
    if (this.inCombat) return;
    let currTarget: GameObject | null = null,
      targetDistance: number | null = Infinity;

    for (const minion of oppTeam) {
      const currDistance = getDistanceBetweenVectors(
        this.position,
        minion.position
      );
      if (currDistance < this.argoRange && currDistance < targetDistance) {
        currTarget = minion;
        targetDistance = currDistance;
      }
    }

    // Set closest target if one exists in argo range of Minion, otherwise set opposing Fortress as target
    if (currTarget) {
      this.target = currTarget;
    } else {
      this.target = [...oppTeam][0];
    }
  }

  // Path adjustments to Minions target vector as it apporaches/collides with other objects on the same team
  adjustPathingToTarget(team: Set<GameObject>) {
    // return if Minion is currently in Combat -> we don't want to adjust a Minion's pathing if it is currently fighting an enemy
    if (this.inCombat) return;

    // loop through Set of team Game Objects
    // iterate over the team in REVERSE ORDER OF INSERTION to ensure new Team Objects dont push Minion into older team Objects
    for (const obj of Array.from(team).reverse()) {
      // skip collision detection for the Minion against itself
      if (this.id === obj.id) continue;

      // calc distance between Minion and curr Game Object
      const dist = getDistanceBetweenVectors(this.position, obj.position);

      // call handleTeamCollision if Minion collides another team Game Object
      if (dist < this.radius * 2) {
        handleObjectCollision(this, obj);
      }
    }
  }

  // apart of the avoidance algo, if any team Minion inComabt is in this cone, rotate velocity vector 90 degrees
  calcVisionCone() {
    const vectorAngle = Math.atan2(this.velocity.y, this.velocity.x);
    this.visConeRight = vectorAngle - this.visionConeWidth / 2;
    this.visConeLeft = vectorAngle + this.visionConeWidth / 2;
  }

  attack(currMs: number) {
    if (this.target) {
      if (currMs - this.prevAttackTime < settings["minion-attack-cooldown"])
        return;
      this.prevAttackTime = currMs;
      this.target.hitPoints -= 10;
    }
  }

  destroy(team: Set<GameObject>) {
    team.delete(this);
    this.team = null;
    super.reset();
    return;
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (typeof this.team === "string") {
      // TEMP - draw vision Cone
      if (!this.inCombat) {
        ctx.beginPath();
        ctx.fillStyle = "rgba(255, 255, 0, 0.5)";
        ctx.moveTo(this.position.x, this.position.y);
        ctx.arc(
          this.position.x,
          this.position.y,
          this.argoRange,
          this.visConeRight,
          this.visConeLeft
        );
        ctx.fill();
        ctx.closePath;
      }

      // draw Minion body
      ctx.beginPath();
      ctx.fillStyle = this.team;
      ctx.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI);
      ctx.fill();
      ctx.closePath();

      // TEMP - Display hitpoints, ID, and Vector direction
      ctx.fillStyle = "black";
      ctx.font = "16px serif";
      ctx.fillText(this.hitPoints.toString(), this.position.x, this.position.y);
      ctx.fillText(this.id.toString(), this.position.x, this.position.y + 16);

      ctx.beginPath();
      ctx.strokeStyle = "black";
      ctx.moveTo(this.position.x, this.position.y);
      ctx.lineTo(
        this.position.x + this.velocity.x * 50,
        this.position.y + this.velocity.y * 50
      );
      ctx.stroke();
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
      if (
        getDistanceBetweenVectors(this.position, this.target.position) <=
        this.radius * 2
      ) {
        this.velocity.x = 0;
        this.velocity.y = 0;
        handleObjectCollision(this, this.target);
        this.inCombat = true;
      } else {
        this.velocity = updateObjectVectorToTarget(this);
        this.inCombat = false;
        this.position.x = roundHundrethPercision(
          this.position.x + this.velocity.x
        );
        this.position.y = roundHundrethPercision(
          this.position.y + this.velocity.y
        );
        this.calcVisionCone();
      }

      this.draw(ctx);
    }

    // testing target detection
    //if (this.target instanceof Minion) this.team = "green";
  }
}
