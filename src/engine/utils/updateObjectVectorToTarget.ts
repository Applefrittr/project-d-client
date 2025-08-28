import GameObject from "../classes/GameObject";
import roundHundrethPercision from "./roundHundrethPercision";
import settings from "../settings.json";

export default function updateVelocityVectorToTarget(obj: GameObject) {
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

    obj.velocity.x = dx * settings["minion-speed"];
    obj.velocity.y = dy * settings["minion-speed"];
  }
}
