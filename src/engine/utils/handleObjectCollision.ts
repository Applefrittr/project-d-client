import type GameObject from "../classes/GameObject";
import roundHundrethPercision from "./roundHundrethPercision";

// Hanldes collision between 2 Game Objects -> the subject Game Object and the collided Game Object
export default function handleObjectCollision(
  subject: GameObject,
  collided: GameObject
) {
  // Calc angle of collision
  let radAngle = Math.atan2(subject.x - collided.x, subject.y - collided.y);

  // modifier to adjust angle of impact, helps to prevent minions stacking if angle of collision is 0
  // helps with initial minion clash to form battle line
  if (radAngle === 0) radAngle += 0.25;

  // reposition subject Game Object outside of collided Game Object to ensure no overlap based on collision angle
  subject.y = roundHundrethPercision(
    collided.y + subject.radius * 2 * Math.cos(radAngle)
  );
  subject.x = roundHundrethPercision(
    collided.x + subject.radius * 2 * Math.sin(radAngle)
  );
}
