import GameObject from "../classes/GameObject";
import settings from "../settings.json";
import Vector from "../classes/Vector";

export default function updateVelocityVectorToTarget(obj: GameObject) {
  if (obj.target) {
    const targetX = obj.target.position.x;
    const targetY = obj.target.position.y;

    const newVector = new Vector(
      targetX - obj.position.x,
      targetY - obj.position.y
    ).normalize();

    obj.velocity.x = newVector.x * settings["minion-speed"];
    obj.velocity.y = newVector.y * settings["minion-speed"];
  }
}
