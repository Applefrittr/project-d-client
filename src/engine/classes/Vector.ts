export default class Vector {
  x: number = 0;
  y: number = 0;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  normalize() {
    const magnitude = Math.sqrt(this.x ** 2 + this.y ** 2);
    this.x /= magnitude;
    this.y /= magnitude;
  }
}
