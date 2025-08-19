import type GameObject from "../classes/GameObject";
import type Minion from "../classes/Minion";
import settings from "../settings.json";

// Iterate through the Minion Pool and assign the team property to unused Minions
export default function spawnWave(
  pool: Minion[],
  redTeam: GameObject[],
  blueTeam: GameObject[]
) {
  const waveSize = settings["minions-per-wave"];

  let redCount = 0,
    blueCount = 0,
    interval = 0;

  for (let i = 0; i < pool.length; i++) {
    if (redCount >= waveSize) break;
    else if (typeof pool[i].team === "string") continue;
    else {
      setTimeout(() => {
        pool[i].assignTeam("red");
        redTeam.push(pool[i]);
        pool[i].target = blueTeam[0];
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
    else if (typeof pool[j].team === "string") continue;
    else {
      setTimeout(() => {
        pool[j].assignTeam("blue");
        blueTeam.push(pool[j]);
        pool[j].target = redTeam[0];
        j % 2 === 0
          ? (pool[j].avoidancePathing = "left")
          : (pool[j].avoidancePathing = "right");
      }, interval);
      blueCount++;
      interval += 1000;
    }
  }

  console.log(pool, redTeam, blueTeam);
}
