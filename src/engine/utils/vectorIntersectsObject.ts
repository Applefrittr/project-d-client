import type GameObject from "../classes/GameObject";
import Vector from "../classes/Vector";
import getDistanceBetweenVectors from "./getDistanceBetweenVectors";

export default function vectorIntersectsObject(
  vector1: Vector,
  vector2: Vector,
  obj: GameObject
) {
  const dist1 = getDistanceBetweenVectors(vector1, obj.position);
  const dist2 = getDistanceBetweenVectors(vector2, obj.position);

  return dist1 <= obj.radius * 2 || dist2 <= obj.radius * 2;
}
