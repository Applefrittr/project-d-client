import type GameObject from "../classes/GameObject";
import type Minion from "../classes/Minion";
import settings from "../settings.json";

// Iterate through the Minion Pool and assign the team property to unused Minions
export default function spawnWave(
  pool: Minion[],
  redTeam: Set<GameObject>,
  blueTeam: Set<GameObject>
) {
  const waveSize = settings["minions-per-wave"];

  let redCount = 0,
    blueCount = 0,
    interval = 0;

  for (let i = 0; i < pool.length; i++) {
    if (redCount >= waveSize) break;
    if (!pool[i].team) {
      setTimeout(() => {
        pool[i].assignTeam("red");
        pool[i].radius = 25;
        pool[i].hitPoints = settings["minion-hp"];
        redTeam.add(pool[i]);
        pool[i].target = [...blueTeam][0];
        i % 2 === 0
          ? (pool[i].avoidancePathing = "left")
          : (pool[i].avoidancePathing = "right");
      }, interval);
      redCount++;
      interval += 1000;
    }
  }

  interval = 0;

  for (let j = pool.length - 1; j >= 0; j--) {
    if (blueCount >= waveSize) break;

    if (!pool[j].team) {
      setTimeout(() => {
        pool[j].assignTeam("blue");
        pool[j].radius = 25;
        pool[j].hitPoints = settings["minion-hp"];
        blueTeam.add(pool[j]);
        pool[j].target = [...redTeam][0];
        j % 2 === 0
          ? (pool[j].avoidancePathing = "left")
          : (pool[j].avoidancePathing = "right");
      }, interval);
      blueCount++;
      interval += 1000;
    }
  }

  console.log("wave spawned!");
}
