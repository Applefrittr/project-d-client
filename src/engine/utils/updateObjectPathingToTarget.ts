import GameObject from "../classes/GameObject";
import roundHundrethPercision from "./roundHundrethPercision";

export default function updateObjectPathingToTarget(obj: GameObject) {
  const { x, y } = obj.targetCoordinates;

  let dx = x - obj.x;
  let dy = y - obj.y;

  if (Math.abs(dx) > Math.abs(dy)) {
    dy >= 0
      ? (dy = roundHundrethPercision(dy / dx))
      : (dy = -roundHundrethPercision(dy / dx));
    dx >= 0 ? (dx = 1) : (dy = -1);
  } else {
    dx >= 0
      ? (dx = roundHundrethPercision(dx / dy))
      : (dx = -roundHundrethPercision(dx / dy));
    dy >= 0 ? (dy = 1) : (dy = -1);
  }

  return [dx, dy];
}
