import GameObject from "./GameObject";
import settings from "../settings.json";

export default class Fortress extends GameObject {
  team: string | null = null;
  argoRange = 200;

  constructor(team: "red" | "blue") {
    super();
    this.team = team;
    if ((team = "red")) {
      this.x = settings["arena-width"] - 10;
      this.y = settings["arena-height"] - 10;
    } else {
      this.x = 10;
      this.y = 10;
    }
  }
}
