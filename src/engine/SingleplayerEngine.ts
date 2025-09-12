import Minion from "./classes/Minion";
import initializeMinionPool from "./functions/intializeMinionPool";
import settings from "./settings.json";
import Fortress from "./classes/Fortress";
import spawnMinions from "./functions/spawnMinions";
import BaseEngine from "./BaseEngine";
import type GameObject from "./classes/GameObject";

export default class SinglePlayerEngine extends BaseEngine {
  prevWaveTime: number = 0;
  prevMinionSpawn: number = 0;
  minionsSpawnedCurrWave: number = 0;
  minionPool: Minion[] = [];
  gameObjects: GameObject[] = [];
  isPaused: boolean = false;
  isWaveSpawning: boolean = true;
  startTime: number = 0;
  pausedTime: number = 0;

  constructor(width: number, height: number) {
    super(width, height);
  }

  // intialize creates intial gamestate and creates object pools
  initialize() {
    console.log("initializing...");

    this.gameObjects.push(new Fortress("blue"));
    this.gameObjects.push(new Fortress("red"));
    this.minionPool = initializeMinionPool(this.minionPool, 100);

    console.log("done");
  }

  // render function loops through all game assets (class instances) and calls their respective update()

  // Iterate through GameObjects, update and render based on class (Minion, Fortress, Tower)
  updateAndRenderObjects(currMs: number) {
    if (this.ctx) {
      this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

      // refactor filter out dead then update
      this.gameObjects = this.gameObjects.filter((obj) => obj.hitPoints > 0);

      for (const obj of this.gameObjects) {
        if (obj instanceof Minion) {
          if (obj.inCombat) {
            obj.attack(currMs);
          }
          obj.adjustPathingToTarget(this.gameObjects);
          obj.detectTarget(this.gameObjects);
          obj.update(this.ctx);
        } else if (obj instanceof Fortress) {
          obj.draw(this.ctx);
        } else continue;
      }
    }
  }

  close() {
    window.cancelAnimationFrame(this.frame);
    this.minionPool = [];
    this.gameObjects = [];
    this.startTime = 0;
    this.pausedTime = 0;
  }

  pause() {
    if (!this.isPaused) {
      cancelAnimationFrame(this.frame);
      this.pausedTime += performance.now() - (this.startTime + this.startTime);
      this.isPaused = true;
    } else {
      this.startTime = performance.now();
      this.frame = window.requestAnimationFrame(this.loop);
      this.isPaused = false;
    }
    console.log("minons: ", this.minionPool);
    console.log("objects: ", this.gameObjects);
  }

  // main game loop -> loop is executed via requestAnimationFrame, checks game state, keeps track of game time, checks for win/lose conditions and calls render function
  loop = (msNow: number) => {
    // set intial start time of game loop
    if (!this.startTime) this.startTime = msNow;

    // Current in game time -> used for gamestate checks and rendering
    // Ensures game continues at a consistance pace, even when game is paused/resumed
    const gameTime = msNow - this.startTime - this.pausedTime;

    // Set initial time value for prevWaveSpawn -> used to calculate when to spawn Minion waves
    if (!this.prevWaveTime) this.prevWaveTime = gameTime;

    this.frame = window.requestAnimationFrame(this.loop);

    // fpsController ensures render and game state checks are locked to specific FPS
    if (!this.fpsController.renderFrame(gameTime)) return;

    // toggle spawn wave switch on if time elasped between waves exceeds settings['time-between-waves]
    if (gameTime - this.prevWaveTime >= settings["time-between-waves"]) {
      this.isWaveSpawning = true;
      this.prevWaveTime = gameTime;
    }

    // spawns minions based on settings["time-between-minions"] interval
    if (
      this.isWaveSpawning &&
      this.minionPool &&
      gameTime - this.prevMinionSpawn >= settings["time-between-minions"]
    ) {
      spawnMinions(this.minionPool, this.gameObjects);
      this.prevMinionSpawn = gameTime;
      this.minionsSpawnedCurrWave++;
      // checks to see if amount of minions spawned during current wave exceeds max per wave, if so, end wave spawning cycle
      if (this.minionsSpawnedCurrWave >= settings["minions-per-wave"]) {
        this.isWaveSpawning = false;
        this.minionsSpawnedCurrWave = 0;
      }
    }

    this.updateAndRenderObjects(gameTime);
  };
}
