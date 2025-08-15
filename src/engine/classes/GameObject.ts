import settings from "../settings.json";

export default class GameObject {
  x: number = 0;
  y: number = settings["arena-height"];
  dx: number = 0;
  dy: number = 0;
  target: GameObject | null = null;

  reset() {
    this.x = 0;
    this.y = settings["arena-height"];
    this.dx = 0;
    this.dy = 0;
    this.target = null;
  }
}
