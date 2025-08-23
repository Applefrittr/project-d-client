import GameObject from "../classes/GameObject";
import roundHundrethPercision from "./roundHundrethPercision";
import settings from "../settings.json";

export default function updateObjectVectorToTarget(obj: GameObject) {
  if (obj.target) {
    const targetX = obj.target.x;
    const targetY = obj.target.y;

    let dx = targetX - obj.x;
    let dy = targetY - obj.y;

    const dist = Math.round(Math.sqrt(dx ** 2 + dy ** 2));
    if (dist > 0) {
      dx = roundHundrethPercision(dx / dist);
      dy = roundHundrethPercision(dy / dist);
    }

    return [dx * settings["minion-speed"], dy * settings["minion-speed"]];
  }
  return [obj.x, obj.y];
}
