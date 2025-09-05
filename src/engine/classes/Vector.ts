import roundHundrethPercision from "../utils/roundHundrethPercision";

export default class Vector {
  x: number = 0;
  y: number = 0;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  getMagnitude() {
    return Math.sqrt(this.x ** 2 + this.y ** 2);
  }

  normalize() {
    const magnitude = Math.sqrt(this.x ** 2 + this.y ** 2);
    this.x = roundHundrethPercision(this.x / magnitude);
    this.y = roundHundrethPercision(this.y / magnitude);
    return this;
  }

  scaler(n: number) {
    this.x *= n;
    this.y *= n;
    return this;
  }

  add(v: Vector) {
    this.x += v.x;
    this.y += v.y;
    return this;
  }

  subtract(v: Vector) {
    this.x -= v.x;
    this.y -= v.y;
    return this;
  }

  update(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}
