import GameObject from "../classes/GameObject";
import roundHundrethPercision from "./roundHundrethPercision";

export default function updateObjectVectorToTarget(obj: GameObject) {
  if (obj.target) {
    const targetX = obj.target.x;
    const targetY = obj.target.y;

    let dx = targetX - obj.x;
    let dy = targetY - obj.y;

    const dist = Math.round(Math.sqrt(dx ** 2 + dy ** 2));
    if (dist > 0) {
      dx = Math.round(dx / dist);
      dy = Math.round(dy / dist);
    }

    return [dx, dy];
  }
  return [obj.x, obj.y];
}
