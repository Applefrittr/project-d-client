import Minion from "../classes/Minion";

export default function initializeMinionPool() {
  const pool = new Array(100);

  for (let i = 0; i < pool.length; i++) {
    pool[i] = new Minion();
  }

  return pool;
}
