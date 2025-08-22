import GameObject from "./GameObject";
import settings from "../settings.json";

export default class Fortress extends GameObject {
  team: string | null = null;
  argoRange = 200;

  constructor(team: "red" | "blue") {
    super();
    this.radius = settings["tower-radius"];
    this.hitPoints = settings["fortress-hitpoints"];
    this.team = team;
    if (team === "red") {
      this.x = settings["arena-width"] / 2 + settings["tower-radius"];
      this.y = settings["arena-height"] - settings["tower-radius"];
    } else {
      this.x = settings["arena-width"] / 2 - settings["tower-radius"];
      this.y = settings["tower-radius"];
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (this.team) {
      ctx.beginPath();
      ctx.fillStyle = this.team;
      ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
      ctx.fill();
      ctx.closePath();

      ctx.fillStyle = "black";
      ctx.font = "16px serif";
      ctx.fillText(this.hitPoints.toString(), this.x, this.y);
    }
  }
}
