import Minion from "../classes/Minion";

export default function initializeMinionPool(pool: Minion[], count: number) {
  for (let i = 0; i < count; i++) {
    pool.push(new Minion());
  }

  return pool;
}
