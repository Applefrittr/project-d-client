import settings from "../settings.json";
import roundHundrethPercision from "../utils/roundHundrethPercision";
import handleObjectCollision from "../utils/handleObjectCollision";
import updateObjectVectorToTarget from "../utils/updateObjectVectorToTarget";
import GameObject from "./GameObject";
import getDistanceBetweenVectors from "../utils/getDistanceBetweenVectors";
import vectorIntersectsObject from "../utils/vectorIntersectsObject";

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
  immediateCollisionThreat: GameObject | null = null;

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
    updateObjectVectorToTarget(this);
  }

  // Path adjustments to Minions target vector as it apporaches/collides with other objects on the same team
  adjustPathingToTarget(team: Set<GameObject>) {
    // return if Minion is currently in Combat -> we don't want to adjust a Minion's pathing if it is currently fighting an enemy
    if (this.inCombat) return;

    let closestCollisionThreat: GameObject | null = null;
    let closestCollisionThreatDist = Infinity;

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
        continue;
      }

      // check to see if Minion's Look Ahead vectors intersect w/ curr Game Object
      // if so, set the closest one to the Minions immediateCollisonTreat prop
      if (vectorIntersectsObject(this.lookAhead, this.lookAhead2x, obj)) {
        if (
          !closestCollisionThreat ||
          (dist < closestCollisionThreatDist && closestCollisionThreat)
        ) {
          closestCollisionThreat = obj;
          closestCollisionThreatDist = dist;
        }
      }
    }
    this.immediateCollisionThreat = closestCollisionThreat;
  }

  collisionAvoidance() {
    if (this.immediateCollisionThreat) {
      const avoidX = this.immediateCollisionThreat.position.x;
      const avoidY = this.immediateCollisionThreat.position.y;

      let dx = this.lookAhead.x - avoidX;
      let dy = this.lookAhead.y - avoidY;

      const dist = Math.sqrt(dx ** 2 + dy ** 2);
      if (dist > 0) {
        dx = roundHundrethPercision(dx / dist);
        dy = roundHundrethPercision(dy / dist);
      }

      this.velocity.x = this.velocity.x + dx * settings["minion-speed"];
      //this.velocity.y = this.velocity.y + dy * settings["minion-speed"];
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
      // if (!this.inCombat) {
      //   ctx.beginPath();
      //   ctx.fillStyle = "rgba(255, 255, 0, 0.5)";
      //   ctx.moveTo(this.position.x, this.position.y);
      //   ctx.arc(
      //     this.position.x,
      //     this.position.y,
      //     this.argoRange,
      //     this.visConeRight,
      //     this.visConeLeft
      //   );
      //   ctx.fill();
      //   ctx.closePath;
      // }

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
      ctx.lineTo(this.lookAhead.x, this.lookAhead.y);
      ctx.stroke();

      ctx.beginPath();
      ctx.strokeStyle = "orange";
      ctx.moveTo(this.position.x, this.position.y);
      ctx.lineTo(this.lookAhead2x.x, this.lookAhead2x.y);
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
        this.inCombat = false;

        if (this.immediateCollisionThreat) {
          this.collisionAvoidance();
        }
        // else {
        //   updateObjectVectorToTarget(this);
        // }

        this.position.x = roundHundrethPercision(
          this.position.x + this.velocity.x
        );
        this.position.y = roundHundrethPercision(
          this.position.y + this.velocity.y
        );
        this.lookAhead.x =
          this.position.x +
          this.velocity.x * (settings["minion-look-ahead-max"] / 2);
        this.lookAhead.y =
          this.position.y +
          this.velocity.y * (settings["minion-look-ahead-max"] / 2);
        this.lookAhead2x.x =
          this.position.x + this.velocity.x * settings["minion-look-ahead-max"];
        this.lookAhead2x.y =
          this.position.y + this.velocity.y * settings["minion-look-ahead-max"];
        this.calcVisionCone();
      }

      this.draw(ctx);
    }

    // testing target detection
    //if (this.target instanceof Minion) this.team = "green";
  }
}
