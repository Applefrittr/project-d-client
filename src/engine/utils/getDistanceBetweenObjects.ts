import type GameObject from "../classes/GameObject";

// Use Pythagorean Theorem to find distance between 2 game objects
export default function getDistanceBetweenObjects(
  obj1: GameObject,
  obj2: GameObject
): number {
  const a = (obj1.x - obj2.x) ** 2;
  const b = (obj1.y - obj2.y) ** 2;

  return Math.round(Math.sqrt(a + b) * 100) / 100;
}
