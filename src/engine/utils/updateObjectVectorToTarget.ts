import GameObject from "../classes/GameObject";
import roundHundrethPercision from "./roundHundrethPercision";

export default function updateObjectVectorToTarget(obj: GameObject) {
  const { x, y } = obj.targetCoordinates;

  let dx = x - obj.x;
  let dy = y - obj.y;

  const dist = Math.round(Math.sqrt(dx ** 2 + dy ** 2));
  if (dist > 0) {
    dx = Math.round(dx / dist);
    dy = Math.round(dy / dist);
  }

  return [dx, dy];
}
