import Vector from "../classes/Vector";

export default function vectorLerp(
  vector1: Vector,
  vector2: Vector,
  mag: number
) {
  const newV1 = new Vector(vector1.x, vector1.y);
  const newv2 = new Vector(vector2.x, vector2.y);

  newV1.scaler(1 - mag);
  newv2.scaler(mag);

  return newV1.add(newv2);
}
