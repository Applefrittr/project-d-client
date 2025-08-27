import GameObject from "../classes/GameObject";
import roundHundrethPercision from "./roundHundrethPercision";
import settings from "../settings.json";

export default function updateObjectVectorToTarget(obj: GameObject) {
  if (obj.target) {
    const targetX = obj.target.position.x;
    const targetY = obj.target.position.y;

    let dx = targetX - obj.position.x;
    let dy = targetY - obj.position.y;

    const dist = Math.round(Math.sqrt(dx ** 2 + dy ** 2));
    if (dist > 0) {
      dx = roundHundrethPercision(dx / dist);
      dy = roundHundrethPercision(dy / dist);
    }

    return {
      x: dx * settings["minion-speed"],
      y: dy * settings["minion-speed"],
    };
  }
  return { x: obj.position.x, y: obj.position.y };
}
