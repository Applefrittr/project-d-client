import type Minion from "../classes/Minion";

// Iterate through the Minion Pool and assign the team property to unused Minions
export default function spawnWave(pool: Minion[]) {
  const waveSize = 3;

  let redCount = 0,
    blueCount = 0,
    interval = 0;

  for (let i = 0; i < pool.length; i++) {
    if (redCount >= waveSize) break;
    else if (typeof pool[i].team === "string") continue;
    else {
      setTimeout(() => {
        pool[i].assignTeam("red");
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
      }, interval);
      blueCount++;
      interval += 1000;
    }
  }

  console.log(pool);
}
